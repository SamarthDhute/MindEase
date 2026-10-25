import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Navbar'
import Footer from './Footer'
import BottomNav from './BottomNav'
import ParticleBackground from '../ui/ParticleBackground'
import OfflineBanner from '../ui/OfflineBanner'
import InstallPrompt from '../ui/InstallPrompt'

const pageVariants = {
  initial:   { opacity: 0, y: 18 },
  animate:   { opacity: 1, y: 0,  transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const } },
  exit:      { opacity: 0, y: -12, transition: { duration: 0.25 } },
}

export default function AppLayout() {
  const location = useLocation()

  return (
    <div
      style={{
        minHeight: '100dvh',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <ParticleBackground />
      <Navbar />
      <div style={{ paddingTop: '64px', width: '100%' }}>
        <OfflineBanner />
      </div>

      <main className="flex-1 w-full flex flex-col pb-20 md:pb-0">
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
      <BottomNav />
      <InstallPrompt />
    </div>
  )
}
