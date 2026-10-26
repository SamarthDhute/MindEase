import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Leaf, ArrowRight, User, Mail, Lock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import GoogleSignInButton from '../components/auth/GoogleSignInButton'

type Tab = 'login' | 'register'

interface LoginForm {
  email: string
  password?: string
}

interface RegisterForm {
  name: string
  email: string
  password?: string
  confirm?: string
}

export default function AuthPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login, register, currentUser } = useAuth()

  const [tab, setTab] = useState<Tab>(() =>
    location.pathname.includes('register') ? 'register' : 'login',
  )
  const [showPass, setShowPass] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  )

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (location.pathname.includes('register')) {
      setTab('register')
    } else if (location.pathname.includes('login')) {
      setTab('login')
    }
  }, [location.pathname])

  const loginForm = useForm<LoginForm>({
    defaultValues: { email: currentUser?.email || 'maya@mindease.wellness' },
  })
  const registerForm = useForm<RegisterForm>()

  function handleLoginSubmit(data: LoginForm) {
    setErrorMsg(null)
    if (!data.email) {
      setErrorMsg('Please enter a valid email address.')
      return
    }

    const user = login(data.email)
    if (user.assessmentCompleted) {
      navigate('/dashboard')
    } else {
      navigate('/assessment')
    }
  }

  function handleRegisterSubmit(data: RegisterForm) {
    setErrorMsg(null)
    if (!data.name || !data.email) {
      setErrorMsg('Please provide your name and email.')
      return
    }

    register(data.name, data.email)
    navigate('/assessment')
  }

  return (
    <div
      className="min-h-[100dvh] flex items-center justify-center px-4 py-8 sm:py-12"
      style={{ background: 'var(--gradient-hero)' }}
    >
      {/* Background illustration */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'url(/illustrations/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.12,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] as const }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass p-5 sm:p-8 md:p-10 shadow-xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-5 sm:mb-7">
            <Leaf size={28} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
              MindEase
            </span>
          </div>

          {/* Mobile First: Prominent 1-Tap Google Sign-In */}
          {isMobile && (
            <div
              className="mb-5 p-3.5 rounded-2xl shadow-sm"
              style={{
                background: 'var(--color-surface-2)',
                border: '1.5px solid var(--color-primary)',
              }}
            >
              <div className="flex items-center justify-between mb-2 px-0.5">
                <span
                  className="text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5"
                  style={{ color: 'var(--color-primary)' }}
                >
                  ⚡ Fast Mobile Sign-In
                </span>
                <span className="text-[10px] font-medium" style={{ color: 'var(--color-text-muted)' }}>
                  1-Tap Instant Access
                </span>
              </div>
              <GoogleSignInButton
                isMobileContext={true}
                label="Sign in with Google"
                onSuccess={() => navigate('/dashboard')}
              />
              <div className="relative my-3 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t" style={{ borderColor: 'var(--color-border)' }} />
                </div>
                <span
                  className="relative px-3 text-[10px] uppercase font-bold tracking-wider"
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
                >
                  or continue with email
                </span>
              </div>
            </div>
          )}

          {/* Tab switcher */}
          <div
            className="flex p-1 rounded-xl mb-6"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
          >
            <button
              onClick={() => {
                setTab('login')
                setErrorMsg(null)
              }}
              className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
              style={{
                background: tab === 'login' ? 'var(--color-surface)' : 'transparent',
                color: tab === 'login' ? 'var(--color-text)' : 'var(--color-text-muted)',
                boxShadow: tab === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
              id="auth-tab-login"
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setTab('register')
                setErrorMsg(null)
              }}
              className="flex-1 py-2 text-sm font-semibold rounded-lg transition-all"
              style={{
                background: tab === 'register' ? 'var(--color-surface)' : 'transparent',
                color: tab === 'register' ? 'var(--color-text)' : 'var(--color-text-muted)',
                boxShadow: tab === 'register' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
              }}
              id="auth-tab-register"
            >
              Create Account
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 mb-4 rounded-xl text-xs font-medium text-red-600 bg-red-50 border border-red-200">
              {errorMsg}
            </div>
          )}

          <AnimatePresence mode="wait">
            {tab === 'login' ? (
              <motion.form
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                onSubmit={loginForm.handleSubmit(handleLoginSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      {...loginForm.register('email', { required: true })}
                      placeholder="you@example.com"
                      className="input-field"
                      style={{ paddingLeft: '38px', minHeight: '44px' }}
                      id="login-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="current-password"
                      {...loginForm.register('password')}
                      placeholder="••••••••"
                      className="input-field"
                      style={{ paddingLeft: '38px', paddingRight: '38px', minHeight: '44px' }}
                      id="login-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-3.5 text-xs p-1"
                      style={{ color: 'var(--color-text-muted)' }}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between items-center gap-2 text-xs pt-1">
                  <span style={{ color: 'var(--color-text-muted)' }}>Instant research profile access</span>
                  <button
                    type="button"
                    onClick={() => {
                      login('demo@mindease.wellness', 'Guest Learner')
                      navigate('/dashboard')
                    }}
                    className="text-xs font-semibold py-1"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Use Demo Profile →
                  </button>
                </div>

                <button type="submit" className="btn-primary w-full justify-center mt-2 min-h-[44px]" id="login-submit">
                  Sign In <ArrowRight size={16} />
                </button>
              </motion.form>
            ) : (
              <motion.form
                key="register"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                onSubmit={registerForm.handleSubmit(handleRegisterSubmit)}
                className="space-y-4"
              >
                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Your Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-3.5" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type="text"
                      autoComplete="name"
                      {...registerForm.register('name', { required: true })}
                      placeholder="e.g. Alex Green"
                      className="input-field"
                      style={{ paddingLeft: '38px', minHeight: '44px' }}
                      id="register-name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-3.5" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      {...registerForm.register('email', { required: true })}
                      placeholder="you@example.com"
                      className="input-field"
                      style={{ paddingLeft: '38px', minHeight: '44px' }}
                      id="register-email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-3.5" style={{ color: 'var(--color-text-muted)' }} />
                    <input
                      type={showPass ? 'text' : 'password'}
                      autoComplete="new-password"
                      {...registerForm.register('password')}
                      placeholder="Create a password"
                      className="input-field"
                      style={{ paddingLeft: '38px', minHeight: '44px' }}
                      id="register-password"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-xl text-[11px] leading-relaxed flex items-start gap-2" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                  <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                  <span>
                    Private and local: Your data stays on your machine and connects only to the MindEase research endpoints.
                  </span>
                </div>

                <button type="submit" className="btn-primary w-full justify-center mt-2 min-h-[44px]" id="register-submit">
                  Start My Wellness Journey <ArrowRight size={16} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Desktop Only: Optional Google Sign-In */}
          {!isMobile && (
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
              <div className="flex items-center justify-between mb-2.5 px-0.5">
                <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                  Or continue with
                </span>
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
                >
                  Optional
                </span>
              </div>
              <GoogleSignInButton
                isMobileContext={false}
                label="Continue with Google"
                onSuccess={() => navigate('/dashboard')}
              />
              <p className="text-[11px] text-center mt-2" style={{ color: 'var(--color-text-muted)' }}>
                Instant sign-in without password • One-tap access
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

