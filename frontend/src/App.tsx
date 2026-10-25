import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { AuthProvider } from './contexts/AuthContext'
import AppLayout from './components/layout/AppLayout'
import LandingPage from './pages/LandingPage'
import AuthPage from './pages/AuthPage'
import DashboardPage from './pages/DashboardPage'
import AssessmentPage from './pages/AssessmentPage'
import AnalyzingPage from './pages/AnalyzingPage'
import ReportPage from './pages/ReportPage'
import CheckInPage from './pages/CheckInPage'
import ProgressPage from './pages/ProgressPage'
import SettingsPage from './pages/SettingsPage'
import CognitiveTestPage from './pages/CognitiveTestPage'
import AboutPage from './pages/AboutPage'
import PrivacyPage from './pages/PrivacyPage'

function HomeRoute() {
  const [searchParams] = useSearchParams()

  // If user explicitly passed ?home=true or ?preview=true, show landing page even on mobile
  if (searchParams.get('home') === 'true' || searchParams.get('preview') === 'true') {
    return <LandingPage />
  }

  // Detect mobile viewport or mobile device user agent or standalone PWA
  const isMobile =
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 ||
      /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
      window.matchMedia('(display-mode: standalone)').matches)

  if (isMobile) {
    return <Navigate to="/dashboard" replace />
  }

  return <LandingPage />
}

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="text-7xl mb-6">🌿</div>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--color-text)', marginBottom: '1rem' }}>
        Page Not Found
      </h1>
      <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem' }}>
        This path doesn't exist in the garden.
      </p>
      <a href="/" className="btn-primary">Return Home</a>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Fullscreen auth & analysis routes */}
            <Route path="/login"    element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/analyzing" element={<AnalyzingPage />} />

            {/* Application pages within shared layout */}
            <Route element={<AppLayout />}>
              <Route path="/"           element={<HomeRoute />} />
              <Route path="/about"      element={<AboutPage />} />
              <Route path="/privacy"    element={<PrivacyPage />} />
              <Route path="/dashboard"  element={<DashboardPage />} />
              <Route path="/assessment" element={<AssessmentPage />} />
              <Route path="/cognitive"  element={<CognitiveTestPage />} />
              <Route path="/report"     element={<ReportPage />} />
              <Route path="/checkin"    element={<CheckInPage />} />
              <Route path="/progress"   element={<ProgressPage />} />
              <Route path="/settings"   element={<SettingsPage />} />
              <Route path="*"           element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
