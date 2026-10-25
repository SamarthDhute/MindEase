import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Sparkles, X, Smartphone, Check, Info } from 'lucide-react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [showInstructions, setShowInstructions] = useState(false)
  const [installedSuccess, setInstalledSuccess] = useState(false)

  useEffect(() => {
    // 1. Detect if already installed / running in standalone mode
    const checkStandalone = () => {
      const isStandaloneMode =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://')
      setIsStandalone(isStandaloneMode)
      return isStandaloneMode
    }

    if (checkStandalone()) {
      return
    }

    // 2. Check if user dismissed recently (14-day snooze to avoid nagging)
    const dismissedTime = localStorage.getItem('me-pwa-dismissed')
    if (dismissedTime) {
      const elapsed = Date.now() - parseInt(dismissedTime, 10)
      if (elapsed < 14 * 24 * 60 * 60 * 1000) {
        return // Snoozed
      }
    }

    // 3. Listen for browser install availability event
    function handleBeforeInstallPrompt(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Display after a gentle delay so user has oriented themselves with the page
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 3000)
      return () => clearTimeout(timer)
    }

    // 4. Listen for appinstalled event
    function handleAppInstalled() {
      setDeferredPrompt(null)
      setIsVisible(false)
      setInstalledSuccess(true)
      setIsStandalone(true)
      setTimeout(() => setInstalledSuccess(false), 4000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  async function handleInstallClick() {
    if (!deferredPrompt) {
      // Browser doesn't support beforeinstallprompt event (e.g. iOS Safari or some Android WebViews)
      setShowInstructions(true)
      return
    }

    try {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') {
        setIsVisible(false)
        setDeferredPrompt(null)
      } else {
        // User dismissed system prompt
        handleDismiss()
      }
    } catch (err) {
      console.warn('[MindEase PWA] Install error:', err)
      setShowInstructions(true)
    }
  }

  function handleDismiss() {
    setIsVisible(false)
    localStorage.setItem('me-pwa-dismissed', Date.now().toString())
  }

  // Do not render anything if already installed
  if (isStandalone && !installedSuccess) {
    return null
  }

  return (
    <>
      <AnimatePresence>
        {installedSuccess && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl glass shadow-2xl flex items-center gap-3 border"
            style={{ borderColor: 'var(--color-primary)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: 'var(--color-primary)' }}
            >
              <Check size={20} />
            </div>
            <div>
              <h4 className="font-bold text-xs" style={{ color: 'var(--color-text)' }}>
                MindEase Installed! 🌿
              </h4>
              <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                You can now open MindEase directly from your home screen.
              </p>
            </div>
          </motion.div>
        )}

        {isVisible && !isStandalone && (
          <motion.div
            key="pwa-install-banner"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-40 p-4 rounded-2xl glass shadow-2xl border flex flex-col gap-3"
            style={{
              borderColor: 'var(--color-border)',
              background: 'var(--color-surface)',
            }}
            role="dialog"
            aria-label="Install MindEase Application"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src="/pwa-192x192.png"
                  alt="MindEase Icon"
                  className="w-12 h-12 rounded-xl shadow-md flex-shrink-0"
                />
                <div>
                  <h3
                    className="font-bold text-sm leading-snug"
                    style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)' }}
                  >
                    Install MindEase
                  </h3>
                  <p className="text-xs leading-tight mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                    Add to your home screen for quick offline access and immersive full-screen experience.
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
                aria-label="Dismiss install prompt"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={handleInstallClick}
                className="btn-primary text-xs py-2 px-4 flex-1 justify-center min-h-[40px]"
                id="pwa-install-btn"
              >
                <Download size={14} /> Install Web App
              </button>
              <button
                onClick={() => setShowInstructions(true)}
                className="btn-secondary text-xs py-2 px-3 justify-center min-h-[40px]"
                title="Installation help"
                aria-label="How to install"
              >
                <Info size={14} />
              </button>
              <button
                onClick={handleDismiss}
                className="text-xs px-3 py-2 font-medium opacity-70 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manual Installation Instructions Modal */}
      <AnimatePresence>
        {showInstructions && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass p-6 max-w-sm w-full rounded-2xl shadow-2xl relative"
            >
              <button
                onClick={() => setShowInstructions(false)}
                className="absolute top-4 right-4 p-1 rounded-md opacity-70 hover:opacity-100"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
                >
                  <Smartphone size={18} />
                </div>
                <h3 className="font-bold text-base" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)' }}>
                  How to Install MindEase
                </h3>
              </div>

              <div className="space-y-3 text-xs leading-relaxed" style={{ color: 'var(--color-text)' }}>
                <p>
                  MindEase is an installable Progressive Web App (PWA). You can add it directly to your home screen or desktop:
                </p>

                <div className="p-3 rounded-xl border space-y-1.5" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                  <p className="font-bold">📱 On Android (Chrome / Edge / Firefox):</p>
                  <p className="opacity-90">1. Tap the browser menu (⋮ icon in top-right or bottom).</p>
                  <p className="opacity-90">2. Select <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.</p>
                </div>

                <div className="p-3 rounded-xl border space-y-1.5" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                  <p className="font-bold">💻 On Desktop (Chrome / Edge):</p>
                  <p className="opacity-90">1. Click the install icon (⊕) in the browser address bar.</p>
                  <p className="opacity-90">2. Or click ⋮ menu &rarr; <strong>"Install MindEase"</strong>.</p>
                </div>

                <div className="p-3 rounded-xl border space-y-1.5" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
                  <p className="font-bold">🍎 On iPhone / iPad (Safari):</p>
                  <p className="opacity-90">1. Tap the Share button (square with arrow).</p>
                  <p className="opacity-90">2. Scroll down and tap <strong>"Add to Home Screen"</strong>.</p>
                </div>
              </div>

              <button
                onClick={() => setShowInstructions(false)}
                className="btn-primary w-full justify-center text-xs py-2.5 mt-5 min-h-[40px]"
              >
                Got It, Thank You
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
