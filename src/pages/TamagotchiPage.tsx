import { useState } from 'react'
import { useTamagotchi } from '@/hooks/useTamagotchi'
import { AnimalDisplay } from '@/components/tamagotchi/AnimalDisplay'
import { StatBars } from '@/components/tamagotchi/StatBars'
import { ActionButtons } from '@/components/tamagotchi/ActionButtons'
import { WardrobeModal } from '@/components/tamagotchi/WardrobeModal'
import { AnimalType, ItemCategory } from '@/types/tamagotchi'

const ANIMALS: { type: AnimalType; emoji: string; name: string; desc: string }[] = [
  { type: 'cat',     emoji: '🐱', name: '고양이', desc: '도도하지만 사실 스킨십 좋아함' },
  { type: 'dog',     emoji: '🐶', name: '강아지', desc: '언제나 신나고 활발한 친구' },
  { type: 'rabbit',  emoji: '🐰', name: '토끼',   desc: '조용하고 귀여운 작은 친구' },
  { type: 'hamster', emoji: '🐹', name: '햄스터', desc: '통통하고 귀여운 볼주머니' },
]

function NewGameScreen({ onCreate }: { onCreate: (type: AnimalType, name: string) => void }) {
  const [selected, setSelected] = useState<AnimalType>('cat')
  const [name, setName] = useState('')

  function handleStart() {
    if (!name.trim()) return
    onCreate(selected, name.trim())
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-orange-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="text-5xl">🥚</div>
          <h1 className="text-3xl font-extrabold text-purple-700">나의 다마고치</h1>
          <p className="text-gray-500 text-sm">함께할 친구를 선택해 주세요!</p>
        </div>

        {/* Animal selection */}
        <div className="grid grid-cols-2 gap-3">
          {ANIMALS.map(a => (
            <button
              key={a.type}
              onClick={() => setSelected(a.type)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                selected === a.type
                  ? 'border-purple-400 bg-purple-50 shadow-md scale-105'
                  : 'border-gray-200 bg-white hover:border-purple-200'
              }`}
            >
              <span className="text-5xl">{a.emoji}</span>
              <span className="font-bold text-gray-800">{a.name}</span>
              <span className="text-xs text-gray-500 text-center leading-tight">{a.desc}</span>
            </button>
          ))}
        </div>

        {/* Name input */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-gray-700">친구 이름</label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleStart()}
            placeholder="이름을 입력하세요"
            maxLength={10}
            className="w-full px-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-purple-400 focus:outline-none text-gray-800 placeholder-gray-400 bg-white transition-colors"
          />
        </div>

        <button
          onClick={handleStart}
          disabled={!name.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🎉 게임 시작!
        </button>
      </div>
    </div>
  )
}

export default function TamagotchiPage() {
  const { state, isLoaded, createNew, feed, play, pet, toggleSleep, equipItem, resetGame } = useTamagotchi()
  const [wardrobeOpen, setWardrobeOpen] = useState(false)
  const [showResetConfirm, setShowResetConfirm] = useState(false)

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-50 flex items-center justify-center">
        <div className="text-4xl animate-pulse">🥚</div>
      </div>
    )
  }

  if (!state) {
    return <NewGameScreen onCreate={createNew} />
  }

  function handleEquip(category: ItemCategory, id: string) {
    equipItem(category, id)
  }

  const animalName = ANIMALS.find(a => a.type === state.animalType)?.name ?? '친구'

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-orange-50 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-6 pb-2">
        <div>
          <h1 className="text-xl font-extrabold text-purple-800">{state.name}</h1>
          <p className="text-sm text-gray-500">
            {animalName} · 태어난 지 {state.ageDay}일째
          </p>
        </div>
        <button
          onClick={() => setShowResetConfirm(true)}
          className="text-xs text-gray-400 hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-50"
        >
          새 게임
        </button>
      </div>

      {/* Animal display */}
      <div className="mt-2">
        <AnimalDisplay state={state} />
      </div>

      {/* Stats */}
      <div className="mt-4">
        <StatBars state={state} />
      </div>

      {/* Actions */}
      <div className="mt-4">
        <ActionButtons
          state={state}
          onFeed={feed}
          onPlay={play}
          onPet={pet}
          onToggleSleep={toggleSleep}
        />
      </div>

      {/* Wardrobe button */}
      <div className="mt-4 px-4">
        <button
          onClick={() => setWardrobeOpen(true)}
          className="w-full py-4 rounded-2xl bg-white border-2 border-purple-200 text-purple-600 font-bold text-base hover:bg-purple-50 hover:border-purple-300 transition-all active:scale-95 shadow-sm"
        >
          👗 옷 입히기
        </button>
      </div>

      {/* Wardrobe modal */}
      {wardrobeOpen && (
        <WardrobeModal
          equipped={state.equippedItems}
          onEquip={handleEquip}
          onClose={() => setWardrobeOpen(false)}
        />
      )}

      {/* Reset confirm dialog */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-3xl p-6 max-w-xs w-full shadow-2xl space-y-4">
            <p className="text-center text-gray-800 font-semibold text-lg">
              정말로 새 게임을 시작할까요?
            </p>
            <p className="text-center text-gray-500 text-sm">
              {state.name}와의 모든 추억이 사라져요 😢
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-semibold hover:bg-gray-200 transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => { resetGame(); setShowResetConfirm(false) }}
                className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
              >
                새 게임
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
