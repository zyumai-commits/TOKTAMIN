import type { Plan } from '@/types'

export const PLANS: Plan[] = [
  {
    id: 'lite',
    name: 'LITE',
    price: 0,
    priceLabel: '무료',
    description: '영양제 구독 첫 걸음',
    color: 'gray',
    features: [
      '기본 건강 설문',
      '영양제 추천 1종',
      '습관 트래커 (7일)',
      '커뮤니티 접근',
    ],
  },
  {
    id: 'basic',
    name: 'BASIC',
    price: 39000,
    priceLabel: '₩39,000/월',
    description: '나에게 맞는 영양제 패키지',
    color: 'primary',
    recommended: true,
    features: [
      '개인화 건강 설문',
      '영양제 추천 3종',
      '66일 습관 트래커',
      '월간 건강 리포트',
      '전문가 채팅 상담',
    ],
  },
  {
    id: 'pro',
    name: 'PRO',
    price: 54000,
    priceLabel: '₩54,000/월',
    description: '프리미엄 맞춤 관리',
    color: 'teal',
    features: [
      'BASIC 모든 혜택 포함',
      '영양제 추천 5종',
      '주간 건강 리포트',
      '1:1 영양사 상담',
      '우선 고객 지원',
    ],
  },
  {
    id: 'couple',
    name: 'COUPLE',
    price: 83000,
    priceLabel: '₩83,000/월',
    description: '둘이 함께 더 건강하게',
    color: 'rose',
    features: [
      'PRO 2인분 혜택',
      '커플 건강 대시보드',
      '공동 습관 트래커',
      '2인 영양사 상담',
      '특별 커플 할인',
    ],
  },
]

export const HEALTH_GOALS = [
  {
    id: 'sleep' as const,
    label: '수면 개선',
    icon: '🌙',
    description: '깊고 편안한 수면을 위한 맞춤 영양제',
    supplements: ['마그네슘', '멜라토닌', 'L-테아닌'],
  },
  {
    id: 'energy' as const,
    label: '에너지 증진',
    icon: '⚡',
    description: '활기찬 하루를 위한 에너지 부스터',
    supplements: ['비타민 B군', '코엔자임 Q10', '철분'],
  },
  {
    id: 'muscle' as const,
    label: '근육 강화',
    icon: '💪',
    description: '운동 효과를 극대화하는 영양 지원',
    supplements: ['단백질', '크레아틴', 'BCAA'],
  },
  {
    id: 'immunity' as const,
    label: '면역력 강화',
    icon: '🛡️',
    description: '강한 면역 시스템 구축을 위한 영양소',
    supplements: ['비타민 C', '아연', '비타민 D'],
  },
]

export const PLAN_COMPARISON = [
  { label: '월 구독료',       values: ['무료', '₩39,000', '₩54,000', '₩83,000'] },
  { label: '영양제 추천',      values: ['1종', '3종', '5종', '10종 (2인)'] },
  { label: '66일 습관 트래커', values: [false, true, true, true] },
  { label: '건강 리포트',      values: [false, '월간', '주간', '주간 (2인)'] },
  { label: '영양사 상담',      values: [false, '채팅', '1:1 채팅', '2인 채팅'] },
  { label: '우선 고객 지원',   values: [false, false, true, true] },
  { label: '커플 대시보드',    values: [false, false, false, true] },
]
