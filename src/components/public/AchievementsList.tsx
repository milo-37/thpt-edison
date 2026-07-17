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
  academic: '#6366f1', // Indigo
  sports: '#10b981',   // Emerald
  arts: '#a855f7',     // Purple
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
      <style>{`
        .achievement-tab-btn {
          padding: 8px 24px;
          border-radius: 12px;
          font-size: var(--font-size-sm);
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
        }
        .achievement-item-card {
          display: flex;
          flex-direction: column;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(99, 102, 241, 0.12);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.01);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .achievement-item-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 12px 30px rgba(99, 102, 241, 0.06);
          background: var(--glass-bg);
        }
      `}</style>

      {/* Filter Tabs */}
      <div 
        role="group"
        aria-label="Lọc theo danh mục thành tích"
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px', 
          flexWrap: 'wrap',
          background: 'rgba(99, 102, 241, 0.05)',
          padding: '6px',
          borderRadius: '16px',
          width: 'fit-content',
          margin: '0 auto',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }}
      >
        <button
          onClick={() => setActiveTab('all')}
          className="achievement-tab-btn"
          aria-pressed={activeTab === 'all'}
          style={{
            background: activeTab === 'all' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
            color: activeTab === 'all' ? '#ffffff' : '#6366f1',
          }}
        >
          Tất cả thành tích
        </button>
        {Object.entries(categoryLabels).map(([k, v]) => (
          <button
            key={k}
            onClick={() => setActiveTab(k)}
            className="achievement-tab-btn"
            aria-pressed={activeTab === k}
            style={{
              background: activeTab === k ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
              color: activeTab === k ? '#ffffff' : '#6366f1',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span aria-hidden="true">{getCategoryIcon(k)}</span>
            {v}
          </button>
        ))}
      </div>

      {/* Grid List */}
      {filtered.length === 0 ? (
        <p role="status" style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)', background: 'var(--glass-bg)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.12)' }}>
          <span aria-hidden="true" style={{ display: 'block', marginBottom: 'var(--space-4)' }}><Flame size={48} style={{ opacity: 0.5, color: '#6366f1' }} /></span>
          Chưa có dữ liệu thành tích cho danh mục này.
        </p>
      ) : (
        <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-8)', listStyle: 'none', padding: 0, margin: 0 }}>
          {filtered.map((item) => (
            <li key={item.id}>
              <article
                className="achievement-item-card animate-fadeIn"
              >
                {/* Card Image */}
                <div style={{ height: '200px', background: 'rgba(99, 102, 241, 0.05)', position: 'relative', overflow: 'hidden' }}>
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <span aria-hidden="true" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6366f1', background: 'linear-gradient(135deg, #f5f3ff, #e0e7ff)' }}>
                      <Trophy size={64} className="animate-float" />
                    </span>
                  )}
                  {/* Year Badge */}
                  {item.year && (
                    <span
                      style={{
                        position: 'absolute',
                        top: 'var(--space-4)',
                        left: 'var(--space-4)',
                        background: 'var(--glass-bg)',
                        backdropFilter: 'blur(4px)',
                        color: 'var(--color-navy)',
                        fontSize: '11px',
                        fontWeight: 700,
                        padding: '4px 8px',
                        borderRadius: '8px',
                        border: '1px solid rgba(99, 102, 241, 0.12)'
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
                      boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)'
                    }}
                  >
                    <span aria-hidden="true">{getCategoryIcon(item.category)}</span>
                    {categoryLabels[item.category]}
                  </span>
                </div>

                {/* Card Content */}
                <div style={{ padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', flex: 1 }}>
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-navy)', margin: 0, lineHeight: 1.4 }}>
                    {item.title}
                  </h3>
                  
                  {item.studentName && (
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: '#a855f7', margin: 0 }}>
                      🏆 Cán sự: {item.studentName}
                    </p>
                  )}
                  
                  {item.description && (
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.6 }}>
                      {item.description}
                    </p>
                  )}
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
