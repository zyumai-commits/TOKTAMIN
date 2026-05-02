import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { getToday } from '@/lib/utils'
import type { HabitLog } from '@/types'

export function useHabitLogs(userId: string | undefined, startDate?: string) {
  const queryClient = useQueryClient()

  const { data: logs = [], isLoading } = useQuery<HabitLog[]>({
    queryKey: ['habit-logs', userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('user_id', userId!)
        .order('date', { ascending: true })
      if (error) throw error
      return data as HabitLog[]
    },
  })

  const toggleLog = useMutation({
    mutationFn: async (date: string) => {
      const existing = logs.find((l) => l.date === date)
      if (existing) {
        const { error } = await supabase
          .from('habit_logs')
          .update({ status: !existing.status })
          .eq('id', existing.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('habit_logs').insert({
          user_id: userId!,
          date,
          status: true,
        })
        if (error) throw error
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['habit-logs', userId] })
    },
  })

  const getStreakData = () => {
    const completedDates = new Set(logs.filter((l) => l.status).map((l) => l.date))
    const today = getToday()
    let currentStreak = 0

    for (let i = 0; i < 66; i++) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split('T')[0]
      if (completedDates.has(dateStr)) {
        currentStreak++
      } else {
        break
      }
    }

    // 66일 그리드용 날짜 배열 생성
    const challengeStart = startDate ?? today
    const days = Array.from({ length: 66 }, (_, i) => {
      const d = new Date(challengeStart)
      d.setDate(d.getDate() + i)
      return d.toISOString().split('T')[0]
    })

    return {
      logs,
      completedDates,
      currentStreak,
      totalCompleted: completedDates.size,
      days,
      today,
    }
  }

  return { logs, isLoading, toggleLog: toggleLog.mutate, getStreakData }
}
