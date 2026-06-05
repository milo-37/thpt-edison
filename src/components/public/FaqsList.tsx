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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Search Input */}
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          maxWidth: '500px', 
          margin: '0 auto var(--space-4) auto' 
        }}
      >
        <Search 
          size={18} 
          style={{ 
            position: 'absolute', 
            left: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--color-gray-400)' 
          }} 
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Tìm kiếm câu hỏi hoặc câu trả lời..."
          style={{
            width: '100%',
            padding: 'var(--space-3) var(--space-4) var(--space-3) 44px',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-gray-200)',
            outline: 'none',
            fontSize: 'var(--font-size-sm)',
            boxShadow: 'var(--shadow-sm)',
            transition: 'border-color var(--transition-fast)'
          }}
          onFocus={(e) => e.target.style.borderColor = 'var(--color-primary)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--color-gray-200)'}
        />
      </div>

      {/* Filter Tabs */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 'var(--space-2)', 
          flexWrap: 'wrap',
          background: 'var(--color-gray-100)',
          padding: '4px',
          borderRadius: 'var(--radius-lg)',
          width: 'fit-content',
          margin: '0 auto var(--space-4) auto'
        }}
      >
        <button
          onClick={() => { setActiveTab('all'); setExpandedId(null); }}
          style={{
            padding: 'var(--space-2) var(--space-4)',
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
          Tất cả
        </button>
        {Object.entries(categoryLabels).map(([k, v]) => (
          <button
            key={k}
            onClick={() => { setActiveTab(k); setExpandedId(null); }}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-md)',
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
        <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)' }}>
          <MessageSquare size={48} style={{ margin: '0 auto var(--space-4) auto', opacity: 0.5 }} />
          <p>Không tìm thấy câu hỏi nào phù hợp với từ khóa của bạn.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {filtered.map((item) => {
            const isExpanded = expandedId === item.id
            return (
              <div
                key={item.id}
                style={{
                  background: 'var(--color-white)',
                  borderRadius: 'var(--radius-xl)',
                  border: '1px solid var(--color-gray-200)',
                  boxShadow: 'var(--shadow-sm)',
                  overflow: 'hidden',
                  transition: 'all var(--transition-base)'
                }}
              >
                {/* Header */}
                <button
                  onClick={() => toggleExpand(item.id)}
                  style={{
                    width: '100%',
                    padding: 'var(--space-4) var(--space-6)',
                    background: 'transparent',
                    border: 'none',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <HelpCircle 
                      size={20} 
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
                        color: isExpanded ? 'var(--color-navy-light)' : 'var(--color-navy)',
                        transition: 'color 0.3s ease'
                      }}
                    >
                      {item.question}
                    </span>
                  </div>
                  <ChevronDown 
                    size={18} 
                    style={{ 
                      color: 'var(--color-gray-400)',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease',
                      flexShrink: 0
                    }} 
                  />
                </button>

                {/* Content */}
                <div
                  style={{
                    maxHeight: isExpanded ? '1000px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s cubic-bezier(0, 1, 0, 1)',
                  }}
                >
                  <div 
                    style={{ 
                      padding: '0 var(--space-6) var(--space-5) 44px',
                      fontSize: 'var(--font-size-sm)',
                      color: 'var(--color-gray-600)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--color-gray-100)',
                      paddingTop: 'var(--space-4)',
                      whiteSpace: 'pre-line' // Preserve line breaks in answers
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
