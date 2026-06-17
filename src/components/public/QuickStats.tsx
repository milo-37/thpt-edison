'use client'

import { useState, useEffect } from 'react'
import { Users, UserCheck, BookOpen, GraduationCap } from 'lucide-react'

interface StatItemProps {
  label: string
  target: number
  suffix?: string
  icon: React.ReactNode
}

function Counter({ target, suffix = '', label, icon }: StatItemProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let start = 0
    const duration = 2000 // 2 seconds
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
  }, [target])

  return (
    <div className="glass-card" style={{ padding: 'var(--space-6) var(--space-8)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flex: 1, minWidth: '220px' }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-navy)', fontFamily: 'var(--font-title)', lineHeight: 1.1, letterSpacing: '-0.02em', display: 'flex', alignItems: 'baseline' }}>
          <span>{count.toLocaleString('vi-VN')}</span>
          <span style={{ color: '#6366f1', marginLeft: '2px' }}>{suffix}</span>
        </div>
        <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', fontWeight: 600, marginTop: '4px' }}>
          {label}
        </div>
      </div>
    </div>
  )
}

export default function QuickStats() {
  return (
    <section className="section" style={{ position: 'relative', zIndex: 5, marginTop: '-60px', padding: '0 0 var(--space-12) 0' }}>
      <div className="container">
        <div style={{ display: 'flex', gap: 'var(--space-6)', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Counter 
            icon={<Users size={28} />} 
            target={1500} 
            suffix="+" 
            label="Học sinh đang theo học" 
          />
          <Counter 
            icon={<UserCheck size={28} />} 
            target={120} 
            suffix="+" 
            label="Giáo viên chuyên môn" 
          />
          <Counter 
            icon={<BookOpen size={28} />} 
            target={30} 
            suffix="+" 
            label="Phòng học hiện đại" 
          />
          <Counter 
            icon={<GraduationCap size={28} />} 
            target={98} 
            suffix="%" 
            label="Tỷ lệ đỗ Đại học" 
          />
        </div>
      </div>
    </section>
  )
}
