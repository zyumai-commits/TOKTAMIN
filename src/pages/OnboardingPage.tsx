import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { HEALTH_GOALS } from '@/constants/plans'
import type { HealthGoal } from '@/types'
import { cn } from '@/lib/utils'

export default function OnboardingPage() {
  const { user } = useAuth()
  const { updateProfile } = useProfile(user?.id)
  const navigate = useNavigate()

  const [selected, setSelected] = useState<HealthGoal | null>(null)
  const [loading, setLoading] = useState(false)

  const handleNext = async () => {
    if (!selected) return
    setLoading(true)
    updateProfile(
      { health_goal: selected },
      {
        onSuccess: () => {
          navigate('/pricing')
        },
        onError: () => {
          // 실패해도 진행 허용
          navigate('/pricing')
        },
        onSettled: () => setLoading(false),
      }
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      {/* 진행 표시 */}
      <div className="mb-10 flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-primary-900" />
        <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
        <div className="h-1.5 flex-1 rounded-full bg-gray-200" />
      </div>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
          어떤 건강 목표가 있으신가요?
        </h1>
        <p className="mt-3 text-gray-500">
          목표에 맞는 영양제를 맞춤 추천해 드립니다
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {HEALTH_GOALS.map((goal) => (
          <button
            key={goal.id}
            onClick={() => setSelected(goal.id)}
            className={cn(
              'group rounded-2xl border-2 p-6 text-left transition hover:border-primary-900 hover:bg-primary-50',
              selected === goal.id
                ? 'border-primary-900 bg-primary-50'
                : 'border-gray-200 bg-white'
            )}
          >
            <div className="mb-3 text-3xl">{goal.icon}</div>
            <div className="mb-1 text-base font-bold text-gray-900">{goal.label}</div>
            <p className="mb-4 text-sm text-gray-500">{goal.description}</p>
            <div className="flex flex-wrap gap-1.5">
              {goal.supplements.map((s) => (
                <span
                  key={s}
                  className={cn(
                    'rounded-full px-2.5 py-1 text-xs font-medium',
                    selected === goal.id
                      ? 'bg-primary-900 text-white'
                      : 'bg-gray-100 text-gray-600'
                  )}
                >
                  {s}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={handleNext}
          disabled={!selected || loading}
          className="flex items-center gap-2 rounded-xl bg-primary-900 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-primary-800 disabled:opacity-50"
        >
          {loading ? '저장 중...' : '맞춤 플랜 보기'}
          {!loading && <ArrowRight size={16} />}
        </button>
      </div>
    </div>
  )
}
