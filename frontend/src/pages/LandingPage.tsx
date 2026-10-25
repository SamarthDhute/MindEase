import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Brain,
  Leaf,
  TrendingUp,
  Shield,
  Sparkles,
  ChevronDown,
  Clock,
  Eye,
  Activity,
  Layers,
  Repeat,
  Zap,
  CheckCircle2,
  Calendar,
  AlertCircle,
  HelpCircle,
  BarChart2,
  Smile,
  Compass,
} from 'lucide-react'
import { THEMES } from '../types'
import { useTheme } from '../contexts/ThemeContext'

const QUOTES = [
  { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
  { text: 'You don\'t have to control your thoughts. You just have to stop letting them control you.', author: 'Dan Millman' },
  { text: 'Rest is not idleness, and to lie sometimes on the grass under trees on a summer\'s day is by no means a waste of time.', author: 'John Lubbock' },
]

const COGNITIVE_GAMES = [
  {
    icon: Zap,
    title: 'Reaction Time',
    metric: 'Psychomotor Latency (ms)',
    desc: 'Measures central nervous system processing speed and instant reflex responsiveness when a visual stimulus occurs.',
  },
  {
    icon: Eye,
    title: 'Continuous Attention',
    metric: 'Vigilance & Miss Rate (%)',
    desc: 'Evaluates sustained attention and visual vigilance over time by identifying rapid targets amidst distractors.',
  },
  {
    icon: Activity,
    title: 'Focus Flow',
    metric: 'Distraction Recovery (sec)',
    desc: 'Tracks inhibitory control and the time required to re-orient focus after sudden peripheral interruptions.',
  },
  {
    icon: Layers,
    title: 'Working Memory',
    metric: 'Spatial Span Score',
    desc: 'Assesses short-term visual-spatial holding capacity through sequential pattern recall tasks.',
  },
  {
    icon: Sparkles,
    title: 'Stroop Colour Test',
    metric: 'Interference Control (%)',
    desc: 'Measures executive inhibitory control and resistance to semantic interference when colour names conflict with hues.',
  },
  {
    icon: Repeat,
    title: 'Task Switching',
    metric: 'Cognitive Flexibility (%)',
    desc: 'Quantifies mental agility and transition cost when dynamically alternating between different rule sets.',
  },
]

const DOMAINS = [
  { title: 'Sleep & Vitality', desc: 'Rest duration, waking refreshed, and biological recovery.' },
  { title: 'Digital & Media Habits', desc: 'Screen time, short-form video consumption, and notification frequency.' },
  { title: 'Workspace Environment', desc: 'Acoustic background noise, physical clutter, and lighting quality.' },
  { title: 'Attentional Stability', desc: 'Procrastination tendencies, reading retention, and detail retention.' },
  { title: 'Thought Patterns', desc: 'Internal loop chains, cognitive intrusion control, and mental direction (past/future).' },
  { title: 'Emotional Balance', desc: 'Daily tension levels, mental overload, and mindfulness capacity.' },
]

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] as const } },
}

export default function LandingPage() {
  const { theme, setTheme } = useTheme()
  const quote = QUOTES[Math.floor(Date.now() / 86400000) % QUOTES.length]

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* ── 1. Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex flex-col items-center justify-center text-center px-4 pt-12 pb-16"
        style={{ background: 'var(--gradient-hero)' }}
      >
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: 'url(/illustrations/hero.jpg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.18,
          }}
        />
        <div className="absolute inset-0 z-0" style={{ background: 'var(--gradient-hero)', opacity: 0.8 }} />

        <motion.div
          className="relative z-10 max-w-4xl mx-auto w-full"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={itemVariants} className="mb-5">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold shadow-sm"
              style={{
                background: 'var(--color-accent-2)',
                color: 'var(--color-primary)',
                border: '1px solid var(--color-border)',
              }}
            >
              <Sparkles size={14} /> AI Cognitive Science & Digital Wellness Research
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 6.5vw, 4.8rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              color: 'var(--color-text)',
              marginBottom: '1.25rem',
            }}
          >
            Understand Your
            <br />
            <span style={{ color: 'var(--color-primary)' }}>Attention</span>, Gently.
          </motion.h1>

          <motion.p
            variants={itemVariants}
            style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.25rem)',
              color: 'var(--color-text-muted)',
              maxWidth: '640px',
              margin: '0 auto 2.25rem',
              lineHeight: 1.7,
            }}
          >
            MindEase is an AI research application that maps how your workspace, daily digital habits,
            and internal thought patterns shape your attention. Explore your focus through gentle
            assessment and interactive cognitive mini-games.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-10 w-full">
            <Link to="/register" className="btn-primary w-full sm:w-auto justify-center" id="hero-start-btn">
              Begin Free Assessment <ArrowRight size={17} />
            </Link>
            <Link to="/cognitive" className="btn-secondary w-full sm:w-auto justify-center" id="hero-cognitive-btn">
              Play Cognitive Tests <Brain size={17} />
            </Link>
          </motion.div>

          <motion.div variants={itemVariants} className="pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
            <p className="text-xs mb-3" style={{ color: 'var(--color-text-muted)' }}>
              Non-clinical digital wellness research tool · 100% Client-side privacy
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-xl mx-auto">
              {[
                { stat: '34+', label: 'Multimodal Signals' },
                { stat: '6', label: 'Cognitive Mini-Games' },
                { stat: '100%', label: 'Private & Local' },
                { stat: '0', label: 'Confusing ML Jargon' },
              ].map((item, i) => (
                <div key={i} className="text-center p-2 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                  <div
                    style={{
                      fontSize: 'clamp(1.3rem, 2.5vw, 1.8rem)',
                      fontWeight: 700,
                      color: 'var(--color-primary)',
                      fontFamily: 'var(--font-serif)',
                    }}
                  >
                    {item.stat}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown size={22} style={{ color: 'var(--color-text-muted)' }} />
        </motion.div>
      </section>

      {/* ── 2. Quote Banner ──────────────────────────────────────────── */}
      <section className="py-12 px-4" style={{ background: 'var(--color-primary)', color: 'white' }}>
        <div className="w-full max-w-3xl mx-auto text-center">
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.45rem)',
              fontStyle: 'italic',
              lineHeight: 1.6,
              marginBottom: '0.75rem',
            }}
          >
            "{quote.text}"
          </p>
          <p style={{ fontSize: '0.88rem', opacity: 0.85 }}>— {quote.author}</p>
        </div>
      </section>

      {/* ── 3. What is MindEase & Why It Was Developed ───────────────── */}
      <section className="py-20 px-4" style={{ background: 'var(--color-bg)' }}>
        <div className="w-full max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-primary)' }}
            >
              The Research Context
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: 'var(--color-text)',
                marginBottom: '1rem',
              }}
            >
              What is MindEase & Why Was It Created?
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto', lineHeight: 1.7 }}>
              In modern computing environments, sustained human focus is fractured by rapid notification spikes,
              endless short-form video loops, and multi-tab context switching.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              className="glass p-7 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
              >
                <AlertCircle size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.6rem' }}>
                The Attention Crisis
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.65 }}>
                Research shows knowledge workers switch activities every few minutes, incurring significant cognitive re-orientation
                penalties. Our brains are inundated with sensory stimuli, leading to mental fatigue and diminished working memory.
              </p>
            </motion.div>

            <motion.div
              className="glass p-7 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
              >
                <Brain size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.6rem' }}>
                Neural Modeling
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.65 }}>
                MindEase utilizes an artificial neural network trained on multi-attribute behavioural data to model how
                lifestyle, environmental noise, and cognitive interference interlock to dictate attention resilience.
              </p>
            </motion.div>

            <motion.div
              className="glass p-7 rounded-2xl"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
              >
                <Leaf size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.6rem' }}>
                Compassionate Wellness
              </h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.65 }}>
                Rather than punishing productivity tracking or clinical diagnoses, MindEase provides gentle,
                nature-themed bio-rhythm feedback that empowers you to create calmer, distraction-resistant routines.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 4. How the Assessment Works ──────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: 'var(--color-surface-2)' }}>
        <div className="w-full max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: 'var(--color-surface)', color: 'var(--color-primary)' }}
            >
              Comprehensive Baseline
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: 'var(--color-text)',
                marginBottom: '1rem',
              }}
            >
              How the MindEase Assessment Works
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
              Unlike generic quizzes, MindEase conducts a one-time onboarding baseline across 6 core lifestyle domains,
              with specialized inquiry into cognitive thought dynamics.
            </p>
          </motion.div>

          {/* Thought Patterns Highlight Card */}
          <motion.div
            className="glass p-8 rounded-3xl mb-12 border"
            style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div
                className="w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center text-3xl"
                style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
              >
                🧠
              </div>
              <div className="flex-1">
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-md mb-2 inline-block"
                  style={{ background: 'var(--color-primary)', color: 'white' }}
                >
                  Key MindEase Contribution
                </span>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                  Deep Thought Pattern Analysis
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.94rem', lineHeight: 1.65 }}>
                  Our research highlights that external distractions (notifications, clutter) only account for part of focus loss.
                  Internal cognitive intrusions — such as replay of past conversations, future planning anxiety, and runaway thought chains —
                  play a major role in attention drift. MindEase explicitly quantifies these internal patterns for the neural network.
                </p>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {DOMAINS.map((dom, i) => (
              <motion.div
                key={i}
                className="glass p-6 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 size={16} style={{ color: 'var(--color-primary)' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-text)' }}>{dom.title}</h4>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{dom.desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-xs sm:text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
              Completed only once during onboarding. You never have to repeat the full survey unless you choose to retake it.
            </p>
            <Link to="/assessment" className="btn-primary" id="landing-assessment-btn">
              Take Baseline Assessment <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 5. Interactive Cognitive Mini-Games ──────────────────────── */}
      <section className="py-20 px-4" style={{ background: 'var(--color-bg)' }}>
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span
              className="text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3 inline-block"
              style={{ background: 'var(--color-surface-2)', color: 'var(--color-primary)' }}
            >
              Interactive Mini-Games
            </span>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: 'var(--color-text)',
                marginBottom: '1rem',
              }}
            >
              Objective Cognitive Measurement
            </h2>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '1.05rem', maxWidth: '640px', margin: '0 auto', lineHeight: 1.7 }}>
              Instead of guessing your reaction speed or focus accuracy, play 6 interactive neuroscience mini-games.
              Scores automatically feed into the AI model alongside your questionnaire.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COGNITIVE_GAMES.map((game, i) => (
              <motion.div
                key={i}
                className="glass card-hover p-6 rounded-2xl flex flex-col justify-between"
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09 }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
                    >
                      <game.icon size={20} />
                    </div>
                    <span
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-muted)' }}
                    >
                      {game.metric}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                    {game.title}
                  </h3>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.6 }}>{game.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/cognitive" className="btn-primary" id="landing-cognitive-games-btn">
              Explore All 6 Cognitive Tests <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── 6. Personalized AI Report ───────────────────────────────── */}
      <section className="py-20 px-4" style={{ background: 'var(--color-surface-2)' }}>
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span
                className="text-xs uppercase tracking-wider font-semibold px-3 py-1 rounded-full mb-3 inline-block"
                style={{ background: 'var(--color-surface)', color: 'var(--color-primary)' }}
              >
                Zero Machine Learning Jargon
              </span>
              <h2
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)',
                  color: 'var(--color-text)',
                  marginBottom: '1rem',
                  lineHeight: 1.25,
                }}
              >
                A Personal Attention Report You Can Truly Understand
              </h2>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                We translate complex neural network embeddings into clear, actionable human pillars. No confusing
                permutation importance or weight matrices — just practical clarity.
              </p>

              <div className="space-y-4">
                {[
                  {
                    title: 'Holistic Attention Score (0–100)',
                    desc: 'A unified metric balancing deep focus stability, sensory filtering, and recovery agility.',
                  },
                  {
                    title: 'Identified Cognitive Influences',
                    desc: 'Highlights the specific habits (e.g. phone placement, sleep debt, thought loops) impacting your day.',
                  },
                  {
                    title: 'Tailored Micro-Interventions',
                    desc: 'Actionable wellness habits like 20-20-20 visual rest, friction-based phone distancing, and mind dumps.',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'var(--color-primary)', color: 'white' }}
                    >
                      ✓
                    </div>
                    <div>
                      <div className="font-semibold text-sm" style={{ color: 'var(--color-text)' }}>
                        {item.title}
                      </div>
                      <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual Preview Card */}
            <motion.div
              className="glass p-7 rounded-3xl"
              style={{ background: 'var(--color-surface)' }}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-between pb-4 border-b mb-6" style={{ borderColor: 'var(--color-border)' }}>
                <div>
                  <div className="text-xs text-muted">SAMPLE REPORT</div>
                  <div className="font-bold text-base" style={{ color: 'var(--color-text)' }}>Attention Resilience Index</div>
                </div>
                <div
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
                >
                  Optimal Focus Flow
                </div>
              </div>

              <div className="text-center my-6">
                <div style={{ fontSize: '3.5rem', fontWeight: 800, color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
                  78<span className="text-xl font-normal text-muted">/100</span>
                </div>
                <div className="text-xs text-muted mt-1">High Resilience · Calm Cognitive Load</div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Deep Focus Stability', val: '82%' },
                  { label: 'Sensory Filtering', val: '74%' },
                  { label: 'Thought Loop Resilience', val: '79%' },
                  { label: 'Sleep & Energy Recovery', val: '70%' },
                ].map((bar, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1 font-medium">
                      <span style={{ color: 'var(--color-text)' }}>{bar.label}</span>
                      <span style={{ color: 'var(--color-primary)' }}>{bar.val}</span>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-2)' }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: bar.val, background: 'var(--color-primary)' }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 7. Daily Check-Ins & Real Progress ──────────────────────── */}
      <section className="py-20 px-4" style={{ background: 'var(--color-bg)' }}>
        <div className="w-full max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Daily Check-In Feature */}
            <motion.div
              className="glass p-8 rounded-3xl flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
                >
                  <Clock size={24} />
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-md mb-2 inline-block"
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-primary)' }}
                >
                  60-Second Daily Rhythm
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                  1–2 Minute Daily Check-Ins
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  After completing your one-time baseline, you never have to repeat the full questionnaire. Instead, log
                  only what fluctuates day-to-day:
                </p>

                <ul className="space-y-2 text-xs sm:text-sm" style={{ color: 'var(--color-text)' }}>
                  <li className="flex items-center gap-2">🌱 Mood & Energy levels</li>
                  <li className="flex items-center gap-2">🎯 Focus quality rating</li>
                  <li className="flex items-center gap-2">🛌 Sleep quality & refreshed feeling</li>
                  <li className="flex items-center gap-2">📱 Screen time & notification disruptions</li>
                  <li className="flex items-center gap-2">💭 Biggest distraction trigger & personal reflection note</li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <Link to="/checkin" className="btn-secondary w-full text-center" id="landing-checkin-btn">
                  Try a Daily Check-In
                </Link>
              </div>
            </motion.div>

            {/* Real Progress Feature */}
            <motion.div
              className="glass p-8 rounded-3xl flex flex-col justify-between"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
                >
                  <TrendingUp size={24} />
                </div>
                <span
                  className="text-xs font-semibold px-2.5 py-1 rounded-md mb-2 inline-block"
                  style={{ background: 'var(--color-surface-2)', color: 'var(--color-primary)' }}
                >
                  Genuine Analytics
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.75rem' }}>
                  Real Progress, Never Hardcoded
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.92rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
                  We believe in authentic personal data. New users start with a clean empty state. As you log check-ins,
                  your charts dynamically display your real trends:
                </p>

                <ul className="space-y-2 text-xs sm:text-sm" style={{ color: 'var(--color-text)' }}>
                  <li className="flex items-center gap-2">📊 Weekly focus & sleep correlation charts</li>
                  <li className="flex items-center gap-2">🔥 Real mindfulness streak counters</li>
                  <li className="flex items-center gap-2">🏷️ Frequency maps of your common distraction triggers</li>
                  <li className="flex items-center gap-2">🏆 Milestone achievements unlocked as you build habits</li>
                </ul>
              </div>

              <div className="mt-8 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <Link to="/progress" className="btn-secondary w-full text-center" id="landing-progress-btn">
                  View Progress Dashboard
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 8. Six Immersive Nature Themes ──────────────────────────── */}
      <section className="py-20 px-4" style={{ background: 'var(--color-surface-2)' }}>
        <div className="w-full max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                color: 'var(--color-text)',
                marginBottom: '1rem',
              }}
            >
              Six Immersive Nature Themes
            </h2>
            <p style={{ color: 'var(--color-text-muted)' }}>
              Choose the ambience that soothes your nervous system most
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {THEMES.map((t, i) => {
              const images: Record<string, string> = {
                forest: '/illustrations/forest.jpg',
                ocean: '/illustrations/ocean.jpg',
                sakura: '/illustrations/sakura.jpg',
                starry: '/illustrations/starry.jpg',
                rainy: '/illustrations/hero.jpg',
                mountain: '/illustrations/dashboard.jpg',
              }
              return (
                <motion.button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className="relative rounded-2xl overflow-hidden text-left"
                  style={{
                    height: '140px',
                    border: theme === t.id ? '2.5px solid var(--color-primary)' : '2px solid var(--color-border)',
                    cursor: 'pointer',
                    background: 'none',
                    touchAction: 'manipulation',
                  }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  id={`theme-btn-${t.id}`}
                >
                  <img src={images[t.id]} alt={t.label} className="absolute inset-0 w-full h-full object-cover" />
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }}
                  />
                  {theme === t.id && (
                    <div
                      className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: 'var(--color-primary)' }}
                    >
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <div className="text-xl mb-0.5">{t.emoji}</div>
                    <div className="font-semibold text-white text-sm">{t.label}</div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── 9. Research & Medical Disclaimer ───────────────────────── */}
      <section className="py-14 px-4" style={{ background: 'var(--color-bg)' }}>
        <div className="w-full max-w-4xl mx-auto">
          <div
            className="p-7 rounded-3xl flex flex-col sm:flex-row gap-5 items-start"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
            }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex-shrink-0 flex items-center justify-center"
              style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
            >
              <Shield size={24} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-text)', marginBottom: '0.5rem' }}>
                Research & Wellness Disclaimer
              </h4>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.88rem', lineHeight: 1.65 }}>
                MindEase is an experimental digital wellness application designed for self-reflection and computational
                modelling of human attention interference. <strong>It is not a medical device, psychiatric assessment, or
                diagnostic tool for ADHD, anxiety, depression, or other clinical disorders.</strong> The insights provided
                are informational suggestions aimed at fostering mindful technology habits. If you are experiencing distress,
                chronic cognitive exhaustion, or mental health challenges, please consult a licensed healthcare professional.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 px-4 text-center" style={{ background: 'var(--gradient-hero)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="w-full max-w-xl mx-auto"
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              color: 'var(--color-text)',
              marginBottom: '1rem',
            }}
          >
            Ready to understand your focus?
          </h2>
          <p style={{ color: 'var(--color-text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
            Takes about 4 minutes to complete your baseline assessment and cognitive tests.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center w-full">
            <Link to="/register" className="btn-primary w-full sm:w-auto justify-center" id="cta-start-btn">
              Begin Baseline Assessment <ArrowRight size={17} />
            </Link>
            <Link to="/dashboard" className="btn-secondary w-full sm:w-auto justify-center" id="cta-dash-btn">
              Go to Dashboard
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
