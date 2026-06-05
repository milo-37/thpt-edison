import prisma from '@/lib/prisma'
import HeroBanner from '@/components/public/HeroBanner'
import NewsCard from '@/components/public/NewsCard'
import EventCalendar from '@/components/public/EventCalendar'
import GalleryGrid from '@/components/public/GalleryGrid'
import Link from 'next/link'
import { ArrowRight, Bell, Calendar, Image as ImageIcon } from 'lucide-react'

// Ép kiểu dynamic fetch để tránh static cache lỗi thời
export const revalidate = 60

export default async function HomePage() {
  // Lấy danh sách slides hiển thị trên trang chủ
  const slides = await prisma.slide.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  })

  // 1. Lấy bài viết Pinned (Thông báo quan trọng)
  const pinnedPosts = await prisma.post.findMany({
    where: { status: 'published', isPinned: true },
    orderBy: { publishedAt: 'desc' },
    take: 2,
    include: {
      category: true,
      author: { select: { name: true } },
    },
  })

  // 2. Lấy 3 bài viết mới nhất (Tin tức nổi bật)
  const latestPosts = await prisma.post.findMany({
    where: { status: 'published', isPinned: false },
    orderBy: { publishedAt: 'desc' },
    take: 3,
    include: {
      category: true,
      author: { select: { name: true } },
    },
  })

  // 3. Lấy 3 sự kiện sắp diễn ra
  const upcomingEvents = await prisma.event.findMany({
    where: { startDate: { gte: new Date() } },
    orderBy: { startDate: 'asc' },
    take: 3,
  })

  // 4. Lấy 4 album ảnh mới nhất
  const latestAlbums = await prisma.album.findMany({
    orderBy: { createdAt: 'desc' },
    take: 4,
    include: {
      _count: { select: { photos: true } },
    },
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* 1. Hero Banner */}
      <HeroBanner slides={slides} />

      {/* 2. Section Thông báo quan trọng (nếu có) */}
      {pinnedPosts.length > 0 && (
        <section style={{ background: '#fffbeb', borderBottom: '1px solid #fef3c7', padding: 'var(--space-4) 0' }}>
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-warning-dark)', fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
              <Bell size={18} className="animate-float" />
              <span>THÔNG BÁO QUAN TRỌNG:</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flex: 1, flexWrap: 'wrap' }}>
              {pinnedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/tin-tuc/${post.slug}`}
                  style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy-dark)', fontWeight: 500 }}
                >
                  📌 {post.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 3. Section Tin tức mới nhất */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)' }}>
            <div>
              <span className="section-label">Tin tức & Thông báo</span>
              <h2 className="section-title" style={{ margin: 0 }}>Tin Mới Nhất</h2>
            </div>
            <Link href="/tin-tuc" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
              Xem tất cả tin tức
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="news-grid">
            {latestPosts.map((post) => (
              <NewsCard key={post.id} post={post as any} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Section Sự kiện & Album ảnh */}
      <section className="section section-alt">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--space-12)' }}>
          
          {/* Cột trái: Album ảnh */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
              <div>
                <span className="section-label">Thư viện đa phương tiện</span>
                <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                  Hình Ảnh Hoạt Động
                </h3>
              </div>
              <Link href="/hoat-dong" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
                Xem tất cả
                <ArrowRight size={16} />
              </Link>
            </div>
            <GalleryGrid albums={latestAlbums} limit={4} />
          </div>

          {/* Cột phải: Lịch Sự kiện */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
              <div>
                <span className="section-label">Lịch trình</span>
                <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
                  Sự Kiện Sắp Tới
                </h3>
              </div>
            </div>
            <EventCalendar events={upcomingEvents as any} />
          </div>

        </div>
      </section>

      {/* 5. Section Call-To-Action (Tuyển sinh) */}
      <section className="section" style={{ background: 'linear-gradient(135deg, var(--color-navy), var(--color-navy-dark))', color: 'var(--color-white)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gold)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
            Cơ hội học tập tại Edison
          </span>
          <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, margin: 0 }}>
            Đăng Ký Tuyển Sinh Lớp 10 Năm Học 2026 - 2027
          </h2>
          <p style={{ opacity: 0.8, fontSize: 'var(--font-size-base)', lineHeight: 1.6 }}>
            Trở thành học sinh khóa mới của trường THPT Edison để được học tập trong môi trường giáo dục chuẩn quốc tế, cơ sở vật chất hiện đại bậc nhất.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
            <Link href="/tuyen-sinh" className="btn btn-gold btn-lg">
              Tìm hiểu ngay
            </Link>
            <Link href="/lien-he" className="btn btn-outline btn-lg">
              Liên hệ tư vấn
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
