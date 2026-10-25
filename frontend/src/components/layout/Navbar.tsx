import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun,
  Moon,
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  Settings,
  Leaf,
  Home,
  Brain,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
} from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { THEMES } from '../../types'
import { useState, useEffect } from 'react'

const NAV_LINKS = [
  { to: '/?home=true', icon: Home,            label: 'Home'       },
  { to: '/dashboard',  icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/assessment', icon: ClipboardList,    label: 'Assessment' },
  { to: '/cognitive',  icon: Brain,            label: 'Cognitive'  },
  { to: '/progress',   icon: TrendingUp,       label: 'Progress'   },
  { to: '/settings',   icon: Settings,         label: 'Settings'   },
]

export default function Navbar() {
  const { theme, resolvedMode, toggleMode, setTheme } = useTheme()
  const { currentUser, logout } = useAuth()
  const location = useLocation()
  const [showThemePicker, setShowThemePicker] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Auto-close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false)
    setShowThemePicker(false)
    setShowUserMenu(false)
  }, [location.pathname])

  const currentTheme = THEMES.find(t => t.id === theme) || THEMES[0]

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-colors"
      style={{
        background: 'var(--gradient-card)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--color-border)',
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 flex items-center justify-between h-16">
        {/* Left: Brand Logo */}
        <Link
          to={typeof window !== 'undefined' && window.innerWidth < 768 ? '/dashboard' : '/'}
          className="flex items-center gap-2 no-underline flex-shrink-0"
          style={{ color: 'var(--color-text)' }}
          aria-label="MindEase Home"
        >
          <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Leaf size={26} style={{ color: 'var(--color-primary)' }} />
          </motion.div>
          <span
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--color-primary)',
              letterSpacing: '-0.01em',
            }}
          >
            MindEase
          </span>
        </Link>

        {/* Center: Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main Navigation">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
            return (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ scale: 1.04 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: active ? 'var(--color-primary)' : 'transparent',
                    color: active ? 'white' : 'var(--color-text-muted)',
                  }}
                >
                  <Icon size={15} />
                  <span>{label}</span>
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Right: Controls & Mobile Hamburger */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme picker */}
          <div className="relative">
            <motion.button
              onClick={() => {
                setShowThemePicker(v => !v)
                setShowUserMenu(false)
              }}
              whileTap={{ scale: 0.94 }}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base cursor-pointer"
              style={{
                background: 'var(--color-surface-2)',
                border: '1px solid var(--color-border)',
                touchAction: 'manipulation',
              }}
              title="Choose theme"
              aria-label="Choose theme"
            >
              {currentTheme.emoji}
            </motion.button>

            <AnimatePresence>
              {showThemePicker && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  className="absolute right-0 mt-2 p-2 rounded-2xl shadow-2xl z-50"
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    width: '230px',
                    maxWidth: 'calc(100vw - 24px)',
                  }}
                >
                  <p className="text-xs font-semibold px-2 py-1 mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Choose Your Theme
                  </p>
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setTheme(t.id)
                        setShowThemePicker(false)
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-left transition-all cursor-pointer"
                      style={{
                        background: theme === t.id ? 'var(--color-accent-2)' : 'transparent',
                        color: 'var(--color-text)',
                        border: theme === t.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                        touchAction: 'manipulation',
                      }}
                    >
                      <span className="text-base">{t.emoji}</span>
                      <div className="overflow-hidden">
                        <div className="font-medium text-xs sm:text-sm">{t.label}</div>
                        <div className="text-[11px] truncate" style={{ color: 'var(--color-text-muted)' }}>
                          {t.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mode toggle */}
          <motion.button
            onClick={toggleMode}
            whileTap={{ scale: 0.94 }}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center cursor-pointer"
            style={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-muted)',
              touchAction: 'manipulation',
            }}
            title="Toggle dark/light mode"
            aria-label="Toggle dark/light mode"
          >
            {resolvedMode === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </motion.button>

          {/* User Account / Profile on Desktop */}
          {currentUser ? (
            <div className="relative hidden sm:block">
              <motion.button
                onClick={() => {
                  setShowUserMenu(v => !v)
                  setShowThemePicker(false)
                }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-1.5 pl-2 pr-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                  touchAction: 'manipulation',
                }}
                id="user-profile-btn"
                aria-label="User Account Menu"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{ background: 'var(--color-primary)', color: 'white' }}
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <span className="max-w-[80px] md:max-w-[110px] truncate">{currentUser.name}</span>
                <ChevronDown size={13} style={{ color: 'var(--color-text-muted)' }} />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 mt-2 p-3 rounded-2xl shadow-2xl z-50 w-64"
                    style={{
                      background: 'var(--color-surface)',
                      border: '1px solid var(--color-border)',
                      maxWidth: 'calc(100vw - 24px)',
                    }}
                  >
                    <div className="flex items-center gap-3 pb-3 mb-2 border-b" style={{ borderColor: 'var(--color-border)' }}>
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                        style={{ background: 'var(--color-primary)', color: 'white' }}
                      >
                        {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-semibold text-sm truncate" style={{ color: 'var(--color-text)' }}>
                          {currentUser.name}
                        </div>
                        <div className="text-xs truncate" style={{ color: 'var(--color-text-muted)' }}>
                          {currentUser.email}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors"
                        style={{ color: 'var(--color-text)', textDecoration: 'none' }}
                      >
                        <LayoutDashboard size={14} style={{ color: 'var(--color-primary)' }} />
                        <span>My Dashboard</span>
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors"
                        style={{ color: 'var(--color-text)', textDecoration: 'none' }}
                      >
                        <Settings size={14} style={{ color: 'var(--color-primary)' }} />
                        <span>Account & Themes</span>
                      </Link>

                      <button
                        onClick={() => {
                          logout()
                          setShowUserMenu(false)
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-left transition-colors cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                        style={{ border: 'none', background: 'transparent', touchAction: 'manipulation' }}
                      >
                        <LogOut size={14} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium no-underline"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
                minHeight: '36px',
                touchAction: 'manipulation',
              }}
              id="nav-login-btn"
            >
              <User size={13} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Hamburger Menu Toggle Button */}
          <motion.button
            onClick={() => setMobileMenuOpen(v => !v)}
            whileTap={{ scale: 0.92 }}
            className="md:hidden w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-colors"
            style={{
              background: mobileMenuOpen ? 'var(--color-primary)' : 'var(--color-surface-2)',
              color: mobileMenuOpen ? 'white' : 'var(--color-text)',
              border: '1px solid var(--color-border)',
              touchAction: 'manipulation',
            }}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            id="mobile-nav-toggle-btn"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Navigation Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t"
            style={{
              background: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
            }}
            id="mobile-nav-drawer"
          >
            <div className="px-4 py-4 space-y-3 max-h-[calc(100vh-72px)] overflow-y-auto">
              {/* User Profile Header (Mobile) */}
              {currentUser ? (
                <div
                  className="flex items-center justify-between p-3 rounded-2xl mb-2"
                  style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: 'var(--color-primary)', color: 'white' }}
                    >
                      {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
                    </div>
                    <div className="overflow-hidden">
                      <div className="font-semibold text-xs truncate" style={{ color: 'var(--color-text)' }}>
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] truncate" style={{ color: 'var(--color-text-muted)' }}>
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      logout()
                      setMobileMenuOpen(false)
                    }}
                    className="p-2 text-xs font-semibold rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-1 cursor-pointer"
                    style={{ border: 'none', background: 'transparent', touchAction: 'manipulation' }}
                    aria-label="Sign Out"
                  >
                    <LogOut size={14} />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 p-3 rounded-xl text-sm font-semibold no-underline w-full shadow-sm"
                  style={{
                    background: 'var(--color-primary)',
                    color: 'white',
                    touchAction: 'manipulation',
                  }}
                >
                  <User size={16} />
                  <span>Sign In / Create Account</span>
                </Link>
              )}

              {/* Navigation Links Grid (Mobile) */}
              <div className="grid grid-cols-2 gap-2">
                {NAV_LINKS.map(({ to, icon: Icon, label }) => {
                  const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
                  return (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3.5 py-3 rounded-xl text-xs font-semibold transition-all no-underline"
                      style={{
                        background: active ? 'var(--color-primary)' : 'var(--color-surface-2)',
                        color: active ? 'white' : 'var(--color-text)',
                        border: `1.5px solid ${active ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        minHeight: '44px',
                        touchAction: 'manipulation',
                      }}
                    >
                      <Icon size={16} style={{ color: active ? 'white' : 'var(--color-primary)' }} />
                      <span>{label}</span>
                    </Link>
                  )
                })}
              </div>

              {/* Quick Theme Selector in Mobile Drawer */}
              <div className="pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--color-text-muted)' }}>
                  Theme Ambience
                </p>
                <div className="grid grid-cols-3 gap-1.5">
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium cursor-pointer transition-all"
                      style={{
                        background: theme === t.id ? 'var(--color-primary)' : 'var(--color-surface-2)',
                        color: theme === t.id ? 'white' : 'var(--color-text)',
                        border: `1px solid ${theme === t.id ? 'var(--color-primary)' : 'var(--color-border)'}`,
                        minHeight: '38px',
                        touchAction: 'manipulation',
                      }}
                    >
                      <span>{t.emoji}</span>
                      <span className="text-[11px] truncate">{t.label.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop for closing modals */}
      {(showThemePicker || showUserMenu) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowThemePicker(false)
            setShowUserMenu(false)
          }}
        />
      )}
    </header>
  )
}
