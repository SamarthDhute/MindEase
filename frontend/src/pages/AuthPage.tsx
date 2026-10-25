import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Leaf, ArrowRight, User, Mail, Lock, CheckCircle2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

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
      className="min-h-screen flex items-center justify-center px-4 py-12"
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
        <div className="glass p-8 md:p-10 shadow-xl">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Leaf size={28} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', fontWeight: 600, color: 'var(--color-primary)' }}>
              MindEase
            </span>
          </div>

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
                      {...loginForm.register('email', { required: true })}
                      placeholder="you@example.com"
                      className="input-field"
                      style={{ paddingLeft: '38px' }}
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
                      {...loginForm.register('password')}
                      placeholder="••••••••"
                      className="input-field"
                      style={{ paddingLeft: '38px', paddingRight: '38px' }}
                      id="login-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-3.5 text-xs"
                      style={{ color: 'var(--color-text-muted)' }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs pt-1">
                  <span style={{ color: 'var(--color-text-muted)' }}>Instant research profile access</span>
                  <button
                    type="button"
                    onClick={() => {
                      login('demo@mindease.wellness', 'Guest Learner')
                      navigate('/dashboard')
                    }}
                    className="text-xs font-semibold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    Use Demo Profile →
                  </button>
                </div>

                <button type="submit" className="btn-primary w-full justify-center mt-2" id="login-submit">
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
                      {...registerForm.register('name', { required: true })}
                      placeholder="e.g. Alex Green"
                      className="input-field"
                      style={{ paddingLeft: '38px' }}
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
                      {...registerForm.register('email', { required: true })}
                      placeholder="you@example.com"
                      className="input-field"
                      style={{ paddingLeft: '38px' }}
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
                      {...registerForm.register('password')}
                      placeholder="Create a password"
                      className="input-field"
                      style={{ paddingLeft: '38px' }}
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

                <button type="submit" className="btn-primary w-full justify-center mt-2" id="register-submit">
                  Start My Wellness Journey <ArrowRight size={16} />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
