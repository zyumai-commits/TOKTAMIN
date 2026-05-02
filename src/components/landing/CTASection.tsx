import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="bg-gradient-to-br from-primary-900 to-teal-700 px-4 py-20 text-white">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mb-4 text-4xl">🌿</div>
        <h2 className="mb-4 text-3xl font-extrabold md:text-4xl">
          오늘부터 66일 챌린지를 시작하세요
        </h2>
        <p className="mb-8 text-primary-200">
          매일 영양제 복용 습관을 만들고, 건강한 삶을 위한 첫 걸음을 내딛으세요.
          <br />첫 7일은 무료입니다.
        </p>
        <Link
          to="/signup"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-8 py-4 text-base font-bold text-primary-900 shadow-lg transition hover:shadow-xl"
        >
          무료로 시작하기
          <ArrowRight size={18} />
        </Link>
        <p className="mt-4 text-xs text-primary-300">
          신용카드 불필요 · 언제든지 해지 가능 · 개인정보 보호
        </p>
      </div>
    </section>
  )
}
