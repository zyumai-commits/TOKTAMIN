import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PLANS } from '@/constants/plans'
import PlanCard from '@/components/pricing/PlanCard'
import type { Plan } from '@/types'

export default function PricingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const initialPlanId = (location.state as { planId?: string })?.planId ?? 'basic'

  const [selectedPlanId, setSelectedPlanId] = useState<Plan['id']>(
    initialPlanId as Plan['id']
  )

  const selectedPlan = PLANS.find((p) => p.id === selectedPlanId)!

  const handleContinue = () => {
    if (selectedPlan.price === 0) {
      navigate('/signup')
    } else {
      navigate('/checkout', { state: { planId: selectedPlanId } })
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
          플랜을 선택하세요
        </h1>
        <p className="mt-2 text-gray-500">언제든지 변경하거나 해지할 수 있습니다</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            isSelected={selectedPlanId === plan.id}
            onSelect={(id) => setSelectedPlanId(id)}
          />
        ))}
      </div>

      <div className="mt-8">
        <button
          onClick={handleContinue}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-900 py-4 text-base font-bold text-white shadow-md transition hover:bg-primary-800 hover:shadow-lg"
        >
          {selectedPlan.price === 0
            ? `${selectedPlan.name} 무료 시작`
            : `${selectedPlan.name} 구독하기 · ${selectedPlan.priceLabel}`}
          <ArrowRight size={18} />
        </button>
        <p className="mt-3 text-center text-xs text-gray-400">
          언제든지 해지 가능 · 다음 결제일 전까지 사용 가능
        </p>
      </div>
    </div>
  )
}
