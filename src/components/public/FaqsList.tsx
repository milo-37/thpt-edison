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
      <style>{`
        .faq-tab-btn {
          padding: 8px 20px;
          border-radius: 12px;
          font-size: var(--font-size-sm);
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
        }
        .faq-item-card {
          background: rgba(255, 255, 255, 0.7);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          backdrop-filter: blur(20px);
        }
        .faq-item-card:hover {
          background: rgba(255, 255, 255, 0.95);
          box-shadow: 0 12px 30px rgba(99, 102, 241, 0.05);
        }
      `}</style>
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
            color: '#6366f1',
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
            border: '1.5px solid rgba(99, 102, 241, 0.15)',
            outline: 'none',
            fontSize: 'var(--font-size-sm)',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.02)',
            background: 'rgba(255, 255, 255, 0.75)',
            color: 'var(--color-navy)',
            backdropFilter: 'blur(10px)',
            width: '100%',
            transition: 'all 0.25s ease'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#6366f1'
            e.target.style.background = '#ffffff'
            e.target.style.boxShadow = '0 0 0 4px rgba(99, 102, 241, 0.12)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'rgba(99, 102, 241, 0.15)'
            e.target.style.background = 'rgba(255, 255, 255, 0.75)'
            e.target.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.02)'
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
          background: 'rgba(99, 102, 241, 0.05)',
          padding: '6px',
          borderRadius: '16px',
          width: 'fit-content',
          margin: '0 auto',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }}
      >
        <button
          onClick={() => { setActiveTab('all'); setExpandedId(null); }}
          className="faq-tab-btn"
          style={{
            background: activeTab === 'all' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
            color: activeTab === 'all' ? '#ffffff' : '#6366f1',
          }}
        >
          Tất cả
        </button>
        {Object.entries(categoryLabels).map(([k, v]) => (
          <button
            key={k}
            onClick={() => { setActiveTab(k); setExpandedId(null); }}
            className="faq-tab-btn"
            style={{
              background: activeTab === k ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
              color: activeTab === k ? '#ffffff' : '#6366f1',
            }}
          >
            {v}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)', background: 'rgba(255, 255, 255, 0.8)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.12)' }}>
          <MessageSquare size={48} style={{ margin: '0 auto var(--space-4) auto', opacity: 0.5, color: '#6366f1' }} />
          <p style={{ margin: 0, fontWeight: 500 }}>Không tìm thấy câu hỏi nào phù hợp với từ khóa của bạn.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id
            return (
              <div
                key={item.id}
                className="faq-item-card"
                style={{
                  border: isExpanded ? '1px solid rgba(99, 102, 241, 0.3)' : '1px solid rgba(99, 102, 241, 0.12)',
                  boxShadow: isExpanded ? '0 10px 30px rgba(99, 102, 241, 0.06)' : '0 4px 15px rgba(99, 102, 241, 0.01)',
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
                        color: isExpanded ? '#a855f7' : '#6366f1', 
                        flexShrink: 0,
                        transition: 'color 0.3s ease'
                      }} 
                    />
                    <span 
                      style={{ 
                        fontSize: 'var(--font-size-base)', 
                        fontWeight: 700, 
                        color: isExpanded ? '#6366f1' : 'var(--color-navy)',
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
                      background: isExpanded ? 'rgba(99, 102, 241, 0.08)' : 'rgba(99, 102, 241, 0.02)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.3s'
                    }}
                  >
                    <ChevronDown 
                      size={16} 
                      style={{ 
                        color: isExpanded ? '#6366f1' : 'var(--color-gray-500)',
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
                      borderTop: '1px solid rgba(99, 102, 241, 0.08)',
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

