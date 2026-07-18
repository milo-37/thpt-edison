'use client'

import { useState, useEffect, useRef } from 'react'
import { Users, UserCheck, BookOpen, GraduationCap, Award, ShieldCheck } from 'lucide-react'

interface StatItemProps {
  label: string
  target: number
  suffix?: string
  icon: React.ReactNode
  delay?: number
}

function Counter({ target, suffix = '', label, icon, delay = 0 }: StatItemProps) {
  const [count, setCount] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef<HTMLLIElement>(null)

  // IntersectionObserver — only start counting when scrolled into view
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return
    const startDelay = setTimeout(() => {
      let start = 0
      const duration = 2000
      const end = target
      if (start === end) return

      const totalMiliseconds = duration
      const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 15)
      
      const timer = setInterval(() => {
        start += Math.ceil(end / (duration / incrementTime))
        if (start >= end) {
          clearInterval(timer)
          setCount(end)
        } else {
          setCount(start)
        }
      }, incrementTime)

      return () => clearInterval(timer)
    }, delay)
    return () => clearTimeout(startDelay)
  }, [target, hasStarted, delay])

  return (
    <li
      ref={ref}
      className="stat-card"
      style={{
        opacity: hasStarted ? 1 : 0,
        transform: hasStarted ? 'translateY(0)' : 'translateY(20px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms, box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.4s ease`,
      }}
    >
      <span className="stat-card__icon" aria-hidden="true">
        {icon}
      </span>
      <div>
        <p className="stat-card__number">
          <strong>{count.toLocaleString('vi-VN')}</strong>
          <span className="stat-card__suffix">{suffix}</span>
        </p>
        <span className="stat-card__label">
          {label}
        </span>
      </div>
    </li>
  )
}

export default function QuickStats({ stats = [] }: { stats?: any[] }) {
  if (!stats || stats.length === 0) return null;

  const getIcon = (name: string) => {
    switch (name) {
      case 'Users': return <Users size={28} />
      case 'UserCheck': return <UserCheck size={28} />
      case 'BookOpen': return <BookOpen size={28} />
      case 'GraduationCap': return <GraduationCap size={28} />
      case 'Award': return <Award size={28} />
      case 'ShieldCheck': return <ShieldCheck size={28} />
      default: return <Users size={28} />
    }
  }

  return (
    <section className="section" aria-label="Thống kê nhanh về trường" style={{ position: 'relative', zIndex: 5, marginTop: '-60px', padding: '0 0 var(--space-4) 0' }}>
      <div className="container">
        <ul style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', justifyContent: 'center', listStyle: 'none', padding: 0, margin: 0 }}>
          {stats.map((stat, idx) => (
            <Counter 
              key={idx}
              icon={getIcon(stat.icon)} 
              target={parseInt(stat.value.replace(/[^0-9]/g, '')) || 0} 
              suffix={stat.suffix} 
              label={stat.label}
              delay={idx * 100}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
