'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, FileText, FolderDown, Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface PostResult { id: string; title: string; slug: string; excerpt: string | null }
interface DocResult { id: string; title: string; description: string | null; filePath: string; fileType: string }
interface EventResult { id: string; title: string; description: string | null; startDate: string; location: string | null }

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ posts: PostResult[]; documents: DocResult[]; events: EventResult[] }>({
    posts: [],
    documents: [],
    events: []
  })
  const inputRef = useRef<HTMLInputElement>(null)

  // Focus input on mount
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden' // block scroll
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Debounced search query
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults({ posts: [], documents: [], events: [] })
      setLoading(false)
      return
    }

    setLoading(true)
    const delayDebounceFn = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=4`)
        const data = await res.json()
        setResults({
          posts: data.posts || [],
          documents: data.documents || [],
          events: data.events || []
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  if (!isOpen) return null

  // Word highlighter helper
  const highlightText = (text: string | null, search: string) => {
    if (!text) return ''
    if (!search || !search.trim()) return <span>{text}</span>
    const parts = text.split(new RegExp(`(${search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi'))
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === search.toLowerCase() 
            ? <mark key={i} style={{ background: 'var(--color-gold-light)', color: 'var(--color-navy-dark)', padding: '0 2px', borderRadius: '2px' }}>{part}</mark> 
            : part
        )}
      </span>
    )
  }

  const hasResults = results.posts.length > 0 || results.documents.length > 0 || results.events.length > 0

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(255, 255, 255, 0.75)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        justifyContent: 'center',
        padding: '8vh var(--space-4) 0 var(--space-4)',
        animation: 'fadeIn 0.2s ease-out'
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .search-item {
          display: flex;
          gap: 12px;
          padding: 12px;
          border-radius: 12px;
          transition: all 0.2s ease;
          text-decoration: none;
          background: transparent;
          border: 1px solid transparent;
        }
        .search-item:hover {
          background: rgba(99, 102, 241, 0.05);
          border-color: rgba(99, 102, 241, 0.1);
        }
      `}</style>
      <div 
        style={{
          width: '100%',
          maxWidth: '720px',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)'
        }}
      >
        {/* Search Input Area */}
        <div 
          style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            background: 'var(--color-white)',
            borderRadius: '20px',
            boxShadow: '0 20px 40px rgba(99, 102, 241, 0.08)',
            padding: 'var(--space-1) var(--space-4)',
            border: '1px solid rgba(99, 102, 241, 0.15)'
          }}
        >
          <Search size={22} style={{ color: '#6366f1', marginRight: '12px' }} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm tin tức, tài liệu học tập, sự kiện..."
            style={{
              flex: 1,
              padding: '16px 0',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              fontSize: 'var(--font-size-lg)',
              color: 'var(--color-navy)',
              fontWeight: 500
            }}
          />
          <button 
            onClick={onClose}
            style={{
              background: 'rgba(99, 102, 241, 0.08)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6366f1',
              marginLeft: '12px',
              transition: 'background 0.2s ease'
            }}
            title="Đóng (Esc)"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Container */}
        <div 
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            boxShadow: '0 25px 60px rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.15)',
            maxHeight: '65vh',
            overflowY: 'auto',
            padding: 'var(--space-6)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-6)'
          }}
        >
          {loading && (
            <div style={{ textAlign: 'center', color: '#6366f1', padding: 'var(--space-4)', fontWeight: 500 }}>Đang tìm kiếm...</div>
          )}

          {!loading && query.trim().length > 0 && query.trim().length < 2 && (
            <div style={{ textAlign: 'center', color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>Nhập ít nhất 2 ký tự để bắt đầu tìm kiếm.</div>
          )}

          {!loading && query.trim().length >= 2 && !hasResults && (
            <div style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: 'var(--space-4)' }}>Không tìm thấy kết quả nào phù hợp.</div>
          )}

          {!loading && query.trim().length === 0 && (
            <div style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: 'var(--space-4)', fontSize: 'var(--font-size-sm)' }}>Hãy gõ từ khóa để tìm kiếm thông tin nhanh toàn trang.</div>
          )}

          {/* Results Lists */}
          {!loading && hasResults && (
            <>
              {/* Posts (Tin tức) */}
              {results.posts.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid rgba(99, 102, 241, 0.1)', paddingBottom: '4px' }}>Tin tức & Thông báo</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.posts.map(post => (
                      <Link 
                        key={post.id} 
                        href={`/tin-tuc/${post.slug}`} 
                        onClick={onClose}
                        className="search-item"
                      >
                        <FileText size={18} style={{ color: '#6366f1', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)' }}>{highlightText(post.title, query)}</div>
                          {post.excerpt && <p style={{ fontSize: '11px', color: 'var(--color-gray-500)', margin: '2px 0 0 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{highlightText(post.excerpt, query)}</p>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Documents (Tài liệu) */}
              {results.documents.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid rgba(16, 185, 129, 0.1)', paddingBottom: '4px' }}>Tài liệu học tập</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.documents.map(doc => (
                      <a 
                        key={doc.id} 
                        href={doc.filePath} 
                        download
                        onClick={onClose}
                        className="search-item"
                      >
                        <FolderDown size={18} style={{ color: '#10b981', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)' }}>{highlightText(doc.title, query)}</div>
                          {doc.description && <p style={{ fontSize: '11px', color: 'var(--color-gray-500)', margin: '2px 0 0 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{highlightText(doc.description, query)}</p>}
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Events (Sự kiện) */}
              {results.events.length > 0 && (
                <div>
                  <h4 style={{ fontSize: '11px', fontWeight: 700, color: '#a855f7', textTransform: 'uppercase', marginBottom: '8px', borderBottom: '1px solid rgba(168, 85, 247, 0.1)', paddingBottom: '4px' }}>Sự kiện trường</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.events.map(event => (
                      <Link 
                        key={event.id} 
                        href="/hoat-dong" 
                        onClick={onClose}
                        className="search-item"
                      >
                        <Calendar size={18} style={{ color: '#a855f7', flexShrink: 0, marginTop: '2px' }} />
                        <div>
                          <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)' }}>{highlightText(event.title, query)}</div>
                          <div style={{ fontSize: '10px', color: '#a855f7', fontWeight: 600, marginTop: '2px' }}>
                            {new Date(event.startDate).toLocaleDateString('vi-VN')} {event.location ? `• Địa điểm: ${event.location}` : ''}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
