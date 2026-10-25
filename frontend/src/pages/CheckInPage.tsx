import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Check, ChevronRight, ChevronLeft, Sparkles, Moon, Sun, Smartphone, Bell, Target } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const MOODS = [
  { value: 1, emoji: '😔', label: 'Low' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 3, emoji: '😐', label: 'Okay' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😄', label: 'Great' },
]

const ENERGY_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
const FOCUS_LEVELS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const SLEEP_QUALITIES = ['Poor', 'Average', 'Good', 'Excellent']
const REFRESHED_OPTIONS = ['Yes, fully', 'Somewhat', 'No, groggy']
const SCREEN_TIMES = ['Under 3h', '3-5h', '6-8h', '8h+']
const NOTIF_LEVELS = ['Minimal', 'Moderate', 'Frequent']
const DISTRACTIONS = ['Phone', 'Thoughts', 'People', 'Noise', 'Fatigue', 'Stress']

export default function CheckInPage() {
  const navigate = useNavigate()
  const { saveCheckIn } = useAuth()

  const [step, setStep] = useState(0)
  const [mood, setMood] = useState<number>(4)
  const [energy, setEnergy] = useState<number>(6)
  const [focus, setFocus] = useState<number>(6)
  const [sleepQuality, setSleepQuality] = useState<string>('Good')
  const [wakeRefreshed, setWakeRefreshed] = useState<string>('Somewhat')
  const [screenTime, setScreenTime] = useState<string>('3-5h')
  const [notifInterrupt, setNotifInterrupt] = useState<string>('Moderate')
  const [distraction, setDistraction] = useState<string>('Phone')
  const [note, setNote] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    const today = new Date().toISOString().split('T')[0]
    saveCheckIn({
      date: today,
      mood,
      energy,
      focus,
      sleepQuality,
      wakeRefreshed,
      approximateScreenTimeHours: screenTime,
      notificationInterruptions: notifInterrupt,
      biggestDistraction: distraction,
      note,
    })

    setSubmitted(true)
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--gradient-hero)' }}>
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="glass p-10 text-center max-w-sm shadow-xl"
        >
          <motion.div
            animate={{ scale: [1, 1.25, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 0.8 }}
            className="text-6xl mb-4"
          >
            🌿
          </motion.div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--color-text)', marginBottom: '0.5rem' }}>
            Check-In Logged!
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.5 }}>
            Thank you for checking in with yourself today. Returning to your dashboard…
          </p>
        </motion.div>
      </div>
    )
  }

  const steps = [
    // Step 0: Mood & Energy
    {
      title: "How's your mood and energy today?",
      subtitle: 'Check in with how your body and mind feel right now',
      content: (
        <div>
          {/* Mood emojis */}
          <div className="flex justify-center gap-2.5 sm:gap-4 mb-8">
            {MOODS.map(m => (
              <motion.button
                key={m.value}
                onClick={() => setMood(m.value)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl transition-all"
                style={{
                  background: mood === m.value ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: mood === m.value ? 'white' : 'var(--color-text)',
                  border: `2px solid ${mood === m.value ? 'var(--color-primary)' : 'var(--color-border)'}`,
                  minWidth: '60px',
                }}
              >
                <span className="text-3xl">{m.emoji}</span>
                <span className="text-[11px] font-semibold">{m.label}</span>
              </motion.button>
            ))}
          </div>

          <label className="block text-xs font-semibold mb-2 text-center" style={{ color: 'var(--color-text-muted)' }}>
            Energy Level: <strong style={{ color: 'var(--color-primary)' }}>{energy} / 10</strong>
          </label>
          <div className="flex gap-1.5 justify-between">
            {ENERGY_LEVELS.map(v => (
              <button
                key={v}
                onClick={() => setEnergy(v)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: energy === v ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: energy === v ? 'white' : 'var(--color-text)',
                  border: `1.5px solid ${energy === v ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      ),
    },

    // Step 1: Focus & Sleep
    {
      title: 'Focus Level & Sleep Quality',
      subtitle: 'How was your rest last night and your focus capacity today?',
      content: (
        <div>
          <label className="block text-xs font-semibold mb-2 text-center" style={{ color: 'var(--color-text-muted)' }}>
            Focus Ability Today: <strong style={{ color: 'var(--color-primary)' }}>{focus} / 10</strong>
          </label>
          <div className="flex gap-1.5 justify-between mb-6">
            {FOCUS_LEVELS.map(v => (
              <button
                key={v}
                onClick={() => setFocus(v)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  background: focus === v ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: focus === v ? 'white' : 'var(--color-text)',
                  border: `1.5px solid ${focus === v ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
              >
                {v}
              </button>
            ))}
          </div>

          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Sleep Quality Last Night
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
            {SLEEP_QUALITIES.map(q => (
              <button
                key={q}
                onClick={() => setSleepQuality(q)}
                className="py-2.5 px-3 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: sleepQuality === q ? 'var(--color-accent-2)' : 'var(--color-surface)',
                  color: sleepQuality === q ? 'var(--color-primary)' : 'var(--color-text)',
                  border: `1.5px solid ${sleepQuality === q ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
              >
                {q}
              </button>
            ))}
          </div>

          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Did you wake up feeling refreshed?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {REFRESHED_OPTIONS.map(r => (
              <button
                key={r}
                onClick={() => setWakeRefreshed(r)}
                className="py-2 px-3 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: wakeRefreshed === r ? 'var(--color-accent-2)' : 'var(--color-surface)',
                  color: wakeRefreshed === r ? 'var(--color-primary)' : 'var(--color-text)',
                  border: `1.5px solid ${wakeRefreshed === r ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      ),
    },

    // Step 2: Digital & Distractions
    {
      title: 'Digital Flow & Disruptions',
      subtitle: 'Understand where your attention met friction today',
      content: (
        <div>
          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Approximate Screen Time Today
          </label>
          <div className="grid grid-cols-4 gap-2 mb-5">
            {SCREEN_TIMES.map(st => (
              <button
                key={st}
                onClick={() => setScreenTime(st)}
                className="py-2 px-2 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: screenTime === st ? 'var(--color-accent-2)' : 'var(--color-surface)',
                  color: screenTime === st ? 'var(--color-primary)' : 'var(--color-text)',
                  border: `1.5px solid ${screenTime === st ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Notification Interruptions
          </label>
          <div className="grid grid-cols-3 gap-2 mb-5">
            {NOTIF_LEVELS.map(nl => (
              <button
                key={nl}
                onClick={() => setNotifInterrupt(nl)}
                className="py-2 px-3 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: notifInterrupt === nl ? 'var(--color-accent-2)' : 'var(--color-surface)',
                  color: notifInterrupt === nl ? 'var(--color-primary)' : 'var(--color-text)',
                  border: `1.5px solid ${notifInterrupt === nl ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
              >
                {nl}
              </button>
            ))}
          </div>

          <label className="block text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Biggest Distraction Source Today
          </label>
          <div className="grid grid-cols-3 gap-2">
            {DISTRACTIONS.map(d => (
              <button
                key={d}
                onClick={() => setDistraction(d)}
                className="py-2 px-3 rounded-xl text-xs font-medium transition-all"
                style={{
                  background: distraction === d ? 'var(--color-primary)' : 'var(--color-surface)',
                  color: distraction === d ? 'white' : 'var(--color-text)',
                  border: `1.5px solid ${distraction === d ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      ),
    },

    // Step 3: Optional Reflection Note
    {
      title: 'Gentle Reflection (Optional)',
      subtitle: 'What helped or hindered your attention today?',
      content: (
        <div>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={4}
            placeholder="e.g. Taking a walk before studying helped me stay grounded; had wandering thoughts around 3 PM..."
            className="input-field mb-4 resize-none"
            style={{ fontSize: '0.9rem' }}
          />
          <div className="p-3 rounded-xl text-xs" style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}>
            🌱 Reflective journaling trains metacognitive awareness, helping you spot attention patterns before they overwhelm you.
          </div>
        </div>
      ),
    },
  ]

  const currentStep = steps[step]

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: 'url(/illustrations/forest.jpg)', backgroundSize: 'cover', opacity: 0.07 }}
      />

      <div className="relative z-10 w-full max-w-lg">
        {/* Step Indicator */}
        <div className="progress-track mb-6 shadow-sm">
          <div
            className="progress-fill"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className="glass p-7 md:p-9 shadow-lg"
          >
            <div className="text-center mb-6">
              <span
                className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full mb-2 inline-block"
                style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
              >
                Step {step + 1} of {steps.length} · 1-Minute Reflection
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                  color: 'var(--color-text)',
                  marginBottom: '0.35rem',
                }}
              >
                {currentStep.title}
              </h2>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {currentStep.subtitle}
              </p>
            </div>

            {currentStep.content}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between mt-8 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              {step > 0 ? (
                <button
                  onClick={() => setStep(s => s - 1)}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1"
                >
                  <ChevronLeft size={14} /> Back
                </button>
              ) : (
                <div />
              )}

              {step < steps.length - 1 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="btn-primary text-xs py-2 px-4 flex items-center gap-1"
                >
                  Continue <ChevronRight size={14} />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="btn-primary text-xs py-2.5 px-5 flex items-center gap-1.5"
                >
                  <Check size={15} /> Save Daily Check-In
                </button>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
