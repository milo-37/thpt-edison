import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Image as ImageIcon, ChevronLeft, Calendar } from 'lucide-react'
import { formatDateVi } from '@/lib/validation'
import ActivityTabs from '@/components/public/ActivityTabs'

// Ép kiểu dynamic fetch để tránh static cache lỗi thời
export const revalidate = 0

interface PageProps {
  searchParams: Promise<{
    albumId?: string
  }>
}

export default async function ActivityPage(props: PageProps) {
  // Giải nén searchParams theo chuẩn Next.js 16
  const searchParams = await props.searchParams
  const albumId = searchParams.albumId || ''

  // Trường hợp 1: Xem chi tiết một album ảnh cụ thể
  if (albumId) {
    const album = await prisma.album.findUnique({
      where: { id: albumId },
      include: {
        photos: {
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!album) {
      return (
        <div className="section section-alt" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p>Album ảnh này không tồn tại hoặc đã bị xóa.</p>
            <Link href="/hoat-dong" className="btn btn-primary btn-sm" style={{ marginTop: 'var(--space-4)' }}>
              Quay lại thư viện ảnh
            </Link>
          </div>
        </div>
      )
    }

    return (
      <div className="section section-alt" style={{ minHeight: '80vh' }}>
        <div className="container">
          
          {/* Nút quay lại */}
          <Link
            href="/hoat-dong"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: 'var(--font-size-sm)',
              color: 'var(--color-primary)',
              marginBottom: 'var(--space-6)',
              fontWeight: 600
            }}
          >
            <ChevronLeft size={16} />
            Quay lại tất cả hoạt động
          </Link>

          {/* Tiêu đề & mô tả album */}
          <div style={{ marginBottom: 'var(--space-8)' }}>
            <span className="section-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} />
              Đăng ngày {formatDateVi(album.createdAt)}
            </span>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 'var(--space-2) 0' }}>
              {album.title}
            </h1>
            {album.description && (
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-base)', margin: 0, maxWidth: '700px' }}>
                {album.description}
              </p>
            )}
          </div>

          {/* Lưới hiển thị các ảnh trong Album */}
          {album.photos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)', background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', color: 'var(--color-gray-400)' }}>
              Chưa có hình ảnh nào được thêm vào album này.
            </div>
          ) : (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--space-6)'
              }}
            >
              {album.photos.map((photo) => (
                <div
                  key={photo.id}
                  style={{
                    background: 'var(--color-white)',
                    borderRadius: 'var(--radius-xl)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-sm)',
                    border: '1px solid var(--color-gray-200)'
                  }}
                  className="photo-card"
                >
                  <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img
                      src={photo.filePath}
                      alt={photo.caption || album.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform var(--transition-slow)'
                      }}
                      className="zoom-on-hover"
                    />
                  </div>
                  {photo.caption && (
                    <div style={{ padding: 'var(--space-3)', background: 'var(--color-white)', borderTop: '1px solid var(--color-gray-100)' }}>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)', margin: 0, lineHeight: 1.4 }}>
                        {photo.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    )
  }

  // Trường hợp 2: Hiển thị danh sách tất cả các Album ảnh & Lịch hoạt động
  const [albums, events] = await Promise.all([
    prisma.album.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { photos: true },
        },
      },
    }),
    prisma.event.findMany({
      orderBy: { startDate: 'asc' },
    }),
  ])

  return (
    <div className="section section-alt" style={{ minHeight: '80vh' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <span className="section-label">Kho lưu giữ khoảnh khắc & Lịch trình</span>
          <h1 className="section-title">Hoạt Động & Sự Kiện Học Sinh</h1>
          <p className="section-desc">
            Hình ảnh các hoạt động thú vị và lịch trình chi tiết các hoạt động học tập, sự kiện ngoại khóa của Trường THPT Edison.
          </p>
        </div>

        <ActivityTabs albums={albums as any} events={events as any} />

      </div>
    </div>
  )
}
