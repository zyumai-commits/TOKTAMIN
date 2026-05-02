import { cn } from '@/lib/utils'
import { useHabitLogs } from '@/hooks/useHabitLogs'
import { getToday } from '@/lib/utils'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

interface HabitCalendarProps {
  userId: string
  startDate?: string
}

export default function HabitCalendar({ userId, startDate }: HabitCalendarProps) {
  const { isLoading, toggleLog, getStreakData } = useHabitLogs(userId, startDate)

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    )
  }

  const { completedDates, currentStreak, totalCompleted, days, today } = getStreakData()

  return (
    <div className="px-4">
      {/* 스트릭 배너 */}
      <div className="mb-5 flex items-center gap-4 rounded-2xl bg-primary-900 p-5 text-white">
        <div className="text-center">
          <div className="text-4xl font-extrabold leading-none">{currentStreak}</div>
          <div className="mt-1 text-xs text-primary-200">연속 달성</div>
        </div>
        <div className="h-10 w-px bg-white/20" />
        <div className="flex-1">
          <div className="text-base font-bold">
            {currentStreak > 0 ? `${currentStreak}일 연속 달성중 🔥` : '오늘부터 시작해요!'}
          </div>
          <div className="mt-1 text-sm text-primary-200">
            총 {totalCompleted}/66일 완료
          </div>
          {/* 진행 바 */}
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-teal-400 transition-all duration-500"
              style={{ width: `${(totalCompleted / 66) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* 66일 그리드 */}
      <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
        66일 챌린지
      </p>
      <div className="grid grid-cols-11 gap-1.5">
        {days.map((date, idx) => {
          const isCompleted = completedDates.has(date)
          const isToday = date === today
          const isPast = date < today
          const isFuture = date > today

          return (
            <button
              key={date}
              onClick={() => !isFuture && toggleLog(date)}
              disabled={isFuture}
              title={`${idx + 1}일차 (${date})`}
              className={cn(
                'aspect-square rounded-lg text-xs font-semibold transition-all',
                isCompleted
                  ? 'bg-teal-600 text-white shadow-sm hover:bg-teal-500'
                  : isToday
                    ? 'bg-primary-100 text-primary-900 ring-2 ring-primary-900 hover:bg-primary-200'
                    : isPast
                      ? 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                      : 'cursor-default bg-gray-50 text-gray-200'
              )}
            >
              {idx + 1}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-teal-600" />
          <span>완료</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-primary-100 ring-1 ring-primary-900" />
          <span>오늘</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded bg-gray-100" />
          <span>미완료</span>
        </div>
      </div>
    </div>
  )
}
