import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Outlet />
      </main>
      <footer className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-xl">🌿</span>
            <span className="text-lg font-extrabold text-primary-900">톡타민</span>
          </div>
          <p className="text-sm text-gray-500">
            건강한 습관, 66일이면 충분합니다
          </p>
          <p className="mt-4 text-xs text-gray-400">
            © 2024 톡타민. 문의: support@toktamin.com
          </p>
        </div>
      </footer>
    </div>
  )
}
