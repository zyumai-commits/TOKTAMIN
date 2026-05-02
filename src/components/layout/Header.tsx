import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export default function Header() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🌿</span>
          <span className="text-xl font-extrabold text-primary-900 tracking-tight">톡타민</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/pricing" className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors">
            요금제
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors"
              >
                대시보드
              </Link>
              <button
                onClick={handleSignOut}
                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-primary-900 transition-colors"
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-primary-900 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-800 transition-colors"
              >
                무료로 시작하기
              </Link>
            </>
          )}
        </nav>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          {user ? (
            <Link
              to="/dashboard"
              className="rounded-lg bg-primary-900 px-3 py-2 text-sm font-semibold text-white"
            >
              대시보드
            </Link>
          ) : (
            <Link
              to="/signup"
              className="rounded-lg bg-primary-900 px-3 py-2 text-sm font-semibold text-white"
            >
              시작하기
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
