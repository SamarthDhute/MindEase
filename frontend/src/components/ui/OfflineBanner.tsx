import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Wifi, Info, X } from 'lucide-react'

export default function OfflineBanner() {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator !== 'undefined' ? navigator.onLine : true,
  )
  const [wasOffline, setWasOffline] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    function handleOnline() {
      setIsOnline(true)
      setIsDismissed(false)
      // Display brief 'reconnected' notice if user had previously lost connection
      if (wasOffline) {
        const timer = setTimeout(() => {
          setWasOffline(false)
        }, 3500)
        return () => clearTimeout(timer)
      }
    }

    function handleOffline() {
      setIsOnline(false)
      setWasOffline(true)
      setIsDismissed(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [wasOffline])

  return (
    <AnimatePresence>
      {!isOnline && !isDismissed && (
        <motion.div
          key="offline-banner"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 w-full px-4 py-2.5 text-xs border-b shadow-sm transition-all flex items-center justify-between gap-3"
          style={{
            background: 'var(--color-surface-2)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)',
          }}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-2.5 max-w-4xl mx-auto flex-1">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
            >
              <WifiOff size={13} />
            </div>
            <p className="leading-tight">
              <strong>Offline Mode Active:</strong> MindEase is operating locally from cached assets.
              You can review saved reports, log check-ins, and continue assessments. Neural model predictions will reconnect once online.
            </p>
          </div>
          <button
            onClick={() => setIsDismissed(true)}
            className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
            aria-label="Dismiss offline banner"
            style={{ color: 'var(--color-text-muted)' }}
          >
            <X size={15} />
          </button>
        </motion.div>
      )}

      {isOnline && wasOffline && (
        <motion.div
          key="online-reconnected-toast"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative z-50 w-full px-4 py-2 text-xs border-b shadow-sm flex items-center justify-center gap-2"
          style={{
            background: 'rgba(76, 175, 80, 0.12)',
            borderColor: '#4caf50',
            color: 'var(--color-text)',
          }}
          role="status"
          aria-live="polite"
        >
          <Wifi size={14} style={{ color: '#4caf50' }} />
          <span className="font-medium">
            Back Online — Connected to MindEase services & neural inference endpoints.
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
