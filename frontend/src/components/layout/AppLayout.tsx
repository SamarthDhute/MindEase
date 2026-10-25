import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import ParticleBackground from '../ui/ParticleBackground'

const pageVariants = {
  initial:   { opacity: 0, y: 18 },
  animate:   { opacity: 1, y: 0,  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
  exit:      { opacity: 0, y: -12, transition: { duration: 0.25 } },
}

export default function AppLayout() {
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <ParticleBackground />
      <Navbar />

      <main style={{ flex: 1, width: '100%', paddingTop: '64px', display: 'flex', flexDirection: 'column' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}
