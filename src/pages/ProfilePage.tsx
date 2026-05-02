import { useNavigate } from 'react-router-dom'
import { LogOut, ChevronRight, Target } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { useSubscription } from '@/hooks/useSubscription'
import { HEALTH_GOALS, PLANS } from '@/constants/plans'
import { formatDate } from '@/lib/utils'

const PLAN_LABELS: Record<string, string> = {
  none: '구독 없음',
  lite: 'LITE',
  basic: 'BASIC',
  pro: 'PRO',
  couple: 'COUPLE',
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const { profile } = useProfile(user?.id)
  const { subscription } = useSubscription(user?.id)
  const navigate = useNavigate()

  const goal = HEALTH_GOALS.find((g) => g.id === profile?.health_goal)
  const currentPlan = PLANS.find((p) => p.id === profile?.subscription_status)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="pb-4">
      {/* 프로필 헤더 */}
      <div className="bg-gradient-to-br from-primary-900 to-teal-700 px-4 pb-8 pt-8 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 text-2xl font-extrabold">
            {profile?.full_name?.charAt(0) ?? '?'}
          </div>
          <div>
            <div className="text-lg font-extrabold">{profile?.full_name ?? '사용자'}</div>
            <div className="text-sm text-primary-200">{user?.email}</div>
            <span className="mt-1 inline-block rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
              {PLAN_LABELS[profile?.subscription_status ?? 'none']} 플랜
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4 px-4 pt-4">
        {/* 구독 정보 */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-bold text-gray-500 uppercase tracking-wide">
            구독 정보
          </h2>
          {subscription ? (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">현재 플랜</span>
                <span className="font-semibold text-primary-900">
                  {currentPlan?.name ?? subscription.plan_type.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">시작일</span>
                <span className="font-medium">{formatDate(subscription.start_date)}</span>
              </div>
              {subscription.next_billing_date && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">다음 결제일</span>
                  <span className="font-medium">{formatDate(subscription.next_billing_date)}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="py-2 text-center">
              <p className="mb-3 text-sm text-gray-500">활성 구독이 없습니다</p>
              <button
                onClick={() => navigate('/pricing')}
                className="rounded-lg bg-primary-900 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800"
              >
                구독 시작하기
              </button>
            </div>
          )}
        </div>

        {/* 건강 목표 */}
        <button
          onClick={() => navigate('/onboarding')}
          className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100">
              {goal ? (
                <span className="text-xl">{goal.icon}</span>
              ) : (
                <Target size={20} className="text-teal-600" />
              )}
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900">건강 목표</div>
              <div className="text-xs text-gray-500">
                {goal ? goal.label : '목표를 설정해주세요'}
              </div>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>

        {/* 플랜 변경 */}
        <button
          onClick={() => navigate('/pricing')}
          className="flex w-full items-center justify-between rounded-2xl bg-white p-4 shadow-sm hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-100">
              <span className="text-base font-extrabold text-primary-900">₩</span>
            </div>
            <div className="text-left">
              <div className="text-sm font-semibold text-gray-900">플랜 변경</div>
              <div className="text-xs text-gray-500">요금제를 변경하거나 업그레이드하세요</div>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>

        {/* 로그아웃 */}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-sm hover:bg-red-50"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100">
            <LogOut size={18} className="text-red-600" />
          </div>
          <span className="text-sm font-semibold text-red-600">로그아웃</span>
        </button>

        <p className="pt-2 text-center text-xs text-gray-400">
          톡타민 v0.1.0 · 문의: support@toktamin.com
        </p>
      </div>
    </div>
  )
}
