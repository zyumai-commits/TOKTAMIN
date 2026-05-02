# 🌿 톡타민 (TOKTAMIN)

> 나만의 맞춤형 영양제 구독 플랫폼 · 66일 건강 습관 챌린지

---

## 시작하기

### 1. 의존성 설치

```bash
cd toktamin
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.local.example .env.local
# .env.local 파일에 실제 키 값 입력
```

### 3. Supabase 설정

1. [Supabase](https://supabase.com) 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/001_initial_schema.sql` 실행
3. `.env.local`에 Supabase URL과 Anon Key 입력

### 4. Edge Functions 배포

```bash
# Supabase CLI 설치 후
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# 시크릿 설정
supabase secrets set TOSS_SECRET_KEY=test_sk_...
supabase secrets set RESEND_API_KEY=re_...
supabase secrets set APP_URL=https://toktamin.com

# 함수 배포
supabase functions deploy verify-payment
supabase functions deploy send-welcome-email
```

### 5. 개발 서버 실행

```bash
npm run dev
```

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React 18 + Vite + TypeScript |
| Styling | Tailwind CSS v3 |
| 상태관리 | TanStack React Query |
| 라우팅 | React Router v6 |
| Backend/Auth | Supabase (PostgreSQL + Auth + Edge Functions) |
| 결제 | Toss Payments Standard Checkout |
| 이메일 | Resend API |
| PWA | vite-plugin-pwa |
| 아이콘 | Lucide React |

---

## 페이지 구조

```
/              → 랜딩 페이지 (히어로 + 플랜 비교표)
/signup        → 회원가입
/login         → 로그인
/onboarding    → 건강 목표 설정 (수면/에너지/근육/면역력)
/pricing       → 요금제 선택
/checkout      → 결제 (Toss Payments)
/success       → 결제 완료
/dashboard     → 대시보드 (PWA - 오늘 복용 체크)
/habits        → 66일 습관 트래커 (PWA)
/profile       → 프로필 / 구독 관리 (PWA)
```

---

## 구독 플랜

| 플랜 | 가격 | 주요 혜택 |
|------|------|-----------|
| LITE | 무료 | 영양제 추천 1종, 7일 트래커 |
| BASIC | ₩39,000/월 | 영양제 3종, 66일 트래커, 월간 리포트 |
| PRO | ₩54,000/월 | 영양제 5종, 주간 리포트, 1:1 상담 |
| COUPLE | ₩83,000/월 | 2인 PRO, 커플 대시보드 |

---

## 환경 변수

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
VITE_TOSS_CLIENT_KEY=test_ck_...
```

Edge Function 시크릿 (supabase secrets set):
- `TOSS_SECRET_KEY` — 토스 페이먼츠 시크릿 키
- `RESEND_API_KEY` — Resend API 키
- `APP_URL` — 배포 URL (이메일 링크용)
