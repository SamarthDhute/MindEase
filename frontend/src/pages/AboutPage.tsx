import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Leaf, Brain, Heart, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react'

export default function AboutPage() {
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
            🌿
          </div>
          <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: 'var(--color-text)', lineHeight: 1.2 }}>
              About MindEase
            </h1>
            <p className="text-xs md:text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Understanding attention patterns through gentle, nature-inspired AI
            </p>
          </div>
        </div>

        <div className="space-y-6 text-sm leading-relaxed" style={{ color: 'var(--color-text)' }}>
          <p>
            In an era of relentless digital notifications, hyper-fast short video feeds, and fractured workdays,
            sustaining continuous focus has become one of the greatest challenges of modern life.
          </p>

          <p>
            <strong>MindEase</strong> was created as a peaceful sanctuary and self-reflection laboratory. Rather than treating focus
            issues with guilt or harsh diagnostic labels, MindEase looks at attention through a holistic lens:
            your biological recovery (sleep), physical environment (lighting, noise), digital habits (screen time, phone proximity),
            and internal cognitive flow (thought wandering and stress).
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
            <div className="p-5 rounded-2xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <Brain size={24} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }} />
              <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Neural Estimation</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Powered by a Keras neural network trained on 5,000 multi-domain behavioral records.
              </p>
            </div>

            <div className="p-5 rounded-2xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <Sparkles size={24} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }} />
              <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Objective Lab</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                6 in-browser psychometric mini-games measuring reaction latency, memory, and vigilance.
              </p>
            </div>

            <div className="p-5 rounded-2xl border" style={{ background: 'var(--color-surface-2)', borderColor: 'var(--color-border)' }}>
              <ShieldCheck size={24} style={{ color: 'var(--color-primary)', marginBottom: '0.75rem' }} />
              <h3 className="font-bold mb-1" style={{ fontFamily: 'var(--font-serif)' }}>Educational First</h3>
              <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                Designed as a research demonstration and wellness tool, not a clinical psychiatric diagnosis.
              </p>
            </div>
          </div>

          <h2 className="text-lg font-bold pt-4" style={{ fontFamily: 'var(--font-serif)', color: 'var(--color-text)' }}>
            Our Non-Clinical Philosophy
          </h2>
          <p>
            Attention naturally ebbs and flows. Our sensitivity analysis measures how your self-reported habits
            influence the model's certainty, translating complex statistical weightings into practical, compassionate
            micro-habits (like placing your phone in another room or introducing brief standing pauses).
          </p>

          <div className="pt-6 border-t flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center justify-between" style={{ borderColor: 'var(--color-border)' }}>
            <Link to="/assessment" className="btn-primary text-xs py-3 px-6 text-center justify-center min-h-[44px]">
              Begin Assessment <ArrowRight size={14} />
            </Link>
            <Link to="/" className="btn-secondary text-xs py-3 px-5 text-center justify-center min-h-[44px]">
              Back to Garden
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
