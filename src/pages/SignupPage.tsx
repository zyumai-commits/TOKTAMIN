import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, CheckCircle2, Mail } from 'lucide-react'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    const { data, error } = await signUp(email, password, fullName)
    setLoading(false)

    if (error) {
      if (error.message.includes('already registered') || error.message.includes('User already registered')) {
        setError('이미 사용 중인 이메일입니다.')
      } else {
        setError(error.message ?? '회원가입에 실패했습니다. 다시 시도해 주세요.')
      }
      return
    }

    // 세션이 있으면 바로 온보딩으로 (이메일 인증 비활성화 상태)
    if (data?.session) {
      navigate('/onboarding')
      return
    }

    // 세션이 없으면 이메일 인증 대기 상태 → 안내 화면 표시
    setEmailSent(true)
  }

  const passwordStrong = password.length >= 8

  // 이메일 인증 안내 화면
  if (emailSent) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100">
              <Mail size={36} className="text-primary-900" />
            </div>
          </div>
          <h1 className="mb-3 text-2xl font-extrabold text-gray-900">
            이메일을 확인해 주세요
          </h1>
          <p className="mb-2 text-gray-600">
            <strong>{email}</strong>로 인증 메일을 보냈습니다.
          </p>
          <p className="mb-8 text-sm text-gray-500">
            메일함의 인증 링크를 클릭하면 회원가입이 완료됩니다.
            <br />스팸 메일함도 확인해 보세요.
          </p>
          <div className="rounded-xl bg-primary-50 px-4 py-4 text-sm text-primary-800">
            인증 완료 후 아래 로그인 버튼을 눌러주세요
          </div>
          <Link
            to="/login"
            className="mt-4 block w-full rounded-xl bg-primary-900 py-3.5 text-center text-sm font-bold text-white hover:bg-primary-800"
          >
            로그인 화면으로
          </Link>
          <button
            onClick={() => setEmailSent(false)}
            className="mt-3 text-sm text-gray-400 hover:text-gray-600"
          >
            다른 이메일로 다시 시도
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-3 text-4xl">🌿</div>
          <h1 className="text-2xl font-extrabold text-gray-900">톡타민 시작하기</h1>
          <p className="mt-2 text-sm text-gray-500">
            무료로 가입하고 66일 건강 여정을 시작하세요
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-gray-700">
              이름
            </label>
            <input
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="홍길동"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-primary-900 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              placeholder="example@email.com"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-primary-900 focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="8자 이상 입력하세요"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 pr-11 text-sm outline-none transition focus:border-primary-900 focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {password.length > 0 && (
              <div className={`mt-1.5 flex items-center gap-1.5 text-xs ${passwordStrong ? 'text-teal-600' : 'text-red-500'}`}>
                <CheckCircle2 size={12} />
                {passwordStrong ? '안전한 비밀번호입니다' : '비밀번호는 8자 이상이어야 합니다'}
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary-900 py-3.5 text-sm font-bold text-white transition hover:bg-primary-800 disabled:opacity-60"
          >
            {loading ? '가입 중...' : '무료로 시작하기'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs text-gray-400">
          가입하면 톡타민의{' '}
          <a href="#" className="underline">이용약관</a> 및{' '}
          <a href="#" className="underline">개인정보처리방침</a>에 동의하게 됩니다.
        </p>

        <p className="mt-4 text-center text-sm text-gray-500">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="font-semibold text-primary-900 hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  )
}
