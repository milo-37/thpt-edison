'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Image as ImageIcon, Calendar as CalendarIcon, ArrowRight } from 'lucide-react'
import CalendarView from './CalendarView'
import Link from 'next/link'

interface Album {
  id: string
  title: string
  description: string | null
  coverImage: string | null
  createdAt: string | Date
  _count: {
    photos: number
  }
}

interface Event {
  id: string
  title: string
  description: string | null
  startDate: string | Date
  endDate: string | Date | null
  location: string | null
}

interface ActivityTabsProps {
  albums: Album[]
  events: Event[]
}

function ActivityTabsContent({ albums, events }: ActivityTabsProps) {
  const searchParams = useSearchParams()
  const tabParam = searchParams.get('tab')
  const [activeTab, setActiveTab] = useState<'gallery' | 'calendar'>('gallery')

  useEffect(() => {
    if (tabParam === 'calendar' || tabParam === 'gallery') {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      <style>{`
        .activity-tab-btn {
          padding: 8px 24px;
          border-radius: 12px;
          font-size: var(--font-size-sm);
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: all 0.25s ease;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .album-item-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          border: 1px solid rgba(99, 102, 241, 0.12);
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.01);
          overflow: hidden;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
        }
        .album-item-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 12px 30px rgba(99, 102, 241, 0.06);
          background: #ffffff;
        }
        .view-album-btn {
          margin-top: auto;
          border: 1px solid rgba(99, 102, 241, 0.2);
          width: 100%;
          font-weight: 600;
          font-size: 11px;
          color: #6366f1;
          background: transparent;
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          text-align: center;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .view-album-btn:hover {
          background: rgba(99, 102, 241, 0.05);
          border-color: #6366f1;
        }
      `}</style>

      {/* Tabs navigation */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '8px', 
          background: 'rgba(99, 102, 241, 0.05)',
          padding: '6px',
          borderRadius: '16px',
          width: 'fit-content',
          margin: '0 auto',
          border: '1px solid rgba(99, 102, 241, 0.1)'
        }}
      >
        <button
          onClick={() => setActiveTab('gallery')}
          className="activity-tab-btn"
          style={{
            background: activeTab === 'gallery' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
            color: activeTab === 'gallery' ? '#ffffff' : '#6366f1',
          }}
        >
          <ImageIcon size={18} />
          Thư viện hình ảnh
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className="activity-tab-btn"
          style={{
            background: activeTab === 'calendar' ? 'linear-gradient(135deg, #6366f1, #a855f7)' : 'transparent',
            color: activeTab === 'calendar' ? '#ffffff' : '#6366f1',
          }}
        >
          <CalendarIcon size={18} />
          Lịch hoạt động & Sự kiện
        </button>
      </div>

      {/* Tab content */}
      <div style={{ minHeight: '400px' }}>
        {activeTab === 'gallery' ? (
          <div>
            {albums.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-400)', background: 'rgba(255, 255, 255, 0.7)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.12)' }}>
                <ImageIcon size={32} style={{ margin: '0 auto var(--space-2) auto', opacity: 0.5, color: '#6366f1' }} />
                <p>Kho album ảnh hiện đang trống.</p>
              </div>
            ) : (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: 'var(--space-6)'
                }}
              >
                {albums.map((album) => (
                  <div
                    key={album.id}
                    className="album-item-card"
                  >
                    <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}>
                      <img
                        src={album.coverImage || '/uploads/images/gallery-default.jpg'}
                        alt={album.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '8px',
                          right: '8px',
                          background: 'rgba(99, 102, 241, 0.8)',
                          backdropFilter: 'blur(4px)',
                          color: 'white',
                          padding: '3px 10px',
                          borderRadius: '8px',
                          fontSize: '10px',
                          fontWeight: 700
                        }}
                      >
                        {album._count.photos} hình ảnh
                      </div>
                    </div>

                    <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', flex: 1 }}>
                      <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 800, color: 'var(--color-navy)', margin: 0, lineHeight: 1.4 }}>
                        {album.title}
                      </h3>
                      {album.description && (
                        <p style={{ fontSize: '11px', color: 'var(--color-gray-500)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                          {album.description}
                        </p>
                      )}
                      <Link
                        href={`/hoat-dong?albumId=${album.id}`}
                        className="view-album-btn"
                      >
                        Xem Album Chi Tiết
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <CalendarView events={events} />
        )}
      </div>
    </div>
  )
}

export default function ActivityTabs(props: ActivityTabsProps) {
  return (
    <Suspense fallback={
      <div 
        className="skeleton" 
        style={{ 
          height: '400px', 
          borderRadius: 'var(--radius-xl)', 
          background: 'var(--color-gray-100)', 
          animation: 'pulse 1.5s infinite ease-in-out' 
        }} 
      />
    }>
      <ActivityTabsContent {...props} />
    </Suspense>
  )
}

