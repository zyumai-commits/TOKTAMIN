import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

// 환경변수 누락 시 콘솔 경고만 출력 (앱 crash 방지)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    '[톡타민] Supabase 환경 변수가 설정되지 않았습니다.\n' +
    'Vercel Dashboard → Settings → Environment Variables에서\n' +
    'VITE_SUPABASE_URL 과 VITE_SUPABASE_ANON_KEY 를 설정해 주세요.'
  )
}

export const supabase = createClient(
  supabaseUrl ?? 'https://placeholder.supabase.co',
  supabaseAnonKey ?? 'placeholder',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
)

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey)
