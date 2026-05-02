import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Shield, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { loadTossPayments, generateOrderId, PLAN_AMOUNT_MAP } from '@/lib/toss-payments'
import { supabase } from '@/lib/supabase'
import { PLANS } from '@/constants/plans'
import type { Plan } from '@/types'

export default function CheckoutPage() {
  const { user } = useAuth()
  const { profile, updateProfile } = useProfile(user?.id)
  const navigate = useNavigate()
  const location = useLocation()
  const planId = (location.state as { planId?: string })?.planId ?? 'basic'

  const plan = PLANS.find((p) => p.id === planId) as Plan
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // URL 파라미터로 에러 확인
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('error') === 'payment_failed') {
      setError('결제에 실패했습니다. 다시 시도해 주세요.')
    }
  }, [])

  const handleFreePlan = async () => {
    setLoading(true)
    updateProfile(
      { subscription_status: 'lite' },
      {
        onSuccess: () => navigate('/dashboard'),
        onError: () => {
          setError('플랜 활성화에 실패했습니다.')
          setLoading(false)
        },
      }
    )
  }

  const handlePayment = async () => {
    if (!user || !plan) return
    setLoading(true)
    setError('')

    try {
      const toss = await loadTossPayments()
      const orderId = generateOrderId(plan.id)

      await toss.requestPayment('카드', {
        amount: plan.price,
        orderId,
        orderName: `톡타민 ${plan.name} 플랜`,
        customerName: profile?.full_name ?? '고객',
        customerEmail: user.email!,
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/checkout?error=payment_failed`,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : '결제를 시작할 수 없습니다.'
      setError(message)
      setLoading(false)
    }
  }

  if (!plan) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">플랜 정보를 찾을 수 없습니다.</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12">
      <h1 className="mb-8 text-center text-2xl font-extrabold text-gray-900">
        결제 확인
      </h1>

      {/* 주문 요약 */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-sm font-semibold text-gray-500 uppercase tracking-wide">
          주문 내역
        </h2>
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <div className="font-bold text-gray-900">톡타민 {plan.name} 플랜</div>
            <div className="text-sm text-gray-500">{plan.description}</div>
          </div>
          <div className="text-lg font-extrabold text-primary-900">{plan.priceLabel}</div>
        </div>
        <ul className="mt-4 space-y-2">
          {plan.features.map((f) => (
            <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-teal-600">✓</span> {f}
            </li>
          ))}
        </ul>
      </div>

      {/* 보안 배지 */}
      <div className="mb-6 flex items-center justify-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Shield size={14} />
          <span>안전한 결제</span>
        </div>
        <div className="flex items-center gap-1">
          <Lock size={14} />
          <span>개인정보 보호</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {plan.price === 0 ? (
        <button
          onClick={handleFreePlan}
          disabled={loading}
          className="w-full rounded-xl bg-primary-900 py-4 text-base font-bold text-white transition hover:bg-primary-800 disabled:opacity-60"
        >
          {loading ? '처리 중...' : '무료 플랜 시작하기'}
        </button>
      ) : (
        <button
          onClick={handlePayment}
          disabled={loading}
          className="w-full rounded-xl bg-primary-900 py-4 text-base font-bold text-white transition hover:bg-primary-800 disabled:opacity-60"
        >
          {loading
            ? '결제창 열기 중...'
            : `토스페이먼츠로 결제하기 · ${plan.priceLabel}`}
        </button>
      )}

      <p className="mt-4 text-center text-xs text-gray-400">
        결제는 토스페이먼츠를 통해 안전하게 처리됩니다
      </p>
    </div>
  )
}
