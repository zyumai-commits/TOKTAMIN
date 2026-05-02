import { useAuth } from '@/hooks/useAuth'
import HabitCalendar from '@/components/dashboard/HabitCalendar'
import { useHabitLogs } from '@/hooks/useHabitLogs'

export default function HabitsPage() {
  const { user } = useAuth()
  const { getStreakData } = useHabitLogs(user?.id)
  const { currentStreak, totalCompleted } = getStreakData()

  return (
    <div className="pb-4">
      <div className="bg-white px-4 pb-4 pt-6">
        <h1 className="text-xl font-extrabold text-gray-900">습관 트래커</h1>
        <p className="mt-1 text-sm text-gray-500">
          매일 영양제를 복용하고 66일 챌린지를 완성하세요
        </p>
      </div>

      {/* 통계 */}
      <div className="mx-4 mt-4 grid grid-cols-3 gap-3">
        {[
          { label: '연속 달성', value: `${currentStreak}일`, color: 'text-primary-900' },
          { label: '총 완료', value: `${totalCompleted}일`, color: 'text-teal-600' },
          { label: '남은 날', value: `${Math.max(0, 66 - totalCompleted)}일`, color: 'text-gray-600' },
        ].map(({ label, value, color }) => (
          <div key={label} className="rounded-xl bg-white p-3 text-center shadow-sm">
            <div className={`text-2xl font-extrabold ${color}`}>{value}</div>
            <div className="mt-1 text-xs text-gray-500">{label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <HabitCalendar userId={user?.id ?? ''} />
      </div>
    </div>
  )
}
