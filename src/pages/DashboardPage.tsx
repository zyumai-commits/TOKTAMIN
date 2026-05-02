import { Bell } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useHabitLogs } from '@/hooks/useHabitLogs'
import HabitCalendar from '@/components/dashboard/HabitCalendar'
import { getToday } from '@/lib/utils'
import { HEALTH_GOALS } from '@/constants/plans'
import { cn } from '@/lib/utils'

export default function DashboardPage() {
  const { user } = useAuth()
  const { profile } = useProfile(user?.id)
  const { toggleLog, getStreakData } = useHabitLogs(user?.id)
  const today = getToday()

  const { completedDates } = getStreakData()
  const takenToday = completedDates.has(today)

  const goal = HEALTH_GOALS.find((g) => g.id === profile?.health_goal)
  const firstName = profile?.full_name?.split(' ')[0] ?? '님'

  const hours = new Date().getHours()
  const greeting =
    hours < 12 ? '좋은 아침이에요' :
    hours < 18 ? '안녕하세요' :
    '좋은 저녁이에요'

  return (
    <div className="pb-4">
      {/* 상단 헤더 */}
      <div className="bg-white px-4 pb-4 pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500">{greeting} 👋</p>
            <h1 className="mt-0.5 text-xl font-extrabold text-gray-900">
              {firstName}님
            </h1>
          </div>
          <button className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
            <Bell size={20} />
          </button>
        </div>

        {/* 오늘의 복용 체크 */}
        <button
          onClick={() => toggleLog(today)}
          className={cn(
            'mt-4 w-full rounded-2xl py-4 text-base font-bold transition',
            takenToday
              ? 'bg-teal-600 text-white'
              : 'bg-primary-900 text-white hover:bg-primary-800'
          )}
        >
          {takenToday ? '✓ 오늘 복용 완료!' : '오늘 복용 완료 체크하기'}
        </button>
      </div>

      {/* 건강 목표 배지 */}
      {goal && (
        <div className="mx-4 mt-4 flex items-center gap-2 rounded-xl bg-teal-50 px-4 py-3">
          <span className="text-xl">{goal.icon}</span>
          <div>
            <span className="text-xs text-teal-600 font-semibold">현재 목표</span>
            <p className="text-sm font-bold text-teal-800">{goal.label}</p>
          </div>
          <div className="ml-auto flex gap-1.5">
            {goal.supplements.map((s) => (
              <span key={s} className="rounded-full bg-teal-100 px-2 py-0.5 text-xs text-teal-700">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 66일 캘린더 */}
      <div className="mt-6">
        <HabitCalendar userId={user?.id ?? ''} />
      </div>
    </div>
  )
}
