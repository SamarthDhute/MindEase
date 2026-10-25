import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Theme, Mode } from '../types'

interface ThemeContextValue {
  theme: Theme
  mode: Mode
  resolvedMode: 'light' | 'dark'
  setTheme: (t: Theme) => void
  setMode: (m: Mode) => void
  toggleMode: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function getSystemDark() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('me-theme') as Theme) || 'forest'
  })
  const [mode, setModeState] = useState<Mode>(() => {
    return (localStorage.getItem('me-mode') as Mode) || 'auto'
  })
  const [systemDark, setSystemDark] = useState(getSystemDark)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  const resolvedMode: 'light' | 'dark' = mode === 'auto' ? (systemDark ? 'dark' : 'light') : mode

  useEffect(() => {
    const html = document.documentElement
    html.setAttribute('data-theme', theme)
    html.setAttribute('data-mode', resolvedMode)
    localStorage.setItem('me-theme', theme)
    localStorage.setItem('me-mode', mode)
  }, [theme, mode, resolvedMode])

  const setTheme = useCallback((t: Theme) => setThemeState(t), [])
  const setMode  = useCallback((m: Mode) => setModeState(m), [])
  const toggleMode = useCallback(() => {
    setModeState(prev => {
      if (prev === 'light') return 'dark'
      if (prev === 'dark')  return 'auto'
      return 'light'
    })
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, mode, resolvedMode, setTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be inside ThemeProvider')
  return ctx
}
