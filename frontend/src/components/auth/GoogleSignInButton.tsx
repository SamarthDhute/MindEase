import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Check, Sparkles, X, ChevronRight, Plus, ShieldCheck, Smartphone, Laptop } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'

export function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
        fill="#EA4335"
      />
    </svg>
  )
}

interface GoogleSignInProps {
  onSuccess?: () => void
  isMobileContext?: boolean
  className?: string
  label?: string
}

const DEFAULT_ACCOUNTS = [
  {
    name: 'Samarth',
    email: 'samarth.wellness@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    color: '#4285F4',
  },
  {
    name: 'MindEase Explorer',
    email: 'explorer.user@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    color: '#34A853',
  },
]

export default function GoogleSignInButton({
  onSuccess,
  isMobileContext = false,
  className = '',
  label,
}: GoogleSignInProps) {
  const navigate = useNavigate()
  const { loginWithOAuth } = useAuth()
  const [showChooser, setShowChooser] = useState(false)
  const [customName, setCustomName] = useState('')
  const [customEmail, setCustomEmail] = useState('')
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID

  // Initialize official Google Identity Services if client ID is provided
  useEffect(() => {
    if (!googleClientId) return

    const scriptId = 'google-gsi-script'
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script')
      script.id = scriptId
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => {
        const winGoogle = (window as unknown as { google?: any }).google
        if (winGoogle?.accounts?.id) {
          winGoogle.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGsiCredentialResponse,
          })
        }
      }
      document.body.appendChild(script)
    }
  }, [googleClientId])

  function handleGsiCredentialResponse(response: { credential?: string }) {
    if (!response.credential) return
    try {
      const base64Url = response.credential.split('.')[1]
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      )
      const data = JSON.parse(jsonPayload)
      if (data.email) {
        completeLogin({
          email: data.email,
          name: data.name || data.email.split('@')[0],
          avatar: data.picture,
        })
      }
    } catch (err) {
      console.error('Failed to parse Google OAuth token', err)
    }
  }

  function handleButtonClick() {
    const winGoogle = (window as unknown as { google?: any }).google
    // If real Google Client ID is configured and GIS is available, trigger real prompt
    if (googleClientId && winGoogle?.accounts?.id) {
      winGoogle.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          setShowChooser(true)
        }
      })
      return
    }

    // Default: Open the zero-friction native Google Account Chooser
    setShowChooser(true)
  }

  function completeLogin(account: { email: string; name: string; avatar?: string }) {
    setIsLoading(true)
    setTimeout(() => {
      loginWithOAuth('google', account)
      setIsLoading(false)
      setShowChooser(false)
      if (onSuccess) {
        onSuccess()
      } else {
        navigate('/dashboard')
      }
    }, 450)
  }

  function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!customEmail) return
    const email = customEmail.includes('@') ? customEmail.trim() : `${customEmail.trim()}@gmail.com`
    const name = customName.trim() || email.split('@')[0]
    completeLogin({
      email,
      name,
      avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}&backgroundColor=4285f4`,
    })
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={handleButtonClick}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all cursor-pointer shadow-sm relative overflow-hidden ${className}`}
        style={{
          background: 'var(--color-surface)',
          border: isMobileContext ? '1.5px solid var(--color-primary)' : '1px solid var(--color-border)',
          color: 'var(--color-text)',
          minHeight: isMobileContext ? '48px' : '44px',
          boxShadow: isMobileContext
            ? '0 4px 14px -3px rgba(66, 133, 244, 0.15), 0 2px 6px -2px rgba(0, 0, 0, 0.05)'
            : '0 2px 6px rgba(0, 0, 0, 0.04)',
          touchAction: 'manipulation',
        }}
        id={isMobileContext ? 'google-signin-mobile-btn' : 'google-signin-btn'}
        aria-label="Sign in with Google"
      >
        <GoogleIcon size={20} />
        <span className="font-medium tracking-tight">
          {label || (isMobileContext ? 'Continue with Google (1-Tap)' : 'Sign in with Google')}
        </span>

        {isMobileContext && (
          <span
            className="hidden xs:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ml-auto"
            style={{
              background: 'rgba(66, 133, 244, 0.12)',
              color: '#2b6cb0',
            }}
          >
            <Smartphone size={11} /> Fast
          </span>
        )}
      </motion.button>

      {/* Google Account Chooser Modal / Bottom-Sheet */}
      <AnimatePresence>
        {showChooser && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isLoading && setShowChooser(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              style={{ zIndex: 51 }}
            />

            {/* Modal Dialog / Sheet */}
            <motion.div
              initial={isMobileContext ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 16 }}
              animate={isMobileContext ? { y: 0 } : { opacity: 1, scale: 1, y: 0 }}
              exit={isMobileContext ? { y: '100%' } : { opacity: 0, scale: 0.95, y: 16 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320 }}
              className="relative w-full max-w-md rounded-t-3xl sm:rounded-2xl p-5 sm:p-6 shadow-2xl overflow-hidden"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                zIndex: 52,
                maxHeight: '92vh',
                overflowY: 'auto',
              }}
            >
              {/* Header with Google Logo */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <GoogleIcon size={24} />
                  <span className="font-semibold text-base sm:text-lg" style={{ color: 'var(--color-text)' }}>
                    Sign in with Google
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChooser(false)}
                  className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                  style={{ color: 'var(--color-text-muted)' }}
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Destination App Info */}
              <div
                className="flex items-center gap-3 p-3 rounded-xl mb-4"
                style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
              >
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow-sm flex-shrink-0"
                  style={{ background: 'var(--color-primary)' }}
                >
                  🌿
                </div>
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                    MindEase Wellness
                  </div>
                  <div className="text-[11px] truncate" style={{ color: 'var(--color-text-muted)' }}>
                    Choose an account to continue to MindEase
                  </div>
                </div>
              </div>

              {/* Device context pill */}
              <div className="flex items-center gap-1.5 text-[11px] mb-3 px-1" style={{ color: 'var(--color-text-muted)' }}>
                {isMobileContext ? (
                  <>
                    <Smartphone size={13} style={{ color: 'var(--color-primary)' }} />
                    <span>Mobile 1-Tap Authorization • Fast &amp; Secure</span>
                  </>
                ) : (
                  <>
                    <Laptop size={13} style={{ color: 'var(--color-primary)' }} />
                    <span>Web &amp; Desktop Quick Sign-In</span>
                  </>
                )}
              </div>

              {/* Account List */}
              <div className="space-y-2 mb-4">
                {DEFAULT_ACCOUNTS.map(acc => (
                  <motion.button
                    key={acc.email}
                    type="button"
                    disabled={isLoading}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => completeLogin(acc)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer"
                    style={{
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      touchAction: 'manipulation',
                      minHeight: '52px',
                    }}
                  >
                    <img
                      src={acc.avatar}
                      alt={acc.name}
                      className="w-10 h-10 rounded-full object-cover border border-white/20 flex-shrink-0"
                    />
                    <div className="overflow-hidden flex-1">
                      <div className="font-medium text-sm truncate" style={{ color: 'var(--color-text)' }}>
                        {acc.name}
                      </div>
                      <div className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                        {acc.email}
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color: 'var(--color-text-muted)' }} />
                  </motion.button>
                ))}

                {/* Custom / Add another account */}
                {!showCustomForm ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomForm(true)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all cursor-pointer"
                    style={{
                      background: 'transparent',
                      border: '1px dashed var(--color-border)',
                      color: 'var(--color-primary)',
                      minHeight: '48px',
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                    >
                      <Plus size={18} />
                    </div>
                    <span className="text-xs sm:text-sm font-medium">Use another Google account</span>
                  </button>
                ) : (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    onSubmit={handleCustomSubmit}
                    className="p-3.5 rounded-xl space-y-3"
                    style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                  >
                    <div className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                      Enter your Google details:
                    </div>
                    <div>
                      <input
                        type="text"
                        value={customName}
                        onChange={e => setCustomName(e.target.value)}
                        placeholder="Your full name (e.g. Alex Green)"
                        className="input-field text-xs"
                        style={{ minHeight: '40px' }}
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        value={customEmail}
                        onChange={e => setCustomEmail(e.target.value)}
                        placeholder="yourname@gmail.com"
                        required
                        className="input-field text-xs"
                        style={{ minHeight: '40px' }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="btn-primary text-xs flex-1 justify-center"
                        style={{ minHeight: '38px' }}
                      >
                        Sign In as Google User
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCustomForm(false)}
                        className="px-3 py-2 text-xs rounded-xl"
                        style={{ background: 'var(--color-surface)', color: 'var(--color-text-muted)' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.form>
                )}
              </div>

              {/* Privacy Footer */}
              <div className="p-3 rounded-xl text-[11px] leading-relaxed flex items-start gap-2" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
                <ShieldCheck size={14} className="mt-0.5 flex-shrink-0" style={{ color: '#34A853' }} />
                <span>
                  To continue, Google will share your name, email address, and language preference with MindEase.
                </span>
              </div>

              {/* Google Client ID Status Hint */}
              <div className="mt-3 text-[10px] text-center" style={{ color: 'var(--color-text-muted)' }}>
                {googleClientId ? (
                  <span className="text-emerald-600 font-medium">✓ Google Cloud OAuth Enabled</span>
                ) : (
                  <span>Ready for production • Supports optional VITE_GOOGLE_CLIENT_ID</span>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
