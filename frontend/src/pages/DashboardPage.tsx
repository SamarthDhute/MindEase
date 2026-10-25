import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import {
  ArrowRight,
  Flame,
  Award,
  Target,
  Brain,
  Sparkles,
  ClipboardList,
  Calendar,
  Gamepad2,
  CheckCircle2,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const QUOTES = [
  { text: 'Your mind is a garden. Your thoughts are the seeds. You can grow flowers, or you can grow weeds.', author: 'Rumi' },
  { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
  { text: 'Wherever you are, be all there.', author: 'Jim Elliot' },
  { text: 'In the middle of every difficulty lies opportunity.', author: 'Albert Einstein' },
  { text: 'Rest is not idleness. Relaxation is not laziness.', author: 'John Lubbock' },
  { text: 'The present moment is the only time over which we have dominion.', author: 'Thich Nhat Hanh' },
  { text: "You don't have to control your thoughts. You just have to stop letting them control you.", author: 'Dan Millman' },
]

function getTodayQuote() {
  return QUOTES[new Date().getDay() % QUOTES.length]
}

const FOCUS_PROFILE_LABELS: Record<string, { desc: string; advice: string }> = {
  Minimal: {
    desc: 'High Focus Flow',
    advice: 'Your habits support sustained attention. Continue honoring your rest routines and single-task blocks.',
  },
  Low: {
    desc: 'High Focus Flow',
    advice: 'Your habits support sustained attention. Continue honoring your rest routines and single-task blocks.',
  },
  Moderate: {
    desc: 'Balanced Attention Flow',
    advice: 'You have solid foundations. Small improvements in notification management and sleep timing will unlock more deep work.',
  },
  High: {
    desc: 'Attentional Friction Detected',
    advice: 'Several daily patterns and thought wanderings compete for focus. Start small with a 20-minute quiet focus interval today.',
  },
}

export default function DashboardPage() {
  const { currentUser } = useAuth()
  const report = currentUser?.latestReport
  const quote = getTodayQuote()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const userCheckIns = currentUser?.dailyCheckIns || []
  const hasCheckIns = userCheckIns.length > 0

  // Chart data from real check-ins or fallback sample for layout
  const chartData = hasCheckIns
    ? userCheckIns.slice(-7).map(c => {
        const d = new Date(c.date || c.timestamp)
        return {
          day: isNaN(d.getTime()) ? c.date : d.toLocaleDateString('en-US', { weekday: 'short' }),
          mood: (c.mood || 3) * 20,
          energy: (c.energy || 5) * 10,
          focus: (c.focus || 5) * 10,
        }
      })
    : [
        { day: 'Mon', mood: 70, energy: 65, focus: 60 },
        { day: 'Tue', mood: 75, energy: 70, focus: 72 },
        { day: 'Wed', mood: 65, energy: 60, focus: 65 },
        { day: 'Thu', mood: 80, energy: 75, focus: 80 },
        { day: 'Fri', mood: 75, energy: 70, focus: 75 },
      ]

  const level = report?.attention_interference_level || 'Moderate'
  const profile = FOCUS_PROFILE_LABELS[level] || FOCUS_PROFILE_LABELS.Moderate
  const levelColors: Record<string, string> = { Minimal: '#4caf50', Low: '#4caf50', Moderate: '#ff9800', High: '#f44336' }

  const achievements = [
    {
      icon: '🌱',
      title: 'First Reflection',
      desc: 'Completed your first daily check-in',
      earned: userCheckIns.length > 0,
    },
    {
      icon: '🧠',
      title: 'Neural Baseline',
      desc: 'Completed the MindEase AI assessment',
      earned: !!currentUser?.assessmentCompleted,
    },
    {
      icon: '🔥',
      title: '3-Day Streak',
      desc: 'Checked in 3 days in a row',
      earned: (currentUser?.streak || 0) >= 3,
    },
    {
      icon: '🎮',
      title: 'Cognitive Tester',
      desc: 'Tested response speed & memory games',
      earned: !!(currentUser?.cognitiveScores && Object.keys(currentUser.cognitiveScores).length > 0),
    },
    {
      icon: '⭐',
      title: 'Focus Regular',
      desc: 'Logged 5 or more total reflections',
      earned: userCheckIns.length >= 5,
    },
  ]

  const cardAnim = (i: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45 } },
  })

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8">
      {/* Hero Welcome Banner */}
      <motion.div
        className="relative rounded-3xl overflow-hidden mb-8 shadow-md"
        style={{ minHeight: '190px' }}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <img
          src="/illustrations/dashboard.jpg"
          alt="Nature banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.25) 100%)' }}
        />
        <div className="relative p-7 md:p-9 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold mb-1" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {greeting} 🌿
            </p>
            <h1
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(1.6rem, 4vw, 2.3rem)',
                color: 'white',
                fontWeight: 600,
                marginBottom: '0.4rem',
              }}
            >
              Welcome back, {currentUser?.name || 'Explorer'}
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', maxWidth: '480px' }}>
              Your attention is a gentle garden. Nurture it with intentional rest and calm focus.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <Link
              to="/checkin"
              className="btn-primary text-xs py-2.5 px-4 shadow-md flex items-center gap-1.5"
              id="dashboard-checkin-btn"
              style={{ background: 'white', color: 'var(--color-primary)' }}
            >
              <Calendar size={14} /> 1-Min Daily Check-in
            </Link>
            {!currentUser?.assessmentCompleted ? (
              <Link
                to="/assessment"
                className="btn-secondary text-xs py-2.5 px-4"
                id="dashboard-assess-btn"
                style={{ background: 'transparent', color: 'white', borderColor: 'white' }}
              >
                Take Baseline Assessment →
              </Link>
            ) : (
              <Link
                to="/cognitive"
                className="btn-secondary text-xs py-2.5 px-4 flex items-center gap-1.5"
                style={{ background: 'transparent', color: 'white', borderColor: 'white' }}
              >
                <Gamepad2 size={14} /> Cognitive Mini-Games
              </Link>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          {
            icon: Flame,
            label: 'Check-In Streak',
            value: `${currentUser?.streak || 0} Days`,
            color: '#ff9800',
            hint: 'Consecutive reflections',
          },
          {
            icon: Target,
            label: 'Attention Profile',
            value: currentUser?.assessmentCompleted ? level : 'Pending',
            color: levelColors[level as keyof typeof levelColors] || 'var(--color-primary)',
            hint: 'AI Model Classification',
          },
          {
            icon: Calendar,
            label: 'Total Check-Ins',
            value: `${userCheckIns.length}`,
            color: 'var(--color-primary)',
            hint: 'Recorded reflections',
          },
          {
            icon: Brain,
            label: 'Cognitive Marker',
            value: currentUser?.cognitiveScores?.reaction_time_ms
              ? `${currentUser.cognitiveScores.reaction_time_ms} ms`
              : 'Untested',
            color: '#9c27b0',
            hint: 'Reaction speed index',
          },
        ].map((s, i) => (
          <motion.div key={i} className="glass p-5 text-center shadow-sm" {...cardAnim(i)}>
            <div className="flex items-center justify-center mb-2">
              <s.icon size={20} style={{ color: s.color }} />
            </div>
            <div
              className="text-xl md:text-2xl font-bold"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}
            >
              {s.value}
            </div>
            <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--color-primary)' }}>
              {s.label}
            </div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
              {s.hint}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: AI Profile Card & Weekly Chart */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Profile Card */}
        <motion.div className="glass p-6 md:col-span-1 shadow-sm flex flex-col justify-between" {...cardAnim(1)}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-text-muted)' }}>
                Baseline Status
              </span>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: `${levelColors[level as keyof typeof levelColors]}18`,
                  color: levelColors[level as keyof typeof levelColors],
                }}
              >
                {level}
              </span>
            </div>

            <div className="text-center my-4">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 text-2xl shadow-inner"
                style={{ background: 'var(--color-accent-2)' }}
              >
                {level === 'Minimal' ? '🌿' : level === 'Moderate' ? '🌤' : '🌧'}
              </div>
              <h3 className="font-bold text-base" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
                {profile.desc}
              </h3>
              <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)', lineHeight: 1.55 }}>
                {profile.advice}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t mt-4" style={{ borderColor: 'var(--color-border)' }}>
            {currentUser?.assessmentCompleted ? (
              <Link to="/report" className="btn-secondary w-full justify-center text-xs py-2">
                View Full AI Report <ArrowRight size={14} />
              </Link>
            ) : (
              <Link to="/assessment" className="btn-primary w-full justify-center text-xs py-2">
                Start Full Assessment →
              </Link>
            )}
          </div>
        </motion.div>

        {/* Weekly Wellbeing Chart */}
        <motion.div className="glass p-6 md:col-span-2 shadow-sm" {...cardAnim(2)}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold flex items-center gap-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
                <Sparkles size={16} style={{ color: 'var(--color-primary)' }} />
                Weekly Attention & Mood Flow
              </h3>
              <p className="text-[11px]" style={{ color: 'var(--color-text-muted)' }}>
                {hasCheckIns ? 'Synthesized from your recent check-ins' : 'Sample preview (log check-ins to view real trend)'}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: 'var(--color-primary)' }} /> Focus
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full" style={{ background: '#ff9800' }} /> Energy
              </span>
            </div>
          </div>

          <div style={{ height: '190px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="dashFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '11px',
                  }}
                />
                <Area type="monotone" dataKey="focus" stroke="var(--color-primary)" strokeWidth={2} fill="url(#dashFocus)" />
                <Area type="monotone" dataKey="energy" stroke="#ff9800" strokeWidth={1.5} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Suggested Focus Practices */}
      <motion.div className="glass p-6 mb-8 shadow-sm" {...cardAnim(3)}>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
          <Target size={16} style={{ color: 'var(--color-primary)' }} />
          Today's Calming Focus Anchors
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              title: 'Gentle Single-Tasking',
              desc: 'Keep only one workspace app open during your next 25-minute study block.',
            },
            {
              title: 'Thought Scratchpad',
              desc: 'When an unexpected idea appears, write it down in 3 words and return to your task.',
            },
            {
              title: 'Post-Task Breathe',
              desc: 'Take 3 deliberate breaths before jumping into your next digital message.',
            },
          ].map((item, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl text-xs"
              style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
            >
              <div className="font-semibold mb-1" style={{ color: 'var(--color-primary)' }}>
                {item.title}
              </div>
              <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievements Section */}
      <motion.div className="glass p-6 shadow-sm" {...cardAnim(4)}>
        <h3 className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}>
          <Award size={16} style={{ color: 'var(--color-primary)' }} />
          Wellness Milestones
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {achievements.map((a, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl text-center transition-all"
              style={{
                background: a.earned ? 'var(--color-surface)' : 'var(--color-surface-2)',
                border: `1.5px solid ${a.earned ? 'var(--color-primary)' : 'var(--color-border)'}`,
                opacity: a.earned ? 1 : 0.6,
              }}
            >
              <div className="text-2xl mb-1">{a.icon}</div>
              <div className="font-bold text-xs" style={{ color: a.earned ? 'var(--color-text)' : 'var(--color-text-muted)' }}>
                {a.title}
              </div>
              <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
                {a.desc}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Motivational Quote */}
      <div className="mt-8 text-center text-xs italic opacity-75" style={{ color: 'var(--color-text-muted)' }}>
        "{quote.text}" — {quote.author}
      </div>
    </div>
  )
}
