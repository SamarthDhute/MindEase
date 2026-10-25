import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { THEMES } from '../types'
import { Sun, Moon, Monitor, Bell, Shield, Palette, User, ChevronRight } from 'lucide-react'
import type { Mode } from '../types'

const MODE_OPTIONS: { value: Mode; icon: typeof Sun; label: string; desc: string }[] = [
  { value: 'light', icon: Sun,     label: 'Light',     desc: 'Always use light mode' },
  { value: 'dark',  icon: Moon,    label: 'Dark',      desc: 'Always use dark mode'  },
  { value: 'auto',  icon: Monitor, label: 'Auto',      desc: 'Follow system setting'  },
]

const SECTIONS_CONFIG = [
  { icon: Palette, label: 'Appearance',       id: 'appearance' },
  { icon: Bell,    label: 'Notifications',    id: 'notifications' },
  { icon: User,    label: 'Profile',          id: 'profile' },
  { icon: Shield,  label: 'Privacy & Data',   id: 'privacy' },
]

export default function SettingsPage() {
  const { theme, setTheme, mode, setMode } = useTheme()
  const [activeSection, setActiveSection] = useState('appearance')
  const [notifications, setNotifications] = useState({ dailyReminder: true, weeklyReport: true, tips: false })
  const [reminderTime, setReminderTime] = useState('08:00')

  const cardAnim = (i: number) => ({
    initial: { opacity: 0, x: -16 },
    animate: { opacity: 1, x: 0, transition: { delay: i * 0.08, duration: 0.35 } },
  })

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
          Settings
        </h1>
        <p style={{ color: 'var(--color-text-muted)' }}>Customise your MindEase experience</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="glass p-3">
            {SECTIONS_CONFIG.map((s, i) => (
              <motion.button
                key={s.id}
                {...cardAnim(i)}
                onClick={() => setActiveSection(s.id)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 last:mb-0 text-sm font-medium transition-all"
                style={{
                  background: activeSection === s.id ? 'var(--color-primary)' : 'transparent',
                  color: activeSection === s.id ? 'white' : 'var(--color-text-muted)',
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-sans)',
                  textAlign: 'left',
                }}
                id={`settings-${s.id}`}
              >
                <s.icon size={16} />
                {s.label}
                {activeSection !== s.id && <ChevronRight size={13} className="ml-auto" />}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {activeSection === 'appearance' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              {/* Theme */}
              <div className="glass p-6">
                <h2 className="font-bold mb-5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                  Nature Theme
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {THEMES.map(t => (
                    <motion.button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="p-4 rounded-2xl flex flex-col gap-2 text-left transition-all"
                      style={{
                        background: theme === t.id ? 'var(--color-primary)' : 'var(--color-surface-2)',
                        border: `2px solid ${theme === t.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        cursor: 'pointer',
                      }}
                      id={`settings-theme-${t.id}`}
                    >
                      <span className="text-2xl">{t.emoji}</span>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: theme === t.id ? 'white' : 'var(--color-text)' }}>{t.label}</div>
                        <div className="text-xs" style={{ color: theme === t.id ? 'rgba(255,255,255,0.75)' : 'var(--color-text-muted)' }}>{t.description}</div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mode */}
              <div className="glass p-6">
                <h2 className="font-bold mb-5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                  Display Mode
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {MODE_OPTIONS.map(opt => (
                    <motion.button
                      key={opt.value}
                      onClick={() => setMode(opt.value)}
                      whileHover={{ scale: 1.03 }}
                      className="p-4 rounded-2xl flex flex-col items-center gap-2 transition-all"
                      style={{
                        background: mode === opt.value ? 'var(--color-primary)' : 'var(--color-surface-2)',
                        border: `2px solid ${mode === opt.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        cursor: 'pointer',
                      }}
                      id={`settings-mode-${opt.value}`}
                    >
                      <opt.icon size={22} style={{ color: mode === opt.value ? 'white' : 'var(--color-text-muted)' }} />
                      <div className="text-sm font-semibold" style={{ color: mode === opt.value ? 'white' : 'var(--color-text)' }}>{opt.label}</div>
                      <div className="text-xs text-center" style={{ color: mode === opt.value ? 'rgba(255,255,255,0.75)' : 'var(--color-text-muted)' }}>{opt.desc}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeSection === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6">
              <h2 className="font-bold mb-6" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                Notifications
              </h2>
              <div className="space-y-4">
                {[
                  { key: 'dailyReminder', label: 'Daily Check-in Reminder', desc: 'Get a gentle nudge to complete your daily check-in' },
                  { key: 'weeklyReport',  label: 'Weekly Progress Report',  desc: 'Receive a summary of your wellbeing trends' },
                  { key: 'tips',          label: 'Wellness Tips',           desc: 'Occasional tips based on your attention profile' },
                ].map(n => (
                  <div
                    key={n.key}
                    className="flex items-center justify-between p-4 rounded-xl"
                    style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                  >
                    <div>
                      <div className="font-medium text-sm" style={{ color: 'var(--color-text)' }}>{n.label}</div>
                      <div className="text-xs mt-0.5" style={{ color: 'var(--color-text-muted)' }}>{n.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                      className="relative w-11 h-6 rounded-full transition-all"
                      style={{
                        background: notifications[n.key as keyof typeof notifications] ? 'var(--color-primary)' : 'var(--color-border)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      id={`toggle-${n.key}`}
                    >
                      <span
                        className="absolute top-0.5 rounded-full bg-white transition-all"
                        style={{
                          width: '20px', height: '20px',
                          left: notifications[n.key as keyof typeof notifications] ? 'calc(100% - 22px)' : '2px',
                          transition: 'left 0.25s',
                        }}
                      />
                    </button>
                  </div>
                ))}

                {notifications.dailyReminder && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-4 rounded-xl"
                    style={{ background: 'var(--color-accent-2)', border: '1px solid var(--color-border)' }}
                  >
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text)' }} htmlFor="reminder-time">
                      Reminder Time
                    </label>
                    <input
                      id="reminder-time"
                      type="time"
                      value={reminderTime}
                      onChange={e => setReminderTime(e.target.value)}
                      className="input-field"
                      style={{ maxWidth: '140px' }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {activeSection === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6">
              <h2 className="font-bold mb-6" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                Your Profile
              </h2>
              <div className="flex items-center gap-4 mb-7 p-4 rounded-xl" style={{ background: 'var(--color-accent-2)', border: '1px solid var(--color-border)' }}>
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl" style={{ background: 'var(--color-primary)' }}>
                  🌿
                </div>
                <div>
                  <div className="font-semibold" style={{ color: 'var(--color-text)' }}>Guest User</div>
                  <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>MindEase Member</div>
                </div>
              </div>
              <div className="space-y-4">
                {['Name', 'Email'].map(field => (
                  <div key={field}>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-text)' }} htmlFor={`profile-${field.toLowerCase()}`}>{field}</label>
                    <input id={`profile-${field.toLowerCase()}`} type={field === 'Email' ? 'email' : 'text'} className="input-field" placeholder={`Your ${field.toLowerCase()}`} />
                  </div>
                ))}
                <button className="btn-primary" id="profile-save-btn">Save Changes</button>
              </div>
            </motion.div>
          )}

          {activeSection === 'privacy' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass p-6">
              <h2 className="font-bold mb-5" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)', fontSize: '1.2rem' }}>
                Privacy & Data
              </h2>
              <div className="space-y-4">
                <div className="p-4 rounded-xl" style={{ background: 'var(--color-accent-2)', border: '1px solid var(--color-border)' }}>
                  <div className="flex items-start gap-3">
                    <Shield size={18} style={{ color: 'var(--color-primary)', marginTop: '2px' }} />
                    <div>
                      <div className="font-semibold text-sm mb-1" style={{ color: 'var(--color-text)' }}>Your data stays local</div>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                        All your assessment answers and check-ins are stored on this device only. MindEase does not send personal data to any server.
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  className="btn-secondary"
                  id="clear-data-btn"
                  onClick={() => {
                    if (confirm('Clear all local data? This cannot be undone.')) {
                      ['me-report', 'me-assessment-answers', 'me-assessment-final', 'me-checkins', 'me-user'].forEach(k => localStorage.removeItem(k))
                    }
                  }}
                  style={{ color: '#f44336', borderColor: '#f44336' }}
                >
                  Clear All Local Data
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
