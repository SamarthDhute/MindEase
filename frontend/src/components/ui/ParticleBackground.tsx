import { motion } from 'framer-motion'
import { useTheme } from '../../contexts/ThemeContext'

// ─── Floating Leaves (Forest) ─────────────────────────────────────────
function FloatingLeaves() {
  const leaves = Array.from({ length: 12 }, (_, i) => i)
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {leaves.map(i => (
        <motion.div
          key={i}
          className="absolute text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 20 + 5}%`,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.random() * 80 - 40],
            rotate: [0, Math.random() * 360],
            opacity: [0, 0.7, 0.7, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 12,
            delay: Math.random() * 15,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {['🍃', '🌿', '🍀', '🌱'][Math.floor(Math.random() * 4)]}
        </motion.div>
      ))}
    </div>
  )
}

// ─── Ocean Waves ──────────────────────────────────────────────────────
function OceanWaves() {
  return (
    <div className="pointer-events-none fixed bottom-0 left-0 right-0 z-0 opacity-30">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{ background: `var(--color-primary)`, borderRadius: '50% 50% 0 0 / 30% 30% 0 0', bottom: `${i * 18}px` }}
          animate={{ scaleX: [1, 1.08, 0.96, 1], x: [0, 20, -10, 0] }}
          transition={{ duration: 4 + i * 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.8 }}
        />
      ))}
    </div>
  )
}

// ─── Sakura Petals ────────────────────────────────────────────────────
function SakuraPetals() {
  const petals = Array.from({ length: 16 }, (_, i) => i)
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {petals.map(i => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 10}%`,
            fontSize: `${Math.random() * 12 + 10}px`,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.sin(i) * 60],
            rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
            opacity: [0, 0.8, 0.8, 0],
          }}
          transition={{
            duration: 7 + Math.random() * 10,
            delay: Math.random() * 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          🌸
        </motion.div>
      ))}
    </div>
  )
}

// ─── Rain ─────────────────────────────────────────────────────────────
function RainDrops() {
  const drops = Array.from({ length: 30 }, (_, i) => i)
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {drops.map(i => (
        <motion.div
          key={i}
          className="absolute w-px rounded-full opacity-40"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${Math.random() * 20 + 15}px`,
            background: 'var(--color-primary)',
          }}
          animate={{ y: ['0vh', '110vh'], opacity: [0, 0.5, 0] }}
          transition={{
            duration: 0.8 + Math.random() * 0.6,
            delay: Math.random() * 3,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  )
}

// ─── Clouds (Mountain) ────────────────────────────────────────────────
function DriftingClouds() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {['☁️', '🌤️', '⛅'].map((emoji, i) => (
        <motion.div
          key={i}
          className="absolute text-5xl opacity-20"
          style={{ top: `${10 + i * 18}%`, left: `-10%` }}
          animate={{ x: ['0vw', '120vw'] }}
          transition={{
            duration: 30 + i * 10,
            delay: i * 8,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {emoji}
        </motion.div>
      ))}
    </div>
  )
}

// ─── Stars (Starry Night) ─────────────────────────────────────────────
function TwinklingStars() {
  const stars = Array.from({ length: 50 }, (_, i) => i)
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
      {stars.map(i => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 70}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            background: Math.random() > 0.8 ? '#ffd700' : 'white',
          }}
          animate={{ opacity: [0.1, 1, 0.1], scale: [1, 1.4, 1] }}
          transition={{
            duration: 2 + Math.random() * 4,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* Shooting star */}
      <motion.div
        className="absolute h-px"
        style={{ background: 'linear-gradient(90deg, white, transparent)', width: '80px', top: '20%', left: '60%' }}
        animate={{ x: [0, 200], y: [0, 100], opacity: [0, 1, 0] }}
        transition={{ duration: 1.5, delay: 4, repeat: Infinity, repeatDelay: 12 }}
      />
    </div>
  )
}

// ─── Main Particle Component ──────────────────────────────────────────
export default function ParticleBackground() {
  const { theme } = useTheme()

  switch (theme) {
    case 'forest':   return <FloatingLeaves />
    case 'ocean':    return <OceanWaves />
    case 'sakura':   return <SakuraPetals />
    case 'rainy':    return <RainDrops />
    case 'mountain': return <DriftingClouds />
    case 'starry':   return <TwinklingStars />
    default:         return <FloatingLeaves />
  }
}
