import Link from 'next/link'
import { Camera, ArrowUpRight } from 'lucide-react'

interface AlbumProps {
  id: string
  title: string
  description: string | null
  coverImage: string | null
  _count?: {
    photos: number
  }
}

interface GalleryGridProps {
  albums: AlbumProps[]
  limit?: number
}

export default function GalleryGrid({ albums, limit }: GalleryGridProps) {
  const displayAlbums = limit ? albums.slice(0, limit) : albums
  const defaultCover = '/uploads/images/gallery-default.jpg'

  if (albums.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-10)', color: 'var(--color-gray-400)', borderRadius: '24px', background: 'rgba(99, 102, 241, 0.03)', border: '1px dashed rgba(99, 102, 241, 0.15)' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-3) auto' }}>
          <Camera size={24} style={{ color: '#6366f1', opacity: 0.6 }} />
        </div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)' }}>Thư viện ảnh đang được cập nhật.</p>
      </div>
    )
  }

  return (
    <div className="gallery-grid">
      {displayAlbums.map((album, index) => (
        <div
          key={album.id}
          className="gallery-item card"
          style={{
            position: 'relative',
            overflow: 'hidden',
            border: 'none',
            borderRadius: '24px',
            boxShadow: '0 10px 25px rgba(99, 102, 241, 0.04)'
          }}
        >
          <img
            src={album.coverImage || defaultCover}
            alt={album.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {/* Gradient overlay - always visible but stronger on hover via CSS */}
          <div
            className="gallery-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: index === 0
                ? 'linear-gradient(to top, rgba(99, 102, 241, 0.95) 0%, rgba(168, 85, 247, 0.3) 50%, transparent 80%)'
                : 'linear-gradient(to top, rgba(99, 102, 241, 0.95) 0%, rgba(168, 85, 247, 0.35) 60%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: index === 0 ? 'var(--space-6)' : 'var(--space-4)',
              color: 'var(--color-white)',
            }}
          >
            {/* Photo count badge */}
            <span style={{
              fontSize: '11px',
              color: 'white',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              marginBottom: '6px',
              padding: '4px 12px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(8px)',
              borderRadius: '999px',
              width: 'fit-content',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            }}>
              <Camera size={11} />
              {album._count?.photos || 0} ảnh
            </span>
            {/* Title */}
            <h4 style={{
              fontSize: index === 0 ? 'var(--font-size-base)' : 'var(--font-size-sm)',
              fontWeight: 800,
              margin: 0,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              textShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}>
              {album.title}
            </h4>
            {/* Description - only on featured */}
            {index === 0 && album.description && (
              <p style={{
                fontSize: '13px',
                opacity: 0.9,
                margin: '4px 0 0 0',
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                lineHeight: 1.5,
              }}>
                {album.description}
              </p>
            )}
            {/* Arrow link button */}
            <Link
              href={`/hoat-dong?albumId=${album.id}`}
              style={{
                position: 'absolute',
                top: 'var(--space-3)',
                right: 'var(--space-3)',
                width: '34px',
                height: '34px',
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(8px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(255, 255, 255, 0.2)',
              }}
            >
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
