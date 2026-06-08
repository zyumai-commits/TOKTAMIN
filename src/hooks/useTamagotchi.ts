import { useState, useEffect, useCallback, useRef } from 'react'
import { TamagotchiState, AnimalType, ItemCategory } from '@/types/tamagotchi'

const STORAGE_KEY = 'toktamin-tamagotchi-v1'
const TICK_MS = 5000

function clamp(v: number, lo = 0, hi = 100) {
  return Math.max(lo, Math.min(hi, v))
}

function applyDecay(state: TamagotchiState, now: number): Partial<TamagotchiState> {
  const elapsed = (now - state.lastUpdated) / 1000

  const hungerRate = state.isSleeping ? 0.8 : 2.5
  const happinessRate = state.isSleeping ? 0 : 1.5

  const newHunger = clamp(state.hunger - hungerRate * elapsed / 100)
  const newHappiness = clamp(state.happiness - happinessRate * elapsed / 100)

  let healthDelta = 0
  if (state.isSleeping) {
    healthDelta = 0.8 * elapsed / 100
  } else {
    if (newHunger < 20) healthDelta -= 1.2 * elapsed / 100
    if (newHappiness < 20) healthDelta -= 0.6 * elapsed / 100
  }

  // 1 game day = 10 real minutes
  const ageDay = Math.floor((now - state.createdAt) / (10 * 60 * 1000)) + 1

  return {
    hunger: newHunger,
    happiness: newHappiness,
    health: clamp(state.health + healthDelta),
    ageDay,
    lastUpdated: now,
  }
}

function makeInitial(animalType: AnimalType, name: string): TamagotchiState {
  const now = Date.now()
  return {
    animalType,
    name,
    ageDay: 1,
    hunger: 80,
    happiness: 80,
    intimacy: 30,
    health: 90,
    equippedItems: { hat: 'none', shirt: 'none', acc: 'none' },
    lastUpdated: now,
    createdAt: now,
    isSleeping: false,
    currentAction: 'idle',
    lastFed: 0,
    lastPlayed: 0,
    lastPetted: 0,
  }
}

export function useTamagotchi() {
  const [state, setState] = useState<TamagotchiState | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const actionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: TamagotchiState = JSON.parse(raw)
        const now = Date.now()
        const decayed = applyDecay(parsed, now)
        setState({ ...parsed, ...decayed, currentAction: 'idle' })
      }
    } catch {
      // corrupted save — start fresh
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    }
  }, [state])

  useEffect(() => {
    if (!state) return
    const id = setInterval(() => {
      setState(prev => {
        if (!prev) return prev
        return { ...prev, ...applyDecay(prev, Date.now()) }
      })
    }, TICK_MS)
    return () => clearInterval(id)
  }, [state !== null]) // eslint-disable-line react-hooks/exhaustive-deps

  const clearActionTimer = () => {
    if (actionTimer.current) {
      clearTimeout(actionTimer.current)
      actionTimer.current = null
    }
  }

  const scheduleResetAction = (ms: number) => {
    clearActionTimer()
    actionTimer.current = setTimeout(() => {
      setState(prev => (prev ? { ...prev, currentAction: 'idle' } : prev))
    }, ms)
  }

  const createNew = useCallback((animalType: AnimalType, name: string) => {
    setState(makeInitial(animalType, name))
  }, [])

  const feed = useCallback(() => {
    const now = Date.now()
    setState(prev => {
      if (!prev || now - prev.lastFed < 30_000) return prev
      return {
        ...prev,
        hunger: clamp(prev.hunger + 40),
        intimacy: clamp(prev.intimacy + 5),
        currentAction: 'eating',
        lastFed: now,
        lastUpdated: now,
      }
    })
    scheduleResetAction(2000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const play = useCallback(() => {
    const now = Date.now()
    setState(prev => {
      if (!prev || now - prev.lastPlayed < 30_000) return prev
      return {
        ...prev,
        happiness: clamp(prev.happiness + 25),
        hunger: clamp(prev.hunger - 10),
        intimacy: clamp(prev.intimacy + 10),
        currentAction: 'playing',
        lastPlayed: now,
        lastUpdated: now,
      }
    })
    scheduleResetAction(2000)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const pet = useCallback(() => {
    const now = Date.now()
    setState(prev => {
      if (!prev || now - prev.lastPetted < 10_000) return prev
      return {
        ...prev,
        intimacy: clamp(prev.intimacy + 15),
        happiness: clamp(prev.happiness + 10),
        currentAction: 'petting',
        lastPetted: now,
        lastUpdated: now,
      }
    })
    scheduleResetAction(1500)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleSleep = useCallback(() => {
    setState(prev => {
      if (!prev) return prev
      return {
        ...prev,
        isSleeping: !prev.isSleeping,
        currentAction: prev.isSleeping ? 'idle' : 'sleeping',
        lastUpdated: Date.now(),
      }
    })
  }, [])

  const equipItem = useCallback((category: ItemCategory, itemId: string) => {
    setState(prev => {
      if (!prev) return prev
      return {
        ...prev,
        equippedItems: { ...prev.equippedItems, [category]: itemId },
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setState(null)
  }, [])

  return { state, isLoaded, createNew, feed, play, pet, toggleSleep, equipItem, resetGame }
}
