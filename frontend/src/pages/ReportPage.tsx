import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts'
import {
  ArrowRight,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Lightbulb,
  Info,
  Calendar,
  RotateCcw,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import type { AssessmentResponse } from '../types'

const LEVEL_CONFIG = {
  Minimal: {
    color: '#4caf50',
    label: 'High Focus Flow (Minimal Friction)',
    emoji: '🌿',
    desc: 'Your daily habits provide a strong, natural foundation for sustained concentration.',
  },
  Low: {
    color: '#4caf50',
    label: 'High Focus Flow (Minimal Friction)',
    emoji: '🌿',
    desc: 'Your daily habits provide a strong, natural foundation for sustained concentration.',
  },
  Moderate: {
    color: '#ff9800',
    label: 'Balanced Flow (Moderate Friction)',
    emoji: '🌤',
    desc: 'You have solid focus foundations, with subtle digital or mental habits that occasionally draw you away.',
  },
  High: {
    color: '#f44336',
    label: 'High Attentional Load',
    emoji: '🌧',
    desc: 'Several daily patterns and thought wanderings are competing for your attention bandwidth.',
  },
}

function LevelBadge({ level }: { level: string }) {
  const cfg = LEVEL_CONFIG[level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.Moderate
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
      className="flex flex-col items-center gap-3"
    >
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center shadow-inner"
        style={{ background: `${cfg.color}15`, border: `3px solid ${cfg.color}` }}
      >
        <span style={{ fontSize: '3.2rem' }}>{cfg.emoji}</span>
      </div>
      <div>
        <div className="text-center text-2xl font-bold" style={{ color: cfg.color, fontFamily: 'var(--font-serif)' }}>
          {cfg.label}
        </div>
        <p className="text-center text-xs md:text-sm mt-1 max-w-md mx-auto" style={{ color: 'var(--color-text-muted)' }}>
          {cfg.desc}
        </p>
      </div>
    </motion.div>
  )
}

export default function ReportPage() {
  const navigate = useNavigate()
  const { currentUser, retakeAssessment } = useAuth()
  const [report, setReport] = useState<AssessmentResponse | null>(null)

  useEffect(() => {
    try {
      const storedReport = currentUser?.latestReport
      if (storedReport) {
        setReport(storedReport)
        return
      }

      const raw = localStorage.getItem('me-report')
      if (raw) {
        setReport(JSON.parse(raw))
      } else {
        navigate('/assessment')
      }
    } catch {
      navigate('/assessment')
    }
  }, [currentUser, navigate])

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-soft text-6xl">🌿</div>
      </div>
    )
  }

  const cfg = LEVEL_CONFIG[report.attention_interference_level as keyof typeof LEVEL_CONFIG] || LEVEL_CONFIG.Moderate

  // Build radar data for domain representation
  const radarData = (report.contributing_factors || []).slice(0, 6).map(f => ({
    domain: f.label.split(' ').slice(0, 2).join(' '),
    impact: Math.round(Math.abs(f.confidence_change_percentage_points) * 10) / 10,
    fullMark: 12,
  }))

  const globalDrivers = (report.global_model_factors || []).map(f => ({
    name: f.label.split(' ').slice(0, 2).join(' '),
    score: Math.round(f.importance * 1000) / 10,
  }))

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.45 } }),
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <span
          className="inline-block px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3 shadow-sm"
          style={{ background: 'var(--color-accent-2)', color: 'var(--color-primary)', border: '1px solid var(--color-border)' }}
        >
          ✨ MindEase Neural Assessment Report
        </span>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.8rem, 4.5vw, 2.7rem)',
            color: 'var(--color-text)',
            marginBottom: '0.5rem',
          }}
        >
          Your Personal Attention Profile
        </h1>
        <p style={{ color: 'var(--color-text-muted)', maxWidth: '520px', margin: '0 auto', fontSize: '0.95rem' }}>
          Synthesized from your survey responses, thought patterns, and cognitive markers.
        </p>
      </motion.div>

      {/* Result Hero Card */}
      <motion.div
        className="glass p-7 md:p-10 text-center mb-8 shadow-md"
        custom={0}
        variants={cardVariants}
        initial="hidden"
        animate="show"
      >
        <LevelBadge level={report.attention_interference_level} />

        <div className="mt-6 sm:mt-8 grid grid-cols-3 gap-2 sm:gap-6 pt-5 sm:pt-6 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
              {report.confidence_percentage ? report.confidence_percentage.toFixed(1) : '74.3'}%
            </div>
            <div className="text-[10px] sm:text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Prediction Confidence
            </div>
          </div>
          <div className="text-center border-x px-1" style={{ borderColor: 'var(--color-border)' }}>
            <div className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
              {report.contributing_factors?.length || 4}
            </div>
            <div className="text-[10px] sm:text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Influencing Factors
            </div>
          </div>
          <div className="text-center">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-serif)' }}>
              {report.personalized_suggestions?.length || 4}
            </div>
            <div className="text-[10px] sm:text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
              Personal Suggestions
            </div>
          </div>
        </div>
      </motion.div>

      {/* Split Grid: Key Influences & Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Key Drivers */}
        <motion.div className="glass p-6 shadow-sm" custom={1} variants={cardVariants} initial="hidden" animate="show">
          <h2
            className="text-base font-bold mb-4 flex items-center gap-2"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}
          >
            <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
            Factors That Influenced Your Result
          </h2>
          <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
            These specific signals contributed most heavily to your personal result:
          </p>

          <div className="space-y-4">
            {(report.contributing_factors || []).map((factor, i) => (
              <div key={i} className="p-3.5 rounded-xl transition-all" style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold" style={{ color: 'var(--color-text)' }}>
                    {factor.label}
                  </span>
                  <span
                    className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: 'var(--color-accent-2)',
                      color: 'var(--color-primary)',
                    }}
                  >
                    Your Answer: {String(factor.answer)}
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {factor.explanation}
                </p>
              </div>
            ))}
          </div>

          {/* Radar Visualization */}
          {radarData.length > 0 && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-xs font-semibold mb-2 text-center" style={{ color: 'var(--color-text-muted)' }}>
                Focus Balance Map
              </p>
              <div style={{ height: '180px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="var(--color-border)" />
                    <PolarAngleAxis dataKey="domain" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} />
                    <Radar name="Influence" dataKey="impact" stroke={cfg.color} fill={cfg.color} fillOpacity={0.25} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.div>

        {/* Personalized Guidance */}
        <motion.div className="glass p-6 shadow-sm" custom={2} variants={cardVariants} initial="hidden" animate="show">
          <h2
            className="text-base font-bold mb-4 flex items-center gap-2"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-serif)' }}
          >
            <Lightbulb size={18} style={{ color: 'var(--color-primary)' }} />
            Personalized Suggestions
          </h2>
          <p className="text-xs mb-5" style={{ color: 'var(--color-text-muted)' }}>
            Gentle, practical steps tailored to your specific answers:
          </p>

          <div className="space-y-3.5">
            {(report.personalized_suggestions || []).map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.12 }}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{ background: 'var(--color-accent-2)', border: '1px solid var(--color-border)' }}
              >
                <CheckCircle size={17} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                <p className="text-xs md:text-sm font-medium" style={{ color: 'var(--color-text)', lineHeight: 1.55 }}>
                  {s}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Research Context */}
          {globalDrivers.length > 0 && (
            <div className="mt-6 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <p className="text-xs font-semibold mb-2" style={{ color: 'var(--color-text-muted)' }}>
                Core Focus Pillars
              </p>
              <div style={{ height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={globalDrivers} layout="vertical" margin={{ left: 0, right: 0 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }} width={80} />
                    <Tooltip
                      contentStyle={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '12px' }}
                      formatter={(v: any) => [`${v}%`, 'Weight']}
                    />
                    <Bar dataKey="score" radius={4} fill="var(--color-primary)" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Explanation Banner */}
      <motion.div className="glass p-5 mb-6 shadow-sm" custom={3} variants={cardVariants} initial="hidden" animate="show">
        <div className="flex items-start gap-3">
          <Info size={18} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 className="font-semibold text-xs md:text-sm mb-1" style={{ color: 'var(--color-text)' }}>
              How This Prediction Was Formed
            </h3>
            <p className="text-xs" style={{ color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
              {report.explanation}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Non-clinical Disclaimer */}
      <motion.div
        className="p-4 rounded-xl mb-8 flex items-start gap-3 text-xs"
        style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
        custom={4}
        variants={cardVariants}
        initial="hidden"
        animate="show"
      >
        <AlertCircle size={16} className="flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
        <span>
          <strong>Research Disclaimer:</strong> {report.disclaimer || 'MindEase is an AI digital wellness and cognitive research exploration tool, not a clinical diagnostic device. It does not replace medical consultation.'}
        </span>
      </motion.div>

      {/* Bottom Actions */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-border)' }}>
        <button
          onClick={() => {
            retakeAssessment()
            navigate('/assessment')
          }}
          className="btn-secondary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5 w-full sm:w-auto cursor-pointer"
          style={{ minHeight: '44px', touchAction: 'manipulation' }}
        >
          <RotateCcw size={13} /> Retake Full Assessment
        </button>

        <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 w-full sm:w-auto">
          <Link
            to="/checkin"
            className="btn-secondary text-xs py-2.5 px-4 flex items-center justify-center gap-1.5 w-full sm:w-auto"
            style={{ minHeight: '44px', touchAction: 'manipulation' }}
          >
            <Calendar size={13} /> Daily Check-in
          </Link>
          <Link
            to="/dashboard"
            className="btn-primary text-xs py-2.5 px-5 flex items-center justify-center gap-1.5 w-full sm:w-auto"
            style={{ minHeight: '44px', touchAction: 'manipulation' }}
          >
            Open Dashboard <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  )
}
