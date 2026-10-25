import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Shield, Lock, EyeOff, Server, ArrowRight } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass p-5 sm:p-8 md:p-12 shadow-xl"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner" style={{ background: 'var(--color-accent-2)' }}>
            🛡️
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--color-text)', lineHeight: 1.2 }}>
              Privacy & Data Ethics
            </h1>
            <p className="text-xs md:text-sm" style={{ color: 'var(--color-text-muted)' }}>
              How your reflections, scores, and information are handled
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
          <p>
            At MindEase, your privacy and peace of mind are foundational. We believe that personal self-reflection
            requires a safe, confidential environment free from commercial tracking, data mining, or predatory advertising.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
            <div className="p-5 rounded-2xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <Lock size={22} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
              <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Local-First Storage</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Your assessment answers, daily check-in logs, and streaks remain stored safely inside your browser's local memory.
              </p>
            </div>

            <div className="p-5 rounded-2xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <EyeOff size={22} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
              <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Zero Third-Party Trackers</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                MindEase uses no third-party tracking cookies, marketing beacons, or cross-site tracking scripts.
              </p>
            </div>

            <div className="p-5 rounded-2xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <Server size={22} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
              <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Stateless AI Inference</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                When sending your answers to the neural model, the API processes the mathematical input statelessly without persisting your identity.
              </p>
            </div>

            <div className="p-5 rounded-2xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <Shield size={22} style={{ color: 'var(--color-primary)', marginBottom: '0.5rem' }} />
              <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Complete Data Control</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                You can reset your account, clear assessment results, or retake the assessment at any time from Settings.
              </p>
            </div>
          </div>

          <h2 className="text-lg font-bold pt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)' }}>
            Research Disclaimer
          </h2>
          <p>
            MindEase is intended solely for educational, research, and personal wellness exploration. It does not provide
            medical diagnoses, clinical evaluations, or therapeutic prescriptions. If you are experiencing severe distress or
            suspect an attention-related disorder, please consult a licensed mental health professional.
          </p>

          <div className="pt-6 border-t flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <Link to="/settings" className="btn-primary text-xs py-3 px-6 text-center justify-center min-h-[44px]">
              Review Settings
            </Link>
            <Link to="/" className="btn-secondary text-xs py-3 px-5 text-center justify-center min-h-[44px]">
              Return Home
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
