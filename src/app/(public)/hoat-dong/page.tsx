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
      <div className="section section-alt" style={{ minHeight: '80vh', background: 'linear-gradient(180deg, #ffffff 0%, #f4f6ff 100%)', position: 'relative' }}>
        <style>{`
          .back-link-btn:hover {
            transform: translateX(-4px);
          }
          .photo-card-item {
            background: rgba(255, 255, 255, 0.8);
            backdrop-filter: blur(12px);
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.03);
            border: 1px solid rgba(99, 102, 241, 0.12);
            transition: all 0.3s ease;
          }
          .photo-card-item:hover {
            transform: translateY(-5px);
            border-color: rgba(99, 102, 241, 0.25);
            box-shadow: 0 12px 30px rgba(99, 102, 241, 0.08);
          }
        `}</style>
        {/* Background blobs */}
        <div style={{ position: 'absolute', top: '10%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          
          {/* Nút quay lại */}
          <Link
            href="/hoat-dong"
            className="back-link-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: 'var(--font-size-sm)',
              color: '#4f46e5',
              marginBottom: 'var(--space-6)',
              fontWeight: 700,
              transition: 'transform 0.2s'
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
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-base)', margin: 0, maxWidth: '700px' }}>
                {album.description}
              </p>
            )}
          </div>

          {/* Lưới hiển thị các ảnh trong Album */}
          {album.photos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-12)', background: 'rgba(255, 255, 255, 0.75)', backdropFilter: 'blur(10px)', borderRadius: '24px', border: '1px solid rgba(99, 102, 241, 0.15)', color: 'var(--color-gray-400)' }}>
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
                  className="photo-card-item"
                >
                  <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
                    <img
                      src={photo.filePath}
                      alt={photo.caption || album.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s ease'
                      }}
                    />
                  </div>
                  {photo.caption && (
                    <div style={{ padding: 'var(--space-3)', background: 'rgba(255, 255, 255, 0.5)', borderTop: '1px solid rgba(99, 102, 241, 0.08)' }}>
                      <p style={{ fontSize: '13px', color: 'var(--color-gray-600)', margin: 0, lineHeight: 1.4 }}>
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
    <div className="section section-alt" style={{ minHeight: '80vh', background: 'linear-gradient(180deg, #ffffff 0%, #f4f6ff 100%)', position: 'relative' }}>
      {/* Decorative background blobs */}
      <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', filter: 'blur(45px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '15%', left: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-10)' }}>
          <span className="section-label">Kho lưu giữ khoảnh khắc & Lịch trình</span>
          <h1 className="section-title">Hoạt động & sự kiện học sinh</h1>
          <p className="section-desc">
            Hình ảnh các hoạt động thú vị và lịch trình chi tiết các hoạt động học tập, sự kiện ngoại khóa của Trường THPT Edison.
          </p>
        </div>

        <ActivityTabs albums={albums as any} events={events as any} />

      </div>
    </div>
  )
}
