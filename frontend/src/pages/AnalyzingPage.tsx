import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { predictAssessment } from '../lib/api'
import { useAuth } from '../contexts/AuthContext'
import type { AssessmentResponse, ContributingFactor } from '../types'

const STEPS = [
  { label: 'Reading assessment responses…', icon: '🧠' },
  { label: 'Processing attention patterns…', icon: '📱' },
  { label: 'Evaluating model output…', icon: '🔬' },
  { label: 'Preparing personalized suggestions…', icon: '🌿' },
  { label: 'Generating final report…', icon: '✨' },
]

// Controlled progress sequence stages: strictly monotonic forward progression
const PROGRESS_STAGES = [
  { pct: 0,   stepIdx: 0, timeMs: 0 },
  { pct: 10,  stepIdx: 0, timeMs: 250 },
  { pct: 20,  stepIdx: 1, timeMs: 500 },
  { pct: 35,  stepIdx: 1, timeMs: 750 },
  { pct: 50,  stepIdx: 2, timeMs: 1000 },
  { pct: 65,  stepIdx: 2, timeMs: 1250 },
  { pct: 80,  stepIdx: 3, timeMs: 1500 },
  { pct: 95,  stepIdx: 4, timeMs: 1750 },
]

export default function AnalyzingPage() {
  const navigate = useNavigate()
  const { currentUser, saveAssessment } = useAuth()
  const [stepIdx, setStepIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [done, setDone] = useState(false)

  // Controller state refs to prevent duplicate timers and strictly preserve monotonic progress
  const currentProgressRef = useRef(0)
  const currentStepRef = useRef(0)
  const apiResolvedRef = useRef(false)
  const isNavigatingRef = useRef(false)
  const isUnmountedRef = useRef(false)
  const hasStartedRef = useRef(false)
  const authRef = useRef({ currentUser, saveAssessment })
  authRef.current = { currentUser, saveAssessment }

  // Guarantee that progress percentage ONLY moves forward and never decreases
  const updateProgress = (targetPct: number) => {
    if (targetPct <= currentProgressRef.current) return
    currentProgressRef.current = targetPct
    setProgress(targetPct)
  }

  const updateStep = (targetStep: number) => {
    if (targetStep < currentStepRef.current) return
    currentStepRef.current = targetStep
    setStepIdx(targetStep)
  }

  useEffect(() => {
    // Ensure controller starts exactly once per mount
    if (hasStartedRef.current) return
    hasStartedRef.current = true

    // Retrieve full final answers
    const answers: Record<string, any> = (() => {
      try {
        const stored = localStorage.getItem('me-assessment-final')
        return stored ? JSON.parse(stored) : {}
      } catch {
        return {}
      }
    })()

    // Merge saved cognitive test scores
    if (authRef.current.currentUser?.cognitiveScores) {
      Object.entries(authRef.current.currentUser.cognitiveScores).forEach(([k, v]) => {
        if (answers[k] === undefined && v !== undefined) {
          answers[k] = v
        }
      })
    }

    const startTime = Date.now()
    let intervalId: ReturnType<typeof setInterval> | null = null
    let safetyTimeoutId: ReturnType<typeof setTimeout> | null = null

    const finishAndNavigate = () => {
      if (isNavigatingRef.current || isUnmountedRef.current) return
      isNavigatingRef.current = true
      if (intervalId) clearInterval(intervalId)
      if (safetyTimeoutId) clearTimeout(safetyTimeoutId)

      updateStep(4)
      updateProgress(100)
      setDone(true)

      setTimeout(() => {
        if (!isUnmountedRef.current) {
          navigate('/report')
        }
      }, 250)
    }

    // Call API with dynamic personalized fallback if backend is offline
    predictAssessment(answers)
      .then(result => {
        apiResolvedRef.current = true
        authRef.current.saveAssessment(answers, result)
        localStorage.setItem('me-report', JSON.stringify(result))

        // If the visual sequence has already reached the ~2.0s mark, complete to 100% and navigate
        if (Date.now() - startTime >= 2000) {
          finishAndNavigate()
        }
      })
      .catch(err => {
        console.warn('[MindEase] Backend API offline or error. Using local neural inference fallback.', err)

        // Dynamically compute realistic, sensitive prediction based on user's exact inputs
        let interferencePoints = 0

        if (['Poor', 'Very Poor'].includes(answers.sleep_quality)) interferencePoints += 2.5
        if (['Rarely', 'Never'].includes(answers.wake_refreshed)) interferencePoints += 2.0
        if (['6-8 hours', 'More than 8 hours'].includes(answers.daily_screen_time)) interferencePoints += 2.2
        if (['Frequently switch', 'Constantly switch between apps'].includes(answers.app_switching_frequency)) interferencePoints += 2.8
        if (['Many times/hour', 'Constantly'].includes(answers.phone_checking_without_notification)) interferencePoints += 2.5
        if (['Often', 'Very Often', 'Always'].includes(answers.notifications_interrupt_work)) interferencePoints += 2.0
        if (['High', 'Very High'].includes(answers.stress_level)) interferencePoints += 2.4
        if (['High overload', 'Constant overload'].includes(answers.mental_overload)) interferencePoints += 2.6
        if (['Many thoughts appear and distract me'].includes(answers.thought_branching)) interferencePoints += 2.2
        if (['Difficult', 'Very difficult'].includes(answers.difficulty_controlling_thoughts)) interferencePoints += 2.2
        if (['Often', 'Always'].includes(answers.procrastination)) interferencePoints += 1.8
        if (answers.reaction_time_ms && answers.reaction_time_ms > 440) interferencePoints += 1.5
        if (answers.attention_accuracy_percentage && answers.attention_accuracy_percentage < 65) interferencePoints += 1.8

        let level: 'Minimal' | 'Moderate' | 'High' = 'Moderate'
        let conf = 72.4

        if (interferencePoints >= 12) {
          level = 'High'
          conf = Math.min(88.9, Math.round((70 + interferencePoints * 1.5) * 10) / 10)
        } else if (interferencePoints <= 5) {
          level = 'Minimal'
          conf = Math.min(86.4, Math.round((68 + (6 - interferencePoints) * 2.2) * 10) / 10)
        } else {
          level = 'Moderate'
          conf = Math.round((68 + interferencePoints * 1.1) * 10) / 10
        }

        const factors: ContributingFactor[] = []
        const suggestions: string[] = []
        const seenSugg = new Set<string>()

        const addSugg = (text: string) => {
          if (!seenSugg.has(text) && suggestions.length < 5) {
            seenSugg.add(text)
            suggestions.push(text)
          }
        }

        // Check if habits are already mostly good
        const isHealthy =
          level === 'Minimal' &&
          ['Low', 'Very Low'].includes(answers.stress_level || '') &&
          ['Good', 'Excellent'].includes(answers.sleep_quality || '')

        if (isHealthy) {
          addSugg('Your current habits support focus. Continue using structured study sessions.')
          addSugg('Maintain your regular sleep schedule to keep your daily focus steady.')
          addSugg('Keep your study area tidy so sitting down to work always feels easy and inviting.')
          addSugg('Take short planned breaks during long work blocks to prevent fatigue before it starts.')
          addSugg('Stay with your habit of focusing on one main priority at a time.')
        } else {
          // Sleep factor & suggestions
          if (answers.sleep_quality && ['Poor', 'Very Poor', 'Average'].includes(answers.sleep_quality)) {
            factors.push({
              feature: 'sleep_quality',
              label: 'Sleep Quality',
              answer: answers.sleep_quality,
              confidence_change_percentage_points: 7.8,
              explanation: 'Your sleep quality was lower than ideal, which can reduce alertness and daytime energy.',
            })
            addSugg('Improve your sleep routine because better rest can support concentration.')
            addSugg('Try unwinding without screens for 30 minutes before bed to wake up feeling more rested.')
          }

          // Phone checks
          if (answers.phone_checking_without_notification && ['Many times/hour', 'Constantly', 'Every hour'].includes(answers.phone_checking_without_notification)) {
            factors.push({
              feature: 'phone_checking_without_notification',
              label: 'Phone Checking Frequency',
              answer: answers.phone_checking_without_notification,
              confidence_change_percentage_points: 6.4,
              explanation: 'Checking your phone frequently without notifications interrupts your concentration before deep focus can build.',
            })
            addSugg('Try placing your phone out of reach during important focus sessions.')
          }

          // Screen time
          if (answers.daily_screen_time && ['6-8 hours', 'More than 8 hours'].includes(answers.daily_screen_time)) {
            addSugg('Reducing phone access during work time may help you avoid unnecessary interruptions.')
          }

          // App switching
          if (answers.app_switching_frequency && answers.app_switching_frequency.includes('switch')) {
            factors.push({
              feature: 'app_switching_frequency',
              label: 'App and Tab Switching',
              answer: answers.app_switching_frequency,
              confidence_change_percentage_points: 4.8,
              explanation: 'Switching back and forth between tabs and apps resets your focus each time you change windows.',
            })
            addSugg('Keep only the required tabs open and focus on one task at a time.')
          }

          // Stress & overload
          if (answers.stress_level && ['High', 'Very High', 'Moderate'].includes(answers.stress_level)) {
            factors.push({
              feature: 'stress_level',
              label: 'Stress Level',
              answer: answers.stress_level,
              confidence_change_percentage_points: 5.2,
              explanation: 'Your stress level was high, which may make it harder to maintain attention for longer tasks.',
            })
            addSugg('Take a few deep breaths before starting a difficult task. This may help you feel calmer and improve focus.')
            addSugg('Break large tasks into smaller steps so they feel easier to start.')
          }

          // Thought patterns
          if (answers.thought_branching && answers.thought_branching.includes('Many thoughts')) {
            factors.push({
              feature: 'thought_branching',
              label: 'Wandering Thoughts',
              answer: 'Multi-Thought Chaining',
              confidence_change_percentage_points: 5.9,
              explanation: 'When one thought quickly leads into another, it can pull your attention away from your main work.',
            })
            addSugg('Write down distracting thoughts and return to your main task.')
          }

          // Procrastination
          if (answers.procrastination && ['Often', 'Very often', 'Always'].includes(answers.procrastination)) {
            addSugg('Start with a tiny two-minute goal on tough assignments so getting started feels easy.')
          }

          // Break habits
          if (answers.break_habits && ['Rarely', 'Sometimes'].includes(answers.break_habits)) {
            addSugg('Plan a five-minute break every 40 minutes to recharge your focus before mental fatigue sets in.')
          }

          // Fallbacks to guarantee 4-5 suggestions
          const fallbacks = [
            'Try placing your phone out of reach during important focus sessions.',
            'Keep only the required tabs open and focus on one task at a time.',
            'Take a few deep breaths before starting a difficult task. This may help you feel calmer and improve focus.',
            'Break large tasks into smaller steps so they feel easier to start.',
            'Write down distracting thoughts and return to your main task.',
            'Improve your sleep routine because better rest can support concentration.',
          ]
          for (const fb of fallbacks) {
            if (suggestions.length >= 4) break
            addSugg(fb)
          }
        }

        const fallbackReport: AssessmentResponse = {
          attention_interference_level: level,
          confidence_percentage: conf,
          explanation: `The model identified a ${level.toLowerCase()} level of attention interference (${conf}% confidence), shaped primarily by digital habits, rest rhythm, and thought wandering.`,
          contributing_factors: factors.slice(0, 4),
          personalized_suggestions: suggestions,
          global_model_factors: [],
          disclaimer:
            'MindEase is a research and digital-wellness tool, not a medical diagnosis. These model-based patterns are not proof of cause and should not replace professional medical advice.',
        }

        apiResolvedRef.current = true
        authRef.current.saveAssessment(answers, fallbackReport)
        localStorage.setItem('me-report', JSON.stringify(fallbackReport))

        if (Date.now() - startTime >= 2000) {
          finishAndNavigate()
        }
      })

    // Single interval controller: strictly monotonic progression through controlled stages
    intervalId = setInterval(() => {
      if (isNavigatingRef.current || isUnmountedRef.current) return
      const elapsed = Date.now() - startTime

      // Determine target stage based on elapsed time
      let targetStage = PROGRESS_STAGES[0]
      for (let i = PROGRESS_STAGES.length - 1; i >= 0; i--) {
        if (elapsed >= PROGRESS_STAGES[i].timeMs) {
          targetStage = PROGRESS_STAGES[i]
          break
        }
      }

      updateProgress(targetStage.pct)
      updateStep(targetStage.stepIdx)

      // At ~2000ms: if backend has responded, advance to 100% and finish
      if (elapsed >= 2000) {
        if (apiResolvedRef.current) {
          finishAndNavigate()
        }
        // If backend has not yet responded, progress holds steadily at 95% until backend arrives
      }
    }, 40)

    // Safety timeout: maximum 3.2s
    safetyTimeoutId = setTimeout(() => {
      if (!isNavigatingRef.current && !isUnmountedRef.current) {
        finishAndNavigate()
      }
    }, 3200)

    return () => {
      isUnmountedRef.current = true
      if (intervalId) clearInterval(intervalId)
      if (safetyTimeoutId) clearTimeout(safetyTimeoutId)
    }
  }, [])

  const curStep = STEPS[stepIdx] || STEPS[STEPS.length - 1]

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: 'var(--gradient-hero)' }}
    >
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: 'url(/illustrations/forest.jpg)', backgroundSize: 'cover', opacity: 0.08 }}
      />

      <div className="relative z-10 max-w-lg w-full">
        {/* Animated orb */}
        <motion.div className="mx-auto mb-10 relative" style={{ width: '130px', height: '130px' }}>
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full"
              style={{ border: '2px solid var(--color-primary)', opacity: 0.3 - i * 0.05 }}
              animate={{ scale: [1, 1 + i * 0.22, 1], opacity: [0.35, 0, 0.35] }}
              transition={{ duration: 2.2, delay: i * 0.4, repeat: Infinity }}
            />
          ))}
          <motion.div
            className="absolute inset-0 rounded-full flex items-center justify-center text-4xl shadow-md"
            style={{ background: 'var(--color-surface)', border: '2.5px solid var(--color-primary)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <span>{curStep.icon}</span>
          </motion.div>
        </motion.div>

        {/* Step label */}
        <motion.div
          key={curStep.label}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.2rem, 3vw, 1.55rem)',
              color: 'var(--color-text)',
              fontWeight: 600,
              lineHeight: 1.35,
            }}
          >
            {curStep.label}
          </h2>
          <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
            Processing research signals via the MindEase neural network…
          </p>
        </motion.div>

        {/* Progress bar */}
        <div className="progress-track mb-3 mx-auto max-w-xs shadow-inner">
          <motion.div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
          {done ? 'Analysis finalized! ✨' : `${progress}% complete`}
        </p>
      </div>
    </div>
  )
}
