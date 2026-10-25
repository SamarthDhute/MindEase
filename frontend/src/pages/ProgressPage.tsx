import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
} from 'recharts'
import {
  TrendingUp,
  Calendar,
  Sparkles,
  ArrowRight,
  Smile,
  Zap,
  Target,
  FileText,
  Clock,
  ShieldCheck,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import type { CheckInEntry } from '../types'

type Period = '7d' | '30d' | 'all'

export default function ProgressPage() {
  const { currentUser } = useAuth()
  const [period, setPeriod] = useState<Period>('7d')

  const rawCheckIns = currentUser?.dailyCheckIns || []

  // If no check-ins exist for the current user, show empty state
  if (rawCheckIns.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass p-10 md:p-14 shadow-lg max-w-xl mx-auto"
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl shadow-inner" style={{ background: 'var(--color-accent-2)' }}>
            🌱
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)',
              color: 'var(--color-text)',
              marginBottom: '0.75rem',
            }}
          >
            Your Focus Garden is Waiting
          </h2>
          <p className="text-sm max-w-md mx-auto mb-8" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
            MindEase tracks genuine progress from your real daily check-ins and baseline assessment.
            You haven't logged any reflections yet. Take 60 seconds to record your first check-in!
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/checkin" className="btn-primary text-xs py-2.5 px-6" id="empty-start-checkin">
              <Calendar size={15} /> Log First Check-In
            </Link>
            {!currentUser?.assessmentCompleted && (
              <Link to="/assessment" className="btn-secondary text-xs py-2.5 px-5" id="empty-start-assessment">
                Take AI Assessment <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    )
  }

  // Filter check-ins based on selected period
  const sortedCheckIns = [...rawCheckIns].sort((a, b) => a.timestamp - b.timestamp)
  const filtered = (() => {
    if (period === '7d') return sortedCheckIns.slice(-7)
    if (period === '30d') return sortedCheckIns.slice(-30)
    return sortedCheckIns
  })()

  // Format data points for charts
  const chartData = filtered.map(c => {
    const d = new Date(c.date || c.timestamp)
    return {
      date: isNaN(d.getTime()) ? c.date : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      moodScore: (c.mood || 3) * 20, // scale 1-5 to 20-100%
      energyScore: (c.energy || 5) * 10, // scale 1-10 to 10-100%
      focusScore: (c.focus || 5) * 10, // scale 1-10 to 10-100%
      rawMood: c.mood,
      rawEnergy: c.energy,
      rawFocus: c.focus,
      distraction: c.biggestDistraction || 'None',
      note: c.note,
    }
  })

  // Compute real averages
  const avgMood = (filtered.reduce((s, c) => s + (c.mood || 3), 0) / filtered.length).toFixed(1)
  const avgEnergy = (filtered.reduce((s, c) => s + (c.energy || 5), 0) / filtered.length).toFixed(1)
  const avgFocus = (filtered.reduce((s, c) => s + (c.focus || 5), 0) / filtered.length).toFixed(1)

  // Distraction frequency count
  const distractionCounts: Record<string, number> = {}
  filtered.forEach(c => {
    const key = c.biggestDistraction || 'General'
    distractionCounts[key] = (distractionCounts[key] || 0) + 1
  })
  const distractionData = Object.entries(distractionCounts).map(([name, count]) => ({
    name,
    count,
  }))

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Page Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <span
          className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2"
          style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)' }}
        >
          📈 Real Long-Term Trends
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
            color: 'var(--color-text)',
            marginBottom: '0.4rem',
          }}
        >
          Progress & Habit Evolution
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Logged for <strong>{currentUser?.name || 'You'}</strong> ({rawCheckIns.length} recorded check-in{rawCheckIns.length === 1 ? '' : 's'}).
        </p>
      </motion.div>

      {/* Period Selector & Quick Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
          {[
            { id: '7d', label: 'Last 7 Days' },
            { id: '30d', label: 'Last 30 Days' },
            { id: 'all', label: `All Time (${rawCheckIns.length})` },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as Period)}
              className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
              style={{
                background: period === p.id ? 'var(--color-primary)' : 'transparent',
                color: period === p.id ? 'white' : 'var(--color-text-muted)',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        <Link to="/checkin" className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5 shadow-sm">
          <Calendar size={14} /> Log Today's Check-in
        </Link>
      </div>

      {/* Real Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="glass p-5 text-center shadow-sm">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xl" style={{ background: 'var(--color-accent-2)' }}>
            😊
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
            {avgMood} <span className="text-xs font-normal opacity-70">/ 5</span>
          </div>
          <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Average Mood
          </div>
        </div>

        <div className="glass p-5 text-center shadow-sm">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xl" style={{ background: 'rgba(255, 152, 0, 0.15)' }}>
            ⚡
          </div>
          <div className="text-2xl font-bold" style={{ color: '#ff9800', fontFamily: 'var(--font-serif)' }}>
            {avgEnergy} <span className="text-xs font-normal opacity-70">/ 10</span>
          </div>
          <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Average Energy Level
          </div>
        </div>

        <div className="glass p-5 text-center shadow-sm">
          <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 text-xl" style={{ background: 'rgba(156, 39, 176, 0.15)' }}>
            🎯
          </div>
          <div className="text-2xl font-bold" style={{ color: '#9c27b0', fontFamily: 'var(--font-serif)' }}>
            {avgFocus} <span className="text-xs font-normal opacity-70">/ 10</span>
          </div>
          <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-text-muted)' }}>
            Average Focus Capacity
          </div>
        </div>
      </div>

      {/* Main Focus, Mood & Energy Trend Chart */}
      <div className="glass p-6 md:p-8 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2
              className="text-base font-bold flex items-center gap-2"
              style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}
            >
              <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
              Attention & Wellbeing Trajectory
            </h2>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              Real continuous tracking over your recorded sessions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--color-primary)' }} /> Focus
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#ff9800' }} /> Energy
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ background: '#2196f3' }} /> Mood
            </span>
          </div>
        </div>

        <div style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="focusGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff9800" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#ff9800" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  fontSize: '12px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                }}
                formatter={(val: any, name: any) => [`${val}%`, name === 'focusScore' ? 'Focus' : name === 'energyScore' ? 'Energy' : 'Mood']}
              />
              <Area type="monotone" dataKey="focusScore" stroke="var(--color-primary)" strokeWidth={2.5} fill="url(#focusGrad)" />
              <Area type="monotone" dataKey="energyScore" stroke="#ff9800" strokeWidth={2} fill="url(#energyGrad)" />
              <Area type="monotone" dataKey="moodScore" stroke="#2196f3" strokeWidth={1.5} fill="transparent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Secondary Row: Distractions Breakdown & Recent Journal Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Distraction breakdown */}
        <div className="glass p-6 shadow-sm">
          <h3
            className="text-sm font-bold mb-3 flex items-center gap-2"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}
          >
            <Target size={16} style={{ color: 'var(--color-primary)' }} />
            Most Common Distractions
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Frequency of primary focus interruptions reported in check-ins.
          </p>

          <div style={{ height: '170px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distractionData} layout="vertical" margin={{ top: 0, right: 10, left: 10, bottom: 0 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: 'var(--color-text-muted)' }} width={80} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={6} fill="var(--color-primary)">
                  {distractionData.map((_, i) => (
                    <Cell key={i} fill={`hsl(${140 + i * 25}, 45%, 50%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Reflection Notes */}
        <div className="glass p-6 shadow-sm">
          <h3
            className="text-sm font-bold mb-3 flex items-center gap-2"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}
          >
            <FileText size={16} style={{ color: 'var(--color-primary)' }} />
            Recent Check-In Notes
          </h3>
          <p className="text-xs mb-4" style={{ color: 'var(--color-text-muted)' }}>
            Personal reflections logged during check-ins:
          </p>

          <div className="space-y-3 max-h-[170px] overflow-y-auto pr-1">
            {filtered.filter(c => c.note && c.note.trim().length > 0).length === 0 ? (
              <p className="text-xs italic" style={{ color: 'var(--color-text-muted)' }}>
                No journal notes recorded yet in this window. Add a short note during your next check-in!
              </p>
            ) : (
              filtered
                .filter(c => c.note && c.note.trim().length > 0)
                .slice(-3)
                .reverse()
                .map((c, i) => (
                  <div key={i} className="p-3 rounded-xl text-xs" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                    <div className="flex items-center justify-between text-[11px] mb-1 font-semibold" style={{ color: 'var(--color-primary)' }}>
                      <span>{c.date}</span>
                      <span>Mood: {c.mood}/5 · Focus: {c.focus}/10</span>
                    </div>
                    <p style={{ color: 'var(--color-text)', lineHeight: 1.45 }}>"{c.note}"</p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
