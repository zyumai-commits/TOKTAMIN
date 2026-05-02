import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'

import RootLayout from '@/components/layout/RootLayout'
import PWALayout from '@/components/layout/PWALayout'
import { FullPageLoader } from '@/components/ui/LoadingSpinner'

import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import OnboardingPage from '@/pages/OnboardingPage'
import PricingPage from '@/pages/PricingPage'
import CheckoutPage from '@/pages/CheckoutPage'
import SuccessPage from '@/pages/SuccessPage'
import DashboardPage from '@/pages/DashboardPage'
import HabitsPage from '@/pages/HabitsPage'
import ProfilePage from '@/pages/ProfilePage'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5분
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <FullPageLoader />
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AppRoutes() {
  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route element={<RootLayout />}>
        <Route path="/"        element={<LandingPage />} />
        <Route path="/login"   element={<LoginPage />} />
        <Route path="/signup"  element={<SignupPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Route>

      {/* 인증 필요 (헤더 있는 레이아웃) */}
      <Route element={<RootLayout />}>
        <Route
          path="/onboarding"
          element={<ProtectedRoute><OnboardingPage /></ProtectedRoute>}
        />
        <Route
          path="/checkout"
          element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>}
        />
        <Route
          path="/success"
          element={<ProtectedRoute><SuccessPage /></ProtectedRoute>}
        />
      </Route>

      {/* PWA 라우트 (하단 탭바) */}
      <Route
        element={
          <ProtectedRoute>
            <PWALayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/habits"    element={<HabitsPage />} />
        <Route path="/profile"   element={<ProfilePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}
