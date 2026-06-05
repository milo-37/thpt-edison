'use client'

import { useState } from 'react'
import { Trophy, Award, Palette, Activity, Flame } from 'lucide-react'

interface Achievement {
  id: string
  title: string
  description: string | null
  imageUrl: string | null
  year: string | null
  studentName: string | null
  category: string
  order: number
}

interface AchievementsListProps {
  initialAchievements: Achievement[]
}

const categoryLabels: Record<string, string> = {
  academic: 'Học thuật',
  sports: 'Thể thao',
  arts: 'Nghệ thuật',
  other: 'Khác'
}

const categoryColors: Record<string, string> = {
  academic: '#2563eb', // Blue
  sports: '#16a34a',   // Green
  arts: '#9333ea',     // Purple
  other: '#6b7280'     // Gray
}

export default function AchievementsList({ initialAchievements }: AchievementsListProps) {
  const [activeTab, setActiveTab] = useState<string>('all')

  const filtered = activeTab === 'all' 
    ? initialAchievements 
    : initialAchievements.filter(a => a.category === activeTab)

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'academic':
        return <Award size={18} />
      case 'sports':
        return <Activity size={18} />
      case 'arts':
        return <Palette size={18} />
      default:
        return <Trophy size={18} />
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Filter Tabs */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 'var(--space-2)', 
          flexWrap: 'wrap',
          background: 'var(--color-gray-100)',
          padding: '6px',
          borderRadius: 'var(--radius-lg)',
          width: 'fit-content',
          margin: '0 auto'
        }}
      >
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: 'var(--space-2) var(--space-6)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'all' ? 'var(--color-navy)' : 'transparent',
            color: activeTab === 'all' ? 'var(--color-white)' : 'var(--color-gray-600)',
            transition: 'all var(--transition-base)'
          }}
        >
          Tất cả thành tích
        </button>
        {Object.entries(categoryLabels).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setActiveTab(k)}
            style={{
              padding: 'var(--space-2) var(--space-6)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === k ? 'var(--color-navy)' : 'transparent',
              color: activeTab === k ? 'var(--color-white)' : 'var(--color-gray-600)',
              transition: 'all var(--transition-base)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            {getCategoryIcon(k)}
            {v}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)' }}>
          <Flame size={48} style={{ margin: '0 auto var(--space-4) auto', opacity: 0.5 }} />
          <p>Chưa có dữ liệu thành tích cho danh mục này.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-8)' }}>
          {filtered.map((item) => (
            <div
              key={item.id}
              className="achievement-card animate-fadeIn"
              style={{
                background: 'var(--color-white)',
                borderRadius: 'var(--radius-xl)',
                border: '1px solid var(--color-gray-200)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
              }}
            >
              {/* Card Image */}
              <div style={{ height: '200px', background: 'var(--color-navy-dark)', position: 'relative' }}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--color-gold-light)', background: 'linear-gradient(135deg, var(--color-navy-dark), var(--color-navy-light))' }}>
                    <Trophy size={64} className="animate-float" />
                  </div>
                )}
                {/* Year Badge */}
                {item.year && (
                  <span
                    style={{
                      position: 'absolute',
                      top: 'var(--space-4)',
                      left: 'var(--space-4)',
                      background: 'rgba(9, 22, 46, 0.8)',
                      backdropFilter: 'blur(4px)',
                      color: 'var(--color-white)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    {item.year}
                  </span>
                )}
                {/* Category Badge */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: 'var(--space-4)',
                    right: 'var(--space-4)',
                    background: categoryColors[item.category],
                    color: 'var(--color-white)',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-full)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                >
                  {getCategoryIcon(item.category)}
                  {categoryLabels[item.category]}
                </span>
              </div>

              {/* Card Content */}
              <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: 0, lineHeight: 1.4 }}>
                  {item.title}
                </h3>
                
                {item.studentName && (
                  <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gold-dark)' }}>
                    🏆 Cán sự: {item.studentName}
                  </div>
                )}
                
                {item.description && (
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.6 }}>
                    {item.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
