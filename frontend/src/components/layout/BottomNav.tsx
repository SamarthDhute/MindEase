import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, ClipboardList, Brain, TrendingUp } from 'lucide-react'

const BOTTOM_NAV_ITEMS = [
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assessment', icon: ClipboardList,    label: 'Assessment' },
  { to: '/cognitive',  icon: Brain,            label: 'Cognitive' },
  { to: '/progress',   icon: TrendingUp,       label: 'Progress' },
]

export default function BottomNav() {
  const location = useLocation()

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 transition-all safe-pb"
      style={{
        background: 'var(--color-surface)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-border)',
        boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.06)',
      }}
      aria-label="Mobile Bottom Navigation"
      id="mobile-bottom-nav"
    >
      <div className="grid grid-cols-4 h-16 max-w-lg mx-auto px-1">
        {BOTTOM_NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== '/' && location.pathname.startsWith(item.to))
          const Icon = item.icon

          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex flex-col items-center justify-center relative py-1 select-none transition-colors"
              style={{
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                textDecoration: 'none',
                minHeight: '48px',
                touchAction: 'manipulation',
              }}
              id={`bottom-nav-${item.label.toLowerCase()}`}
            >
              {isActive && (
                <motion.div
                  layoutId="bottomNavActiveBubble"
                  className="absolute top-1.5 w-11 h-11 rounded-2xl -z-10"
                  style={{
                    background: 'var(--color-accent-2)',
                    opacity: 0.7,
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <motion.div
                whileTap={{ scale: 0.88 }}
                className="flex flex-col items-center justify-center"
              >
                <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
                <span
                  className="text-[11px] mt-1 tracking-tight"
                  style={{
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {item.label}
                </span>
              </motion.div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
