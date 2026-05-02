import { Leaf, Brain, Shield, Dumbbell } from 'lucide-react'

const benefits = [
  {
    icon: Brain,
    color: 'bg-primary-100 text-primary-900',
    title: '과학적 습관 설계',
    description: '심리학 연구 기반 66일 습관 형성 프로그램으로 영양제 복용을 일상으로 만듭니다.',
  },
  {
    icon: Leaf,
    color: 'bg-teal-100 text-teal-700',
    title: '맞춤형 영양제',
    description: '건강 목표, 생활 습관, 나이를 분석해 나에게 꼭 필요한 영양소만 추천합니다.',
  },
  {
    icon: Shield,
    color: 'bg-blue-100 text-blue-700',
    title: '안전한 성분',
    description: '국내 인증 원료만 사용. GMP 인증 공장에서 엄격하게 제조된 고품질 영양제를 제공합니다.',
  },
  {
    icon: Dumbbell,
    color: 'bg-rose-100 text-rose-700',
    title: '전문가 동행',
    description: '등록 영양사가 직접 상담하고 건강 목표 달성을 위한 맞춤 조언을 제공합니다.',
  },
]

export default function BenefitsSection() {
  return (
    <section className="bg-gray-50 px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 md:text-4xl">
            왜 톡타민인가요?
          </h2>
          <p className="mt-4 text-gray-600">
            수많은 영양제 중에서 나에게 맞는 것을 찾는 건 어렵습니다.
            <br className="hidden md:block" />
            톡타민이 대신 찾아드립니다.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, color, title, description }) => (
            <div
              key={title}
              className="rounded-2xl bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className={`mb-4 inline-flex rounded-xl p-3 ${color}`}>
                <Icon size={24} />
              </div>
              <h3 className="mb-2 text-base font-bold text-gray-900">{title}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
