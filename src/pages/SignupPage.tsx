import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react'

export default function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password, fullName)
    setLoading(false)

    if (error) {
      if (error.message.includes('already registered')) {
        setError('이미 사용 중인 이메일입니다.')
      } else {
        setError('회원가입에 실패했습니다. 다시 시도해 주세요.')
      }
      return
    }

    navigate('/onboarding')
  }

  const passwordStrong = password.length >= 8

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
