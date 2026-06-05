'use client'

import { useState } from 'react'
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

export default function ActivityTabs({ albums, events }: ActivityTabsProps) {
  const [activeTab, setActiveTab] = useState<'gallery' | 'calendar'>('gallery')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Tabs navigation */}
      <div 
        style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: 'var(--space-2)', 
          background: 'var(--color-gray-100)',
          padding: '6px',
          borderRadius: 'var(--radius-lg)',
          width: 'fit-content',
          margin: '0 auto'
        }}
      >
        <button
          onClick={() => setActiveTab('gallery')}
          style={{
            padding: 'var(--space-2) var(--space-6)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'gallery' ? 'var(--color-navy)' : 'transparent',
            color: activeTab === 'gallery' ? 'var(--color-white)' : 'var(--color-gray-600)',
            transition: 'all var(--transition-base)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ImageIcon size={18} />
          Thư viện hình ảnh
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          style={{
            padding: 'var(--space-2) var(--space-6)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: activeTab === 'calendar' ? 'var(--color-navy)' : 'transparent',
            color: activeTab === 'calendar' ? 'var(--color-white)' : 'var(--color-gray-600)',
            transition: 'all var(--transition-base)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
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
              <div style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-gray-500)', background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)' }}>
                <ImageIcon size={32} style={{ margin: '0 auto var(--space-2) auto', opacity: 0.5 }} />
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
                    style={{
                      background: 'var(--color-white)',
                      borderRadius: 'var(--radius-xl)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-md)',
                      border: '1px solid var(--color-gray-100)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                    className="album-card"
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
                          background: 'rgba(15,23,42,0.7)',
                          color: 'var(--color-gold)',
                          padding: '2px 8px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '10px',
                          fontWeight: 600
                        }}
                      >
                        {album._count.photos} hình ảnh
                      </div>
                    </div>

                    <div style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1 }}>
                      <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0, lineHeight: 1.4 }}>
                        {album.title}
                      </h3>
                      {album.description && (
                        <p style={{ fontSize: '11px', color: 'var(--color-gray-500)', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.4 }}>
                          {album.description}
                        </p>
                      )}
                      <Link
                        href={`/hoat-dong?albumId=${album.id}`}
                        className="btn btn-ghost btn-sm"
                        style={{ marginTop: 'auto', border: '1px solid var(--color-gray-200)', width: '100%', fontWeight: 600, fontSize: '11px' }}
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
