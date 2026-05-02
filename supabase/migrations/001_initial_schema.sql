-- ============================================================
-- TOKTAMIN 데이터베이스 스키마
-- Supabase SQL Editor에서 실행하세요
-- ============================================================

-- UUID 확장 활성화
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES 테이블
-- auth.users와 1:1 대응, 회원가입 트리거로 자동 생성
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id                  UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email               TEXT NOT NULL,
  full_name           TEXT,
  health_goal         TEXT CHECK (health_goal IN ('sleep', 'energy', 'muscle', 'immunity')),
  subscription_status TEXT NOT NULL DEFAULT 'none'
                      CHECK (subscription_status IN ('none', 'lite', 'basic', 'pro', 'couple')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SUBSCRIPTIONS 테이블
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_type           TEXT NOT NULL CHECK (plan_type IN ('lite', 'basic', 'pro', 'couple')),
  start_date          DATE NOT NULL DEFAULT CURRENT_DATE,
  next_billing_date   DATE,
  payment_method_id   TEXT,
  toss_order_id       TEXT UNIQUE,
  toss_payment_key    TEXT,
  amount              INTEGER,
  status              TEXT NOT NULL DEFAULT 'active'
                      CHECK (status IN ('active', 'cancelled', 'paused')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- HABIT_LOGS 테이블
-- 하루 1개 로그 (user_id + date UNIQUE)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.habit_logs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  status      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- ============================================================
-- PAYMENT_EVENTS 테이블
-- 결제 멱등성(중복 방지) 보장
-- ============================================================
CREATE TABLE IF NOT EXISTS public.payment_events (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id     TEXT UNIQUE NOT NULL,
  payment_key  TEXT,
  user_id      UUID REFERENCES public.profiles(id),
  amount       INTEGER,
  status       TEXT,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 트리거: 회원가입 시 profiles 자동 생성
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 트리거: updated_at 자동 갱신
-- ============================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================
ALTER TABLE public.profiles       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- PROFILES 정책
CREATE POLICY "본인 프로필 조회"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "본인 프로필 수정"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- SUBSCRIPTIONS 정책
CREATE POLICY "본인 구독 조회"
  ON public.subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "서비스 롤 구독 생성"
  ON public.subscriptions FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- HABIT_LOGS 정책
CREATE POLICY "본인 습관 로그 조회"
  ON public.habit_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "본인 습관 로그 생성"
  ON public.habit_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "본인 습관 로그 수정"
  ON public.habit_logs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- PAYMENT_EVENTS 정책 (서비스 롤 전용)
CREATE POLICY "서비스 롤 결제 이벤트 관리"
  ON public.payment_events FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- 인덱스
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_habit_logs_user_date    ON public.habit_logs(user_id, date);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id  ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_events_order   ON public.payment_events(order_id);
