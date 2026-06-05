'use client'

import { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (savedTheme) {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const defaultTheme = systemPrefersDark ? 'dark' : 'light'
      setTheme(defaultTheme)
      document.documentElement.setAttribute('data-theme', defaultTheme)
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <button
      onClick={toggleTheme}
      style={{
        background: 'transparent',
        border: 'none',
        color: 'inherit',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px',
        borderRadius: '50%',
        transition: 'all 0.3s ease',
        opacity: 0.8
      }}
      title={theme === 'light' ? 'Chuyển sang chế độ tối' : 'Chuyển sang chế độ sáng'}
      onMouseEnter={(e) => {
        e.currentTarget.style.opacity = '1'
        e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = '0.8'
        e.currentTarget.style.background = 'transparent'
      }}
      aria-label="Toggle dark mode"
    >
      {theme === 'light' ? <Moon size={20} /> : <Sun size={20} style={{ color: 'var(--color-gold)' }} />}
    </button>
  )
}
