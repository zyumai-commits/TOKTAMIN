import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Plan } from '@/types'

interface PlanCardProps {
  plan: Plan
  isSelected: boolean
  onSelect: (planId: Plan['id']) => void
}

export default function PlanCard({ plan, isSelected, onSelect }: PlanCardProps) {
  const isRecommended = plan.recommended

  return (
    <button
      onClick={() => onSelect(plan.id)}
      className={cn(
        'relative w-full rounded-2xl border-2 p-6 text-left transition',
        isSelected
          ? 'border-primary-900 bg-primary-50 shadow-md'
          : 'border-gray-200 bg-white hover:border-primary-300 hover:shadow-sm',
        isRecommended && !isSelected && 'border-primary-300'
      )}
    >
      {isRecommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="rounded-full bg-primary-900 px-3 py-1 text-xs font-bold text-white">
            가장 인기
          </span>
        </div>
      )}

      <div className="mb-1 flex items-center justify-between">
        <span className="text-lg font-extrabold text-gray-900">{plan.name}</span>
        <div
          className={cn(
            'h-5 w-5 rounded-full border-2 transition',
            isSelected
              ? 'border-primary-900 bg-primary-900'
              : 'border-gray-300'
          )}
        >
          {isSelected && (
            <Check size={12} className="m-auto mt-0.5 text-white" />
          )}
        </div>
      </div>

      <div className="mb-1 text-2xl font-extrabold text-primary-900">
        {plan.priceLabel}
      </div>
      <p className="mb-4 text-sm text-gray-500">{plan.description}</p>

      <ul className="space-y-2">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-gray-700">
            <Check size={14} className="mt-0.5 shrink-0 text-teal-600" />
            {feature}
          </li>
        ))}
      </ul>
    </button>
  )
}
