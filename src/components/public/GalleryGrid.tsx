import Link from 'next/link'
import { Image as ImageIcon, ArrowUpRight } from 'lucide-react'

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
      <div style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-gray-500)' }}>
        <ImageIcon size={32} style={{ margin: '0 auto var(--space-2) auto', opacity: 0.5 }} />
        <p>Thư viện ảnh đang được cập nhật.</p>
      </div>
    )
  }

  return (
    <div className="gallery-grid">
      {displayAlbums.map((album) => (
        <div key={album.id} className="gallery-item card" style={{ position: 'relative', overflow: 'hidden', borderRadius: 'var(--radius-lg)', aspectRatio: '4/3', border: 'none' }}>
          <img
            src={album.coverImage || defaultCover}
            alt={album.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform var(--transition-slow)' }}
          />
          <div
            className="gallery-overlay"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.4) 50%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: 'var(--space-4)',
              color: 'var(--color-white)'
            }}
          >
            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gold)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 'var(--space-1)', marginBottom: 'var(--space-1)' }}>
              <ImageIcon size={12} />
              {album._count?.photos || 0} hình ảnh
            </span>
            <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, margin: 0, lineHeight: 1.3 }}>
              {album.title}
            </h4>
            {album.description && (
              <p style={{ fontSize: '11px', opacity: 0.8, margin: 'var(--space-1) 0 0 0', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {album.description}
              </p>
            )}
            <Link
              href={`/hoat-dong?albumId=${album.id}`}
              style={{
                position: 'absolute',
                top: 'var(--space-3)',
                right: 'var(--space-3)',
                width: '32px',
                height: '32px',
                background: 'rgba(255,255,255,0.2)',
                backdropFilter: 'blur(5px)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-white)',
                transition: 'all var(--transition-fast)'
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
