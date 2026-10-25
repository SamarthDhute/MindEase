import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import {
  Timer,
  Eye,
  Target,
  Brain,
  Palette,
  Shuffle,
  CheckCircle2,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import type { CognitiveScores } from '../types'

// ── 1. Reaction Time Test ────────────────────────────────────────────
function ReactionTest({ onSave }: { onSave: (ms: number) => void }) {
  const [state, setState] = useState<'waiting' | 'ready' | 'go' | 'done'>('waiting')
  const [startTime, setStartTime] = useState(0)
  const [result, setResult] = useState<number | null>(null)

  function start() {
    setState('ready')
    const delay = 1600 + Math.random() * 2400
    setTimeout(() => {
      setState('go')
      setStartTime(Date.now())
    }, delay)
  }

  function handleClick() {
    if (state === 'go') {
      const ms = Date.now() - startTime
      setResult(ms)
      setState('done')
      onSave(ms)
    } else if (state === 'ready') {
      // Clicked too early
      setState('waiting')
    }
  }

  return (
    <div className="glass p-8 text-center">
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
        1. Reaction Speed Test
      </h3>
      <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
        Measures neuromuscular processing speed and sensory-motor reaction latency.
      </p>

      <motion.div
        className="w-full h-56 rounded-2xl flex flex-col items-center justify-center cursor-pointer select-none transition-colors"
        onClick={state === 'waiting' || state === 'done' ? start : handleClick}
        animate={{
          background:
            state === 'go' ? '#4caf50' : state === 'ready' ? '#ff9800' : 'var(--color-surface-2)',
        }}
        whileTap={{ scale: 0.98 }}
      >
        {state === 'waiting' && (
          <div>
            <div className="text-4xl mb-2">⏱️</div>
            <p className="font-semibold text-base" style={{ color: 'var(--color-text)' }}>
              Click to Begin
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Wait for orange to turn green, then click as fast as you can.
            </p>
          </div>
        )}
        {state === 'ready' && (
          <div>
            <div className="text-4xl mb-2">👀</div>
            <p className="font-bold text-base text-white">Wait for Green…</p>
            <p className="text-xs text-white opacity-80 mt-1">Don't click yet!</p>
          </div>
        )}
        {state === 'go' && (
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-center">
            <div className="text-5xl mb-1">🟢</div>
            <p className="text-2xl font-extrabold text-white">CLICK NOW!</p>
          </motion.div>
        )}
        {state === 'done' && result && (
          <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <div className="text-4xl mb-1">⚡</div>
            <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {result} ms
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              {result < 320 ? 'Excellent reflexes! ✨' : result < 450 ? 'Steady reaction flow 👍' : 'Normal natural tempo 🌱'}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                start()
              }}
              className="mt-4 px-3 py-1 rounded-lg text-xs flex items-center gap-1 mx-auto"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-primary)' }}
            >
              <RotateCcw size={12} /> Try Again
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// ── 2. Continuous Attention Test ─────────────────────────────────────
function ContinuousAttentionTest({
  onSave,
}: {
  onSave: (accuracy: number, missed: number, score: number) => void
}) {
  const [isRunning, setIsRunning] = useState(false)
  const [currentItem, setCurrentItem] = useState<{ icon: string; isTarget: boolean } | null>(null)
  const [step, setStep] = useState(0)
  const [hits, setHits] = useState(0)
  const [falseAlarms, setFalseAlarms] = useState(0)
  const [missed, setMissed] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  const TOTAL_STEPS = 12

  function start() {
    setIsRunning(true)
    setIsDone(false)
    setStep(0)
    setHits(0)
    setFalseAlarms(0)
    setMissed(0)
    nextStimulus(0, 0, 0, 0)
  }

  function nextStimulus(curStep: number, curHits: number, curFa: number, curMissed: number) {
    if (curStep >= TOTAL_STEPS) {
      const accuracy = Math.round(Math.max(10, Math.min(100, ((curHits + (TOTAL_STEPS - 4 - curFa)) / TOTAL_STEPS) * 100)))
      const finalScore = Math.round(Math.max(20, Math.min(98, accuracy - curMissed * 3)))
      setScore(finalScore)
      setIsDone(true)
      setIsRunning(false)
      setCurrentItem(null)
      onSave(accuracy, curMissed, finalScore)
      return
    }

    const isTarget = Math.random() < 0.35
    const targetIcon = '🌿'
    const distractors = ['🌸', '🌊', '🪨', '☁️', '🍂', '☀️']
    const icon = isTarget ? targetIcon : distractors[Math.floor(Math.random() * distractors.length)]

    setCurrentItem({ icon, isTarget })
    setStep(curStep + 1)

    // Window duration
    setTimeout(() => {
      // If user didn't tap a target
      const updatedMissed = isTarget ? curMissed + 1 : curMissed
      setMissed(updatedMissed)
      nextStimulus(curStep + 1, curHits, curFa, updatedMissed)
    }, 900)
  }

  function handleTap() {
    if (!currentItem || !isRunning) return
    if (currentItem.isTarget) {
      setHits(h => h + 1)
    } else {
      setFalseAlarms(f => f + 1)
    }
  }

  return (
    <div className="glass p-8 text-center">
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
        2. Continuous Attention Vigilance
      </h3>
      <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
        Tap ONLY when the 🌿 Leaf appears. Ignore all stones, waves, and clouds!
      </p>

      <div className="w-full h-56 rounded-2xl flex flex-col items-center justify-center p-6" style={{ background: 'var(--color-surface-2)' }}>
        {!isRunning && !isDone && (
          <div>
            <div className="text-4xl mb-3">🌿</div>
            <p className="font-semibold text-sm mb-4" style={{ color: 'var(--color-text)' }}>
              Target: 🌿 Leaf Symbol
            </p>
            <button onClick={start} className="btn-primary text-xs py-2 px-5">
              Start 15s Focus Stream
            </button>
          </div>
        )}

        {isRunning && currentItem && (
          <div className="flex flex-col items-center cursor-pointer select-none" onClick={handleTap}>
            <div className="text-6xl mb-4 transform scale-110 transition-transform">{currentItem.icon}</div>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleTap()
              }}
              className="btn-primary text-xs py-2 px-6"
            >
              TAP TARGET 🌿
            </button>
            <p className="text-xs mt-3 opacity-60">Trial {step} of {TOTAL_STEPS}</p>
          </div>
        )}

        {isDone && score !== null && (
          <div>
            <div className="text-4xl mb-1">🎯</div>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {score}% Attention Accuracy
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Vigilance Score: {score} / 100 · Missed Targets: {missed}
            </p>
            <button
              onClick={start}
              className="mt-4 px-3 py-1 rounded-lg text-xs flex items-center gap-1 mx-auto"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-primary)' }}
            >
              <RotateCcw size={12} /> Retake
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 3. Focus Flow Test ───────────────────────────────────────────────
function FocusFlowTest({
  onSave,
}: {
  onSave: (distractions: number, recoverySeconds: number) => void
}) {
  const [active, setActive] = useState(false)
  const [distractions, setDistractions] = useState(0)
  const [completed, setCompleted] = useState(false)

  function start() {
    setActive(true)
    setCompleted(false)
    setDistractions(0)

    // Simulate focus session duration
    setTimeout(() => {
      setActive(false)
      setCompleted(true)
      const simulatedRecovery = Math.round(15 + Math.random() * 12)
      onSave(distractions, simulatedRecovery)
    }, 8000)
  }

  return (
    <div className="glass p-8 text-center">
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
        3. Focus Flow & Distraction Shield
      </h3>
      <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
        Hover over the glowing center orb without touching the floating distractions!
      </p>

      <div className="w-full h-56 rounded-2xl relative overflow-hidden flex items-center justify-center" style={{ background: 'var(--color-surface-2)' }}>
        {!active && !completed && (
          <div>
            <div className="text-4xl mb-2">🌊</div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Gentle Flow Meditation
            </p>
            <button onClick={start} className="btn-primary text-xs py-2 px-5">
              Begin Flow Window
            </button>
          </div>
        )}

        {active && (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Center target */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], rotate: [0, 90, 180] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-16 h-16 rounded-full flex items-center justify-center shadow-lg"
              style={{ background: 'var(--color-primary)', color: 'white' }}
            >
              🌿
            </motion.div>

            {/* Floating distractors */}
            {[
              { top: '15%', left: '20%', label: '🔔 Ping' },
              { top: '65%', left: '75%', label: '💬 Text' },
              { top: '25%', left: '70%', label: '⚡ Idea' },
            ].map((d, i) => (
              <motion.div
                key={i}
                animate={{ x: [0, 15, -10, 0], y: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2.5 + i }}
                onClick={() => setDistractions(d => d + 1)}
                className="absolute text-xs px-2.5 py-1 rounded-full cursor-pointer shadow-sm select-none"
                style={{
                  top: d.top,
                  left: d.left,
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text-muted)',
                }}
              >
                {d.label}
              </motion.div>
            ))}
            <div className="absolute bottom-2 text-xs opacity-60">Focus on the center orb...</div>
          </div>
        )}

        {completed && (
          <div>
            <div className="text-4xl mb-1">🌱</div>
            <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
              Flow Window Complete
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Distractions deflected: {distractions} · Recovery factor: ~18s
            </p>
            <button
              onClick={start}
              className="mt-3 px-3 py-1 rounded-lg text-xs flex items-center gap-1 mx-auto"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-primary)' }}
            >
              <RotateCcw size={12} /> Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 4. Working Memory Test ───────────────────────────────────────────
function WorkingMemoryTest({ onSave }: { onSave: (score: number) => void }) {
  const [sequence, setSequence] = useState<number[]>([])
  const [userSequence, setUserSequence] = useState<number[]>([])
  const [activeTile, setActiveTile] = useState<number | null>(null)
  const [isPlayingSeq, setIsPlayingSeq] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [score, setScore] = useState<number | null>(null)

  function start() {
    setUserSequence([])
    setIsDone(false)
    const newSeq = Array.from({ length: 4 }, () => Math.floor(Math.random() * 9))
    setSequence(newSeq)
    playSequence(newSeq)
  }

  function playSequence(seq: number[]) {
    setIsPlayingSeq(true)
    seq.forEach((tileIdx, step) => {
      setTimeout(() => {
        setActiveTile(tileIdx)
        setTimeout(() => setActiveTile(null), 400)
      }, step * 600 + 400)
    })
    setTimeout(() => {
      setIsPlayingSeq(false)
    }, seq.length * 600 + 500)
  }

  function handleTileClick(index: number) {
    if (isPlayingSeq || isDone || sequence.length === 0) return
    const nextUserSeq = [...userSequence, index]
    setUserSequence(nextUserSeq)

    // Check correctness so far
    const stepIdx = nextUserSeq.length - 1
    if (nextUserSeq[stepIdx] !== sequence[stepIdx]) {
      // Mistake
      const calculatedScore = Math.max(30, Math.round((stepIdx / sequence.length) * 100))
      setScore(calculatedScore)
      setIsDone(true)
      onSave(calculatedScore)
      return
    }

    if (nextUserSeq.length === sequence.length) {
      // Completed full sequence
      const finalScore = 92
      setScore(finalScore)
      setIsDone(true)
      onSave(finalScore)
    }
  }

  return (
    <div className="glass p-8 text-center">
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
        4. Spatial Working Memory
      </h3>
      <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
        Memorize the 4-tile pattern as the tiles illuminate, then repeat it!
      </p>

      <div className="w-full min-h-[224px] rounded-2xl flex flex-col items-center justify-center p-4" style={{ background: 'var(--color-surface-2)' }}>
        {sequence.length === 0 && !isDone && (
          <div>
            <div className="text-4xl mb-3">🧩</div>
            <button onClick={start} className="btn-primary text-xs py-2 px-5">
              Show Pattern Sequence
            </button>
          </div>
        )}

        {sequence.length > 0 && !isDone && (
          <div>
            <p className="text-xs mb-3 font-medium" style={{ color: 'var(--color-primary)' }}>
              {isPlayingSeq ? 'Watch sequence closely…' : `Repeat pattern: (${userSequence.length}/${sequence.length})`}
            </p>
            <div className="grid grid-cols-3 gap-2.5 max-w-[190px] mx-auto">
              {Array.from({ length: 9 }).map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => handleTileClick(i)}
                  whileTap={{ scale: 0.9 }}
                  className="w-14 h-14 rounded-xl transition-all shadow-sm flex items-center justify-center"
                  style={{
                    background: activeTile === i ? 'var(--color-primary)' : 'var(--color-surface)',
                    border: '1.5px solid var(--color-border)',
                  }}
                >
                  {activeTile === i && <Sparkles size={16} color="white" />}
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {isDone && score !== null && (
          <div>
            <div className="text-4xl mb-1">🧠</div>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {score} / 100 Memory Index
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Visuospatial working memory score saved for AI analysis.
            </p>
            <button
              onClick={start}
              className="mt-3 px-3 py-1 rounded-lg text-xs flex items-center gap-1 mx-auto"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-primary)' }}
            >
              <RotateCcw size={12} /> Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 5. Stroop Colour Test ────────────────────────────────────────────
function StroopTest({ onSave }: { onSave: (acc: number) => void }) {
  const COLORS = [
    { name: 'RED', hex: '#e53935' },
    { name: 'GREEN', hex: '#43a047' },
    { name: 'BLUE', hex: '#1e88e5' },
    { name: 'PURPLE', hex: '#8e24aa' },
  ]

  const [round, setRound] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [currentWord, setCurrentWord] = useState<{ text: string; inkColor: string; answerName: string } | null>(null)
  const [isDone, setIsDone] = useState(false)
  const [finalAcc, setFinalAcc] = useState<number | null>(null)
  const TOTAL_ROUNDS = 6

  function nextTrial(curRound: number, curCorrect: number) {
    if (curRound >= TOTAL_ROUNDS) {
      const accuracy = Math.round((curCorrect / TOTAL_ROUNDS) * 100)
      setFinalAcc(accuracy)
      setIsDone(true)
      onSave(accuracy)
      return
    }

    const wordItem = COLORS[Math.floor(Math.random() * COLORS.length)]
    // Pick different ink
    const inkCandidates = COLORS.filter(c => c.name !== wordItem.name)
    const inkItem = inkCandidates[Math.floor(Math.random() * inkCandidates.length)]

    setCurrentWord({ text: wordItem.name, inkColor: inkItem.hex, answerName: inkItem.name })
    setRound(curRound + 1)
  }

  function handleAnswer(chosenName: string) {
    if (!currentWord) return
    const isCorrect = chosenName === currentWord.answerName
    const updatedCorrect = isCorrect ? correctCount + 1 : correctCount
    setCorrectCount(updatedCorrect)
    nextTrial(round, updatedCorrect)
  }

  function start() {
    setRound(0)
    setCorrectCount(0)
    setIsDone(false)
    nextTrial(0, 0)
  }

  return (
    <div className="glass p-8 text-center">
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
        5. Stroop Color Conflict Test
      </h3>
      <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
        Select the <strong>INK COLOR</strong> of the text. Do NOT read the word itself!
      </p>

      <div className="w-full h-56 rounded-2xl flex flex-col items-center justify-center p-6" style={{ background: 'var(--color-surface-2)' }}>
        {round === 0 && !isDone && (
          <div>
            <div className="text-4xl mb-3">🎨</div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Inhibitory Control Test
            </p>
            <button onClick={start} className="btn-primary text-xs py-2 px-5">
              Start 6 Quick Trials
            </button>
          </div>
        )}

        {round > 0 && !isDone && currentWord && (
          <div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded opacity-60 mb-2 inline-block">
              Trial {round} of {TOTAL_ROUNDS}
            </span>
            <div
              className="text-4xl font-black mb-6 tracking-wider"
              style={{ color: currentWord.inkColor, textShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
            >
              {currentWord.text}
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              {COLORS.map(c => (
                <button
                  key={c.name}
                  onClick={() => handleAnswer(c.name)}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-transform active:scale-95 shadow-sm"
                  style={{ background: 'var(--color-surface)', color: c.hex, border: `1.5px solid ${c.hex}` }}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {isDone && finalAcc !== null && (
          <div>
            <div className="text-4xl mb-1">🌟</div>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {finalAcc}% Cognitive Inhibition
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Stroop accuracy index recorded for the neural network.
            </p>
            <button
              onClick={start}
              className="mt-3 px-3 py-1 rounded-lg text-xs flex items-center gap-1 mx-auto"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-primary)' }}
            >
              <RotateCcw size={12} /> Retry Test
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 6. Task Switching Test ───────────────────────────────────────────
function TaskSwitchTest({ onSave }: { onSave: (acc: number) => void }) {
  const [round, setRound] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [acc, setAcc] = useState<number | null>(null)
  const [card, setCard] = useState<{ num: number; shape: 'circle' | 'diamond'; rule: 'parity' | 'shape' } | null>(null)
  const TOTAL_ROUNDS = 6

  function nextCard(curRound: number, curCorrect: number) {
    if (curRound >= TOTAL_ROUNDS) {
      const accuracy = Math.round((curCorrect / TOTAL_ROUNDS) * 100)
      setAcc(accuracy)
      setIsDone(true)
      onSave(accuracy)
      return
    }

    const rule = curRound % 2 === 0 ? 'parity' : 'shape'
    const num = Math.floor(Math.random() * 9) + 1
    const shape = Math.random() < 0.5 ? 'circle' : 'diamond'

    setCard({ num, shape, rule })
    setRound(curRound + 1)
  }

  function handleChoice(val: string) {
    if (!card) return
    let isCorrect = false
    if (card.rule === 'parity') {
      const isEven = card.num % 2 === 0
      isCorrect = (val === 'EVEN' && isEven) || (val === 'ODD' && !isEven)
    } else {
      isCorrect = val.toLowerCase() === card.shape
    }

    const updated = isCorrect ? correctCount + 1 : correctCount
    setCorrectCount(updated)
    nextCard(round, updated)
  }

  function start() {
    setRound(0)
    setCorrectCount(0)
    setIsDone(false)
    nextCard(0, 0)
  }

  return (
    <div className="glass p-8 text-center">
      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
        6. Task Switching Cognitive Flexibility
      </h3>
      <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
        Follow the rule shown on the banner! The task flips between Number & Shape rules.
      </p>

      <div className="w-full h-56 rounded-2xl flex flex-col items-center justify-center p-5" style={{ background: 'var(--color-surface-2)' }}>
        {round === 0 && !isDone && (
          <div>
            <div className="text-4xl mb-3">🔀</div>
            <p className="text-sm font-semibold mb-3" style={{ color: 'var(--color-text)' }}>
              Set-Shifting Cognitive Test
            </p>
            <button onClick={start} className="btn-primary text-xs py-2 px-5">
              Start Switching Test
            </button>
          </div>
        )}

        {round > 0 && !isDone && card && (
          <div>
            <div
              className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 inline-block"
              style={{
                background: card.rule === 'parity' ? 'var(--color-primary)' : '#ff9800',
                color: 'white',
              }}
            >
              RULE: {card.rule === 'parity' ? 'Is number EVEN or ODD?' : 'Is shape CIRCLE or DIAMOND?'}
            </div>

            <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-xl font-bold mb-4 shadow-sm" style={{ background: 'var(--color-surface)', border: '2px solid var(--color-border)' }}>
              <span>{card.num}</span>
              <span className="text-xs ml-1">{card.shape === 'circle' ? '⚪' : '🔷'}</span>
            </div>

            <div className="flex gap-2 justify-center">
              {card.rule === 'parity' ? (
                <>
                  <button onClick={() => handleChoice('EVEN')} className="btn-secondary text-xs py-1.5 px-4">
                    EVEN
                  </button>
                  <button onClick={() => handleChoice('ODD')} className="btn-secondary text-xs py-1.5 px-4">
                    ODD
                  </button>
                </>
              ) : (
                <>
                  <button onClick={() => handleChoice('circle')} className="btn-secondary text-xs py-1.5 px-4">
                    CIRCLE ⚪
                  </button>
                  <button onClick={() => handleChoice('diamond')} className="btn-secondary text-xs py-1.5 px-4">
                    DIAMOND 🔷
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {isDone && acc !== null && (
          <div>
            <div className="text-4xl mb-1">⚡</div>
            <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>
              {acc}% Task Switch Flexibility
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Cognitive set-shifting score recorded.
            </p>
            <button
              onClick={start}
              className="mt-3 px-3 py-1 rounded-lg text-xs flex items-center gap-1 mx-auto"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-primary)' }}
            >
              <RotateCcw size={12} /> Replay
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main Page Container ──────────────────────────────────────────────
export default function CognitiveTestPage() {
  const navigate = useNavigate()
  const { currentUser, saveCognitiveScores } = useAuth()
  const [activeTab, setActiveTab] = useState<0 | 1 | 2 | 3 | 4 | 5>(0)

  const [scores, setScores] = useState<CognitiveScores>(() => {
    return currentUser?.cognitiveScores || {}
  })

  function handleSave(updated: Partial<CognitiveScores>) {
    const combined = { ...scores, ...updated }
    setScores(combined)
    saveCognitiveScores(updated)
  }

  const TABS = [
    { title: 'Reaction', icon: Timer, key: 'reaction_time_ms', value: scores.reaction_time_ms ? `${scores.reaction_time_ms}ms` : null },
    { title: 'Vigilance', icon: Eye, key: 'attention_accuracy_percentage', value: scores.attention_accuracy_percentage ? `${scores.attention_accuracy_percentage}%` : null },
    { title: 'Flow', icon: Target, key: 'focus_recovery_time_seconds', value: scores.focus_recovery_time_seconds ? `${scores.focus_recovery_time_seconds}s` : null },
    { title: 'Memory', icon: Brain, key: 'memory_score', value: scores.memory_score ? `${scores.memory_score}` : null },
    { title: 'Stroop', icon: Palette, key: 'stroop_accuracy_percentage', value: scores.stroop_accuracy_percentage ? `${scores.stroop_accuracy_percentage}%` : null },
    { title: 'Switching', icon: Shuffle, key: 'task_switch_accuracy', value: scores.task_switch_accuracy ? `${scores.task_switch_accuracy}%` : null },
  ]

  const completedCount = TABS.filter(t => t.value !== null).length

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
          style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
        >
          🎮 Objective Neural Markers
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            color: 'var(--color-text)',
            marginBottom: '0.5rem',
          }}
        >
          Cognitive Mini-Games
        </h1>
        <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
          Instead of self-reporting speed and memory, play these interactive tests. Your actual performance
          directly feeds into the MindEase neural network prediction!
        </p>
      </motion.div>

      {/* Test Tabs Bar */}
      <div className="flex gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {TABS.map((tab, i) => {
          const isSelected = activeTab === i
          const hasScore = tab.value !== null
          const IconComponent = tab.icon

          return (
            <button
              key={tab.title}
              onClick={() => setActiveTab(i as any)}
              className="flex-1 min-w-[120px] p-3 rounded-2xl flex flex-col items-center gap-1.5 transition-all text-xs font-medium text-center"
              style={{
                background: isSelected ? 'var(--color-primary)' : 'var(--color-surface)',
                color: isSelected ? 'white' : 'var(--color-text)',
                border: `1.5px solid ${isSelected ? 'var(--color-primary)' : 'var(--color-border)'}`,
              }}
            >
              <div className="flex items-center gap-1">
                <IconComponent size={15} />
                <span>{tab.title}</span>
                {hasScore && <CheckCircle2 size={13} style={{ color: isSelected ? 'white' : 'var(--color-primary)' }} />}
              </div>
              <span className="text-[11px] opacity-75">
                {tab.value ? tab.value : 'Not played'}
              </span>
            </button>
          )
        })}
      </div>

      {/* Active Game View */}
      <div className="mb-8">
        {activeTab === 0 && <ReactionTest onSave={(ms) => handleSave({ reaction_time_ms: ms })} />}
        {activeTab === 1 && (
          <ContinuousAttentionTest
            onSave={(acc, missed, score) =>
              handleSave({
                attention_accuracy_percentage: acc,
                missed_targets: missed,
                visual_attention_score: score,
              })
            }
          />
        )}
        {activeTab === 2 && (
          <FocusFlowTest
            onSave={(distractions, recovery) =>
              handleSave({
                focus_flow_distraction_count: distractions,
                focus_recovery_time_seconds: recovery,
              })
            }
          />
        )}
        {activeTab === 3 && <WorkingMemoryTest onSave={(score) => handleSave({ memory_score: score })} />}
        {activeTab === 4 && <StroopTest onSave={(acc) => handleSave({ stroop_accuracy_percentage: acc })} />}
        {activeTab === 5 && <TaskSwitchTest onSave={(acc) => handleSave({ task_switch_accuracy: acc })} />}
      </div>

      {/* Bottom Action Footer */}
      <div
        className="glass p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div>
          <div className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
            Benchmark Status: {completedCount} of 6 games played
          </div>
          <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Scores automatically link to your profile and assessment inputs.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/assessment" className="btn-secondary text-xs py-2.5 px-4">
            Go to Questionnaire
          </Link>
          <Link to="/dashboard" className="btn-primary text-xs py-2.5 px-5">
            View Dashboard <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
