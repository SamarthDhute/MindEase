import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Check, Leaf, Sparkles, RefreshCw } from 'lucide-react'
import { ASSESSMENT_QUESTIONS, SECTIONS, MOTIVATIONAL_QUOTES } from '../data/questions'
import { useAuth } from '../contexts/AuthContext'

const SECTION_ICONS: Record<string, string> = {
  'About You': '👤',
  'Sleep & Rhythm': '😴',
  'Digital Habits': '📱',
  'Environment': '🏡',
  'Attention Signals': '🎯',
  'Thought Patterns': '🧠',
  'Wellbeing': '🌱',
}

type Answers = Record<string, string | number>

export default function AssessmentPage() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Answers>(() => {
    try {
      const stored = localStorage.getItem('me-assessment-answers')
      if (stored) return JSON.parse(stored)
      if (currentUser?.assessmentResponses) return { ...currentUser.assessmentResponses }
      return {}
    } catch {
      return {}
    }
  })
  const [direction, setDirection] = useState<1 | -1>(1)

  const question = ASSESSMENT_QUESTIONS[currentIdx]
  const totalQ = ASSESSMENT_QUESTIONS.length
  const progress = ((currentIdx + 1) / totalQ) * 100
  const currentSectionIdx = question.sectionIndex
  const currentValue = answers[question.featureKey]

  // Persist draft in localStorage
  useEffect(() => {
    localStorage.setItem('me-assessment-answers', JSON.stringify(answers))
  }, [answers])

  function goNext() {
    if (currentIdx < totalQ - 1) {
      setDirection(1)
      setCurrentIdx(i => i + 1)
    } else {
      // Finalize answers: combine with any cognitive scores saved on user
      const finalPayload: Answers = {
        ...(currentUser?.cognitiveScores || {}),
        ...answers,
      }
      localStorage.setItem('me-assessment-final', JSON.stringify(finalPayload))
      navigate('/analyzing')
    }
  }

  function goPrev() {
    if (currentIdx > 0) {
      setDirection(-1)
      setCurrentIdx(i => i - 1)
    }
  }

  function selectOption(value: string) {
    setAnswers(prev => ({ ...prev, [question.featureKey]: value }))
  }

  function toggleMultiSelectOption(option: string) {
    const rawExisting = (answers[question.featureKey] as string) || ''
    const currentList = rawExisting ? rawExisting.split(',') : []
    const isSelected = currentList.includes(option)
    const updatedList = isSelected ? currentList.filter(item => item !== option) : [...currentList, option]

    // Set compound string
    const updatedAnswers: Answers = {
      ...answers,
      [question.featureKey]: updatedList.join(','),
    }

    // Also map binary features for neural net
    if (question.binaryFeatureMap) {
      Object.entries(question.binaryFeatureMap).forEach(([optLabel, featureName]) => {
        updatedAnswers[featureName] = updatedList.includes(optLabel) ? 1.0 : 0.0
      })
    }

    setAnswers(updatedAnswers)
  }

  const variants = {
    enter: (dir: number) => ({ opacity: 0, x: dir * 60 }),
    center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
    exit: (dir: number) => ({ opacity: 0, x: dir * -60, transition: { duration: 0.2 } }),
  }

  const motivationalQuote = MOTIVATIONAL_QUOTES[currentSectionIdx % MOTIVATIONAL_QUOTES.length]

  return (
    <div
      className="min-h-screen flex flex-col w-full"
      style={{ background: 'var(--gradient-hero)', paddingBottom: '3rem' }}
    >
      {/* Background illustration overlay */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ backgroundImage: 'url(/illustrations/forest.jpg)', backgroundSize: 'cover', opacity: 0.07 }}
      />

      <div className="relative z-10 w-full max-w-3xl mx-auto px-4 pt-6">
        {/* Retake Notice if previously completed */}
        {currentUser?.assessmentCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3.5 rounded-2xl flex items-center justify-between text-xs"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
            }}
          >
            <div className="flex items-center gap-2">
              <Sparkles size={15} style={{ color: 'var(--color-primary)' }} />
              <span>
                <strong>Comprehensive Baseline Active:</strong> Updating will refine your personal attention model.
              </span>
            </div>
            <Link
              to="/dashboard"
              className="px-3 py-1 rounded-lg font-medium text-xs transition-colors"
              style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
            >
              Dashboard
            </Link>
          </motion.div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Leaf size={22} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 600, color: 'var(--color-primary)' }}>
              MindEase Assessment
            </span>
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--color-text-muted)' }}>
            Question {currentIdx + 1} of {totalQ}
          </span>
        </div>

        {/* Progress bar */}
        <div className="progress-track mb-5">
          <motion.div
            className="progress-fill"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        {/* Section stepper pills */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-none">
          {SECTIONS.map((section, i) => {
            const sectionQuestions = ASSESSMENT_QUESTIONS.filter(q => q.sectionIndex === i)
            const answeredInSection = sectionQuestions.filter(q => {
              const val = answers[q.featureKey]
              return val !== undefined && val !== ''
            }).length
            const isComplete = answeredInSection === sectionQuestions.length
            const isCurrent = i === currentSectionIdx

            return (
              <div
                key={section}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shadow-sm"
                style={{
                  background: isCurrent
                    ? 'var(--color-primary)'
                    : isComplete
                      ? 'var(--color-accent-2)'
                      : 'var(--color-surface)',
                  color: isCurrent
                    ? 'white'
                    : isComplete
                      ? 'var(--color-primary)'
                      : 'var(--color-text-muted)',
                  border: `1px solid ${isCurrent ? 'var(--color-primary)' : 'var(--color-border)'}`,
                }}
              >
                {isComplete && !isCurrent ? (
                  <Check size={12} />
                ) : (
                  <span>{SECTION_ICONS[section] || '🌿'}</span>
                )}
                {section}
              </div>
            )
          })}
        </div>

        {/* Calming contextual thought */}
        <motion.p
          key={currentSectionIdx}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-center mb-6 font-medium italic"
          style={{ color: 'var(--color-text-muted)', maxWidth: '560px', margin: '0 auto 1.5rem' }}
        >
          "{motivationalQuote}"
        </motion.p>

        {/* Question Card */}
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={question.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <div className="glass p-7 md:p-9 shadow-lg">
              {/* Question header */}
              <div className="flex items-start gap-4 mb-7">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-sm"
                  style={{ background: 'var(--color-accent-2)' }}
                >
                  {question.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
                      style={{ background: 'var(--color-surface-2)', color: 'var(--color-primary)' }}
                    >
                      {question.section}
                    </span>
                    {question.multiSelect && (
                      <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        (Select all that apply)
                      </span>
                    )}
                  </div>
                  <h2
                    style={{
                      fontSize: 'clamp(1.15rem, 3vw, 1.4rem)',
                      fontWeight: 600,
                      color: 'var(--color-text)',
                      lineHeight: 1.35,
                      fontFamily: 'var(--font-serif)',
                    }}
                  >
                    {question.question}
                  </h2>
                  {question.hint && (
                    <p className="mt-1.5 text-xs md:text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      {question.hint}
                    </p>
                  )}
                </div>
              </div>

              {/* Single Select Options */}
              {question.type === 'select' && question.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.options.map(option => {
                    const selected = currentValue === option
                    return (
                      <motion.button
                        key={option}
                        onClick={() => selectOption(option)}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
                        style={{
                          background: selected ? 'var(--color-primary)' : 'var(--color-surface)',
                          color: selected ? 'white' : 'var(--color-text)',
                          border: `2px solid ${selected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.92rem',
                          fontWeight: 500,
                        }}
                        id={`option-${option.replace(/\s+/g, '-').toLowerCase()}`}
                      >
                        <div
                          className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-colors"
                          style={{
                            border: `2px solid ${selected ? 'white' : 'var(--color-border)'}`,
                            background: selected ? 'white' : 'transparent',
                          }}
                        >
                          {selected && (
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-primary)' }} />
                          )}
                        </div>
                        <span className="leading-snug">{option}</span>
                      </motion.button>
                    )
                  })}
                </div>
              )}

              {/* Multi-Select Options */}
              {question.type === 'multi-select' && question.options && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {question.options.map(option => {
                    const selectedList = ((answers[question.featureKey] as string) || '').split(',')
                    const isSelected = selectedList.includes(option)
                    return (
                      <motion.button
                        key={option}
                        onClick={() => toggleMultiSelectOption(option)}
                        whileHover={{ scale: 1.015 }}
                        whileTap={{ scale: 0.985 }}
                        className="flex items-center gap-3 p-3.5 rounded-xl text-left transition-all"
                        style={{
                          background: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                          color: isSelected ? 'white' : 'var(--color-text)',
                          border: `2px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
                          cursor: 'pointer',
                          fontFamily: 'var(--font-sans)',
                          fontSize: '0.92rem',
                          fontWeight: 500,
                        }}
                      >
                        <div
                          className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center transition-colors"
                          style={{
                            border: `2px solid ${isSelected ? 'white' : 'var(--color-border)'}`,
                            background: isSelected ? 'white' : 'transparent',
                          }}
                        >
                          {isSelected && <Check size={14} style={{ color: 'var(--color-primary)' }} />}
                        </div>
                        <span className="leading-snug">{option}</span>
                      </motion.button>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="flex items-center justify-between mt-6">
          <motion.button
            onClick={goPrev}
            disabled={currentIdx === 0}
            whileHover={{ scale: currentIdx > 0 ? 1.04 : 1 }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-sm"
            style={{
              background: 'var(--color-surface)',
              color: currentIdx === 0 ? 'var(--color-border)' : 'var(--color-text-muted)',
              border: '1.5px solid var(--color-border)',
              cursor: currentIdx === 0 ? 'not-allowed' : 'pointer',
              fontFamily: 'var(--font-sans)',
            }}
            id="assessment-prev-btn"
          >
            <ChevronLeft size={16} /> Previous
          </motion.button>

          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {Object.keys(answers).filter(k => answers[k] !== undefined && answers[k] !== '').length} of {totalQ} completed
          </span>

          <motion.button
            onClick={goNext}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary"
            id="assessment-next-btn"
          >
            {currentIdx === totalQ - 1 ? (
              <>
                Analyze With AI <Leaf size={16} />
              </>
            ) : (
              <>
                Next <ChevronRight size={16} />
              </>
            )}
          </motion.button>
        </div>

        {/* Cognitive Tests Callout Link */}
        <div className="mt-8 pt-4 border-t text-center" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-xs mb-2" style={{ color: 'var(--color-text-muted)' }}>
            Want objective attention benchmarks before receiving your report?
          </p>
          <Link
            to="/cognitive"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all"
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-primary)',
              border: '1px solid var(--color-border)',
            }}
          >
            Play 6 Interactive Cognitive Mini-Games →
          </Link>
        </div>
      </div>
    </div>
  )
}
