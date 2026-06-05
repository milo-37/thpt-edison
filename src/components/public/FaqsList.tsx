'use client'

import { useState } from 'react'
import { HelpCircle, ChevronDown, Search, MessageSquare } from 'lucide-react'

interface Faq {
  id: string
  question: string
  answer: string
  category: string
  order: number
}

interface FaqsListProps {
  initialFaqs: Faq[]
}

const categoryLabels: Record<string, string> = {
  general: 'Chung',
  admission: 'Tuyển sinh',
  tuition: 'Học phí',
  academic: 'Học tập'
}

export default function FaqsList({ initialFaqs }: FaqsListProps) {
  const [activeTab, setActiveTab] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Filter and search logic
  const filtered = initialFaqs.filter((faq) => {
    const matchesCategory = activeTab === 'all' || faq.category === activeTab
    const matchesSearch = 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Search Input (Glass style) */}
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '540px', 
          margin: '0 auto' 
        }}
      >
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '18px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--color-primary)',
            zIndex: 2
          }} 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm câu hỏi hoặc nội dung..."
          className="form-input"
          style={{
            padding: '14px 18px 14px 48px',
            borderRadius: '16px',
            border: '1px solid rgba(10, 75, 175, 0.15)',
            outline: 'none',
            fontSize: 'var(--font-size-sm)',
            boxShadow: 'var(--shadow-sm)',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            transition: 'all var(--transition-base)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)'
            e.target.style.boxShadow = '0 0 0 4px rgba(10, 75, 175, 0.1), var(--shadow-md)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(10, 75, 175, 0.15)'
            e.target.style.boxShadow = 'var(--shadow-sm)'
          }}
        />
      </div>

      {/* Filter Tabs */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px', 
          flexWrap: 'wrap',
          background: 'rgba(148, 163, 184, 0.08)',
          padding: '6px',
          borderRadius: '16px',
          width: 'fit-content',
          margin: '0 auto',
          border: '1px solid rgba(148, 163, 184, 0.1)'
        }}
      >
        <button
          onClick={() => { setActiveTab('all'); setExpandedId(null); }}
          style={{
            padding: '8px 20px',
            borderRadius: '12px',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'all' ? 'var(--color-navy)' : 'transparent',
            color: activeTab === 'all' ? 'var(--color-white)' : 'var(--color-gray-600)',
            transition: 'all var(--transition-base)'
          }}
        >
          Tất cả
        </button>
        {Object.entries(categoryLabels).map(([k, v]) => (
          <button
            key={k}
            onClick={() => { setActiveTab(k); setExpandedId(null); }}
            style={{
              padding: '8px 20px',
              borderRadius: '12px',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600,
              cursor: 'pointer',
              border: 'none',
              background: activeTab === k ? 'var(--color-navy)' : 'transparent',
              color: activeTab === k ? 'var(--color-white)' : 'var(--color-gray-600)',
              transition: 'all var(--transition-base)'
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)', background: 'var(--color-white)', borderRadius: '24px', border: '1px solid var(--color-gray-200)' }}>
          <MessageSquare size={48} style={{ margin: '0 auto var(--space-4) auto', opacity: 0.5, color: 'var(--color-primary)' }} />
          <p style={{ margin: 0, fontWeight: 500 }}>Không tìm thấy câu hỏi nào phù hợp với từ khóa của bạn.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id
            return (
              <div
                key={item.id}
                className="glass-card"
                style={{
                  background: isExpanded ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '24px',
                  border: isExpanded ? '1px solid rgba(10, 75, 175, 0.25)' : '1px solid rgba(15, 23, 42, 0.06)',
                  boxShadow: isExpanded ? 'var(--shadow-md), var(--shadow-glow)' : 'var(--shadow-sm)',
                  overflow: 'hidden',
                  transition: 'all var(--transition-spring)',
                  backdropFilter: 'blur(20px)'
                }}
              >
                {/* Header Button */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  style={{
                    width: '100%',
                    padding: '20px 24px',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <HelpCircle 
                      size={22} 
                      style={{ 
                        color: isExpanded ? 'var(--color-gold)' : 'var(--color-primary)', 
                        flexShrink: 0,
                        transition: 'color 0.3s ease'
                      }} 
                    />
                    <span 
                      style={{ 
                        fontSize: 'var(--font-size-base)', 
                        fontWeight: 700, 
                        color: isExpanded ? 'var(--color-navy-dark)' : 'var(--color-navy)',
                        transition: 'color 0.3s ease',
                        fontFamily: 'var(--font-title)'
                      }}
                    >
                      {item.question}
                    </span>
                  </div>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: isExpanded ? 'rgba(10, 75, 175, 0.08)' : 'rgba(15, 23, 42, 0.03)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s'
                    }}
                  >
                    <ChevronDown 
                      size={16} 
                      style={{ 
                        color: isExpanded ? 'var(--color-primary)' : 'var(--color-gray-500)',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                        flexShrink: 0
                      }} 
                    />
                  </div>
                </button>

                {/* Answer Content Panel */}
                <div
                  style={{
                    maxHeight: isExpanded ? '1000px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                >
                  <div 
                    style={{ 
                      padding: '0 24px 24px 60px',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-gray-600)',
                      lineHeight: 1.7,
                      borderTop: '1px solid rgba(15, 23, 42, 0.05)',
                      paddingTop: '16px',
                      whiteSpace: 'pre-line'
                    }}
                  >
                    {item.answer}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

