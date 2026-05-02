import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2 } from 'lucide-react'

const highlights = [
  '66일 과학적 습관 형성 프로그램',
  '건강 목표별 맞춤 영양제 추천',
  '전문 영양사 1:1 상담',
]

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 via-primary-800 to-teal-700 px-4 py-20 text-white md:py-32">
      {/* 배경 원형 장식 */}
      <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/5" />
      <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-teal-600/20" />

      <div className="relative mx-auto max-w-4xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur">
          <span>🌿</span>
          <span>66일 건강 습관 챌린지</span>
        </div>

        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
          건강한 습관,
          <br />
          <span className="text-teal-300">66일</span>이면 충분합니다
        </h1>

        <p className="mb-8 text-lg text-primary-200 md:text-xl">
          나의 건강 목표에 맞게 설계된 맞춤형 영양제를 구독하고
          <br className="hidden md:block" />
          전문가와 함께 66일 습관 형성 여정을 시작하세요
        </p>

        <div className="mb-10 flex flex-col items-center gap-3">
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-2 text-sm text-primary-100">
              <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/signup"
            className="flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary-900 shadow-lg transition hover:bg-primary-50 hover:shadow-xl"
          >
            무료로 시작하기
            <ArrowRight size={18} />
          </Link>
          <Link
            to="/pricing"
            className="rounded-xl border border-white/30 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
          >
            요금제 보기
          </Link>
        </div>

        <p className="mt-6 text-xs text-primary-300">
          신용카드 불필요 · 언제든지 해지 가능
        </p>
      </div>

      {/* 통계 */}
      <div className="relative mx-auto mt-16 max-w-3xl">
        <div className="grid grid-cols-3 divide-x divide-white/20 rounded-2xl bg-white/10 backdrop-blur">
          {[
            { value: '12,400+', label: '누적 구독자' },
            { value: '66일',    label: '습관 형성 챌린지' },
            { value: '94%',     label: '목표 달성률' },
          ].map(({ value, label }) => (
            <div key={label} className="px-4 py-6 text-center">
              <div className="text-2xl font-extrabold text-white md:text-3xl">{value}</div>
              <div className="mt-1 text-xs text-primary-200">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
