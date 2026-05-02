import { Check, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { PLANS, PLAN_COMPARISON } from '@/constants/plans'

export default function PlanComparisonTable() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            요금제 비교
          </h2>
          <p className="mt-4 text-gray-600">
            목표와 예산에 맞는 플랜을 선택하세요
          </p>
        </div>

        {/* 플랜 카드 (모바일) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl border-2 p-5 ${
                plan.recommended
                  ? 'border-primary-900 bg-primary-900 text-white'
                  : 'border-gray-200 bg-white'
              }`}
            >
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-teal-500 px-3 py-1 text-xs font-bold text-white">
                    추천
                  </span>
                </div>
              )}
              <div className="mb-1 text-lg font-extrabold">{plan.name}</div>
              <div className={`mb-3 text-2xl font-extrabold ${plan.recommended ? 'text-teal-300' : 'text-primary-900'}`}>
                {plan.priceLabel}
              </div>
              <ul className="mb-4 space-y-1.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={14} className={`mt-0.5 shrink-0 ${plan.recommended ? 'text-teal-300' : 'text-teal-600'}`} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.price === 0 ? '/signup' : '/checkout'}
                state={{ planId: plan.id }}
                className={`block w-full rounded-xl py-2.5 text-center text-sm font-bold transition ${
                  plan.recommended
                    ? 'bg-white text-primary-900 hover:bg-primary-50'
                    : 'bg-primary-900 text-white hover:bg-primary-800'
                }`}
              >
                {plan.price === 0 ? '무료 시작' : '구독하기'}
              </Link>
            </div>
          ))}
        </div>

        {/* 비교 테이블 (데스크톱) */}
        <div className="hidden overflow-hidden rounded-2xl border border-gray-200 lg:block">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 w-1/4">
                  기능
                </th>
                {PLANS.map((plan) => (
                  <th
                    key={plan.id}
                    className={`px-4 py-4 text-center ${
                      plan.recommended ? 'bg-primary-900 text-white' : ''
                    }`}
                  >
                    {plan.recommended && (
                      <span className="mb-1 block text-xs font-bold text-teal-300">추천</span>
                    )}
                    <div className={`text-base font-extrabold ${plan.recommended ? 'text-white' : 'text-gray-900'}`}>
                      {plan.name}
                    </div>
                    <div className={`text-sm font-semibold ${plan.recommended ? 'text-teal-300' : 'text-primary-900'}`}>
                      {plan.priceLabel}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PLAN_COMPARISON.map(({ label, values }, rowIdx) => (
                <tr
                  key={label}
                  className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td className="px-6 py-3.5 text-sm font-medium text-gray-700">{label}</td>
                  {values.map((val, colIdx) => (
                    <td
                      key={colIdx}
                      className={`px-4 py-3.5 text-center text-sm ${
                        PLANS[colIdx].recommended ? 'bg-primary-50' : ''
                      }`}
                    >
                      {typeof val === 'boolean' ? (
                        val ? (
                          <Check size={18} className="mx-auto text-teal-600" />
                        ) : (
                          <X size={16} className="mx-auto text-gray-300" />
                        )
                      ) : (
                        <span className="font-medium text-gray-800">{val}</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-t border-gray-200 bg-white">
                <td className="px-6 py-4" />
                {PLANS.map((plan) => (
                  <td key={plan.id} className={`px-4 py-4 text-center ${plan.recommended ? 'bg-primary-50' : ''}`}>
                    <Link
                      to={plan.price === 0 ? '/signup' : '/checkout'}
                      state={{ planId: plan.id }}
                      className={`inline-block rounded-lg px-4 py-2 text-sm font-bold transition ${
                        plan.recommended
                          ? 'bg-primary-900 text-white hover:bg-primary-800'
                          : 'border border-primary-900 text-primary-900 hover:bg-primary-50'
                      }`}
                    >
                      {plan.price === 0 ? '무료 시작' : '구독하기'}
                    </Link>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
