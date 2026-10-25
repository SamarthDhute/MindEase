import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sun, Moon, LayoutDashboard, ClipboardList, TrendingUp, Settings, Leaf, Home, Brain, User, LogOut, ChevronDown } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext'
import { THEMES } from '../../types'
import { useState } from 'react'

const NAV_LINKS = [
  { to: '/',           icon: Home,            label: 'Home'       },
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

  const currentTheme = THEMES.find(t => t.id === theme)!

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'var(--gradient-card)', backdropFilter: 'blur(20px)', borderBottom: '1px solid var(--color-border)' }}
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline" style={{ color: 'var(--color-text)' }}>
          <motion.div whileHover={{ rotate: 15 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Leaf size={28} style={{ color: 'var(--color-primary)' }} />
          </motion.div>
          <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontWeight: 600, color: 'var(--color-primary)' }}>
            MindEase
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map(({ to, icon: Icon, label }) => {
            const active = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
            return (
              <Link key={to} to={to} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
                  style={{
                    background: active ? 'var(--color-primary)' : 'transparent',
                    color: active ? 'white' : 'var(--color-text-muted)',
                  }}
                >
                  <Icon size={15} />
                  {label}
                </motion.div>
              </Link>
            )
          })}
        </nav>

        {/* Controls */}
        <div className="flex items-center gap-2">
          {/* Theme picker */}
          <div className="relative">
            <motion.button
              onClick={() => { setShowThemePicker(v => !v); setShowUserMenu(false) }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-base"
              style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}
              title="Choose theme"
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
                  style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)', width: '220px' }}
                >
                  <p className="text-xs font-semibold px-2 py-1 mb-1" style={{ color: 'var(--color-text-muted)' }}>
                    Choose Your Theme
                  </p>
                  {THEMES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => { setTheme(t.id); setShowThemePicker(false) }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-left transition-all"
                      style={{
                        background: theme === t.id ? 'var(--color-accent-2)' : 'transparent',
                        color: 'var(--color-text)',
                        border: theme === t.id ? '1px solid var(--color-primary)' : '1px solid transparent',
                      }}
                    >
                      <span className="text-base">{t.emoji}</span>
                      <div>
                        <div className="font-medium">{t.label}</div>
                        <div className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{t.description}</div>
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
            title="Toggle dark/light mode"
          >
            {resolvedMode === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
          </motion.button>

          {/* User Account / Profile */}
          {currentUser ? (
            <div className="relative">
              <motion.button
                onClick={() => { setShowUserMenu(v => !v); setShowThemePicker(false) }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl text-xs font-medium cursor-pointer"
                style={{
                  background: 'var(--color-surface-2)',
                  border: '1px solid var(--color-border)',
                  color: 'var(--color-text)',
                }}
                id="user-profile-btn"
              >
                <div
                  className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs"
                  style={{ background: 'var(--color-primary)', color: 'white' }}
                >
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'M'}
                </div>
                <span className="hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
                <ChevronDown size={13} style={{ color: 'var(--color-text-muted)' }} />
              </motion.button>

              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 mt-2 p-3 rounded-2xl shadow-2xl z-50 w-64"
                    style={{ background: 'var(--color-surface)', border: '1px solid var(--color-border)' }}
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
                        style={{ border: 'none', background: 'transparent' }}
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
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium no-underline"
              style={{
                background: 'var(--color-primary)',
                color: 'white',
              }}
              id="nav-login-btn"
            >
              <User size={13} />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>

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
