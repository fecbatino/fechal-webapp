'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggle: () => void
  set: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'dark',
  toggle: () => {},
  set: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<Theme>('dark')

  // Hydrate after mount to avoid mismatch
  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null
    if (stored === 'light' || stored === 'dark') {
      setThemeState(stored)
    } else {
      // System preference
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches
      setThemeState(prefersLight ? 'light' : 'dark')
    }
    setMounted(true)
  }, [])

  // Apply theme class + localStorage
  useEffect(() => {
    if (!mounted) return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      root.classList.remove('light')
    } else {
      root.classList.add('light')
      root.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme, mounted])

  const toggle = useCallback(() => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
  }, [])

  const set = useCallback((t: Theme) => {
    setThemeState(t)
  }, [])

  // Prevent flash of wrong theme
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{ theme: 'dark', toggle, set }}>
        {/* Block rendering until mounted – avoids hydration mismatch */}
        <div style={{ visibility: 'hidden' }}>{children}</div>
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle, set }}>
      {children}
    </ThemeContext.Provider>
  )
}