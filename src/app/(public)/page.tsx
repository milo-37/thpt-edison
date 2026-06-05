import prisma from '@/lib/prisma'
import HeroBanner from '@/components/public/HeroBanner'
import NewsCard from '@/components/public/NewsCard'
import EventCalendar from '@/components/public/EventCalendar'
import GalleryGrid from '@/components/public/GalleryGrid'
import QuickStats from '@/components/public/QuickStats'
import Testimonials from '@/components/public/Testimonials'
import Link from 'next/link'
import { ArrowRight, Bell, Calendar, Eye, Compass, ShieldCheck, CheckCircle2, Award, ClipboardList, BookOpen, Images } from 'lucide-react'

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

  // 5. Lấy cấu hình hệ thống
  const settingsList = await prisma.setting.findMany()
  const settings: Record<string, string> = {
    missionImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    schoolName: 'EDISON SCHOOL MINH DUC',
    logoUrl: '/school-logo.jpg',
  }
  settingsList.forEach((s) => {
    settings[s.key] = s.value
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Hero Banner */}
      <HeroBanner slides={slides} />

      {/* 2. Section Thống Kê Nổi Bật (Quick Stats) */}
      <QuickStats />

      {/* 3. Section Thông báo quan trọng (nếu có) */}
      {pinnedPosts.length > 0 && (
        <section 
          style={{ 
            background: 'linear-gradient(90deg, #FFFDEB 0%, #FEF3C7 100%)', 
            borderBottom: '1px solid #FDE68A', 
            padding: 'var(--space-3) 0',
            position: 'relative',
            zIndex: 4
          }}
        >
          <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-warning-dark)', fontWeight: 700, fontSize: 'var(--font-size-sm)' }}>
              <Bell size={18} className="animate-float" />
              <span>THÔNG BÁO MỚI:</span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-6)', flex: 1, flexWrap: 'wrap' }}>
              <style>{`
                .pinned-link {
                  font-size: var(--font-size-sm);
                  color: var(--color-navy-dark);
                  font-weight: 600;
                  text-decoration: none;
                  transition: color 0.2s;
                }
                .pinned-link:hover {
                  color: var(--color-gold-dark) !important;
                }
              `}</style>
              {pinnedPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/tin-tuc/${post.slug}`}
                  className="pinned-link"
                >
                  📌 {post.title}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Section Giới thiệu nhanh (Sứ mệnh - Tầm nhìn) */}
      <section className="section" style={{ background: 'var(--color-gray-50)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-12)', alignItems: 'center' }}>
            {/* Cột trái: Hình ảnh */}
            <div>
              <div 
                style={{ 
                  position: 'relative', 
                  borderRadius: '24px', 
                  overflow: 'hidden', 
                  boxShadow: 'var(--shadow-lg)', 
                  border: '6px solid var(--color-white)',
                  transform: 'perspective(1000px) rotateY(4deg)'
                }}
              >
                <img
                  src={settings.missionImageUrl}
                  alt="Edison School học tập"
                  style={{ width: '100%', height: '400px', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10, 75, 175, 0.3) 0%, transparent 60%)' }} />
              </div>
            </div>
            
            {/* Cột phải: Thông tin */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div>
                <span className="section-label">Hành Trình Khai Phóng</span>
                <h2 className="section-title" style={{ margin: '8px 0 0 0' }}>Kiến Tạo Thế Hệ Tiên Phong</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Tầm nhìn */}
                <div className="glass-card" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-5)', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(10, 75, 175, 0.08)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Eye size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>Tầm Nhìn</h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', margin: 0, lineHeight: 1.5 }}>
                      Trở thành ngôi trường THPT hàng đầu về đổi mới giáo dục, đào tạo ra những thế hệ công dân toàn cầu có tư duy độc lập và khả năng thích ứng cao với kỷ nguyên số.
                    </p>
                  </div>
                </div>

                {/* Sứ mệnh */}
                <div className="glass-card" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-5)', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(255, 109, 0, 0.08)', color: 'var(--color-gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Compass size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>Sứ Mệnh</h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', margin: 0, lineHeight: 1.5 }}>
                      Xây dựng môi trường giáo dục hạnh phúc và sáng tạo, khơi dậy tối đa tiềm năng riêng biệt của từng học sinh, trang bị đầy đủ kiến thức, đạo đức và kỹ năng lập nghiệp.
                    </p>
                  </div>
                </div>

                {/* Giá trị cốt lõi */}
                <div className="glass-card" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-5)', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(16, 185, 129, 0.08)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <ShieldCheck size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>Giá Trị Cốt Lõi</h3>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)', margin: 0, lineHeight: 1.5 }}>
                      Khát vọng học hỏi - Tư duy sáng tạo - Trách nhiệm bản thân - Tôn trọng sự khác biệt - Tự hào nguồn cội dân tộc.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Section Tin tức mới nhất */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-8)' }}>
            <div>
              <span className="section-label">Tin tức & Thông báo</span>
              <h2 className="section-title" style={{ margin: 0 }}>Tin Mới Nhất</h2>
            </div>
            <Link href="/tin-tuc" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>
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

      {/* 6. Section Sự kiện & Album ảnh */}
      <section className="section" style={{ background: 'var(--color-gray-50)', borderTop: '1px solid var(--color-gray-200)', borderBottom: '1px solid var(--color-gray-200)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-12)' }}>
            
            {/* Cột trái: Album ảnh */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 'var(--space-6)' }}>
                <div>
                  <span className="section-label">Thư viện đa phương tiện</span>
                  <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0, fontFamily: 'var(--font-title)' }}>
                    Hình Ảnh Hoạt Động
                  </h3>
                </div>
                <Link href="/hoat-dong?tab=gallery" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>
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
                  <h3 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0, fontFamily: 'var(--font-title)' }}>
                    Sự Kiện Sắp Tới
                  </h3>
                </div>
                <Link href="/hoat-dong?tab=calendar" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--color-primary)', fontWeight: 600, fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>
                  Lịch hoạt động
                  <ArrowRight size={16} />
                </Link>
              </div>
              <EventCalendar events={upcomingEvents as any} />
            </div>

          </div>
        </div>
      </section>

      {/* 7. Section Cơ hội học tập (Glass Card CTA khổng lồ) */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, #FFFFFF 0%, var(--color-gray-50) 100%)' }}>
        <div className="container">
          <div 
            className="glass-card" 
            style={{ 
              borderRadius: '32px', 
              padding: 'var(--space-10) var(--space-8)', 
              background: 'rgba(255, 255, 255, 0.85)', 
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.6)', 
              boxShadow: 'var(--shadow-xl)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--space-8)',
              alignItems: 'center'
            }}
          >
            {/* Trái: Giới thiệu tuyển sinh */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gold-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Tuyển Sinh Lớp 10 Niên Khóa 2026 - 2027
              </span>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0, lineHeight: 1.2, fontFamily: 'var(--font-title)' }}>
                Đăng Ký Học Tập Tại Edison School Minh Đức
              </h2>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-base)', lineHeight: 1.6, margin: 0 }}>
                Hồ sơ đăng ký tuyển sinh chính thức mở. Hãy chuẩn bị các tài liệu cần thiết và đăng ký tham gia kỳ xét tuyển để có cơ hội nhận các suất học bổng giá trị.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', fontWeight: 600 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(10, 75, 175, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</div>
                  <span>Chương trình giảng dạy ưu việt & tăng cường IELTS</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', fontWeight: 600 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(10, 75, 175, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</div>
                  <span>Học phí minh bạch, chính sách học bổng đa cấp độ</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', fontWeight: 600 }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(10, 75, 175, 0.1)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px' }}>✓</div>
                  <span>Môi trường học tập hạnh phúc, an toàn & khai phóng</span>
                </div>
              </div>
            </div>
            
            {/* Phải: Chi tiết các mục */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              {/* Box 1 */}
              <div className="glass-card" style={{ padding: 'var(--space-4)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid rgba(15, 23, 42, 0.04)', background: 'var(--color-white)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(10, 75, 175, 0.08)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={18} />
                </div>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Chương Trình Đào Tạo</h4>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-500)', lineHeight: 1.4 }}>Tích hợp phát triển kỹ năng ngoại ngữ, công nghệ & khoa học.</span>
              </div>

              {/* Box 2 */}
              <div className="glass-card" style={{ padding: 'var(--space-4)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid rgba(15, 23, 42, 0.04)', background: 'var(--color-white)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255, 109, 0, 0.08)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={18} />
                </div>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Học Phí & Học Bổng</h4>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-500)', lineHeight: 1.4 }}>Nhiều cơ hội học bổng dành cho học sinh có thành tích vượt trội.</span>
              </div>

              {/* Box 3 */}
              <div className="glass-card" style={{ padding: 'var(--space-4)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid rgba(15, 23, 42, 0.04)', background: 'var(--color-white)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.08)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClipboardList size={18} />
                </div>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Quy Trình Nhập Học</h4>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-500)', lineHeight: 1.4 }}>Hướng dẫn đăng ký trực tuyến, làm bài khảo sát năng lực.</span>
              </div>

              {/* Box 4 */}
              <div className="glass-card" style={{ padding: 'var(--space-4)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '6px', border: '1px solid rgba(15, 23, 42, 0.04)', background: 'var(--color-white)' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.08)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={18} />
                </div>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Hồ Sơ Cần Thiết</h4>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-500)', lineHeight: 1.4 }}>Bản sao học bạ THCS, giấy chứng nhận tốt nghiệp tạm thời.</span>
              </div>
            </div>
            
            {/* Nút bấm CTA */}
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link href="/tuyen-sinh" className="btn btn-gold btn-lg" style={{ padding: '14px 32px' }}>
                Đăng Ký Tuyển Sinh Ngay
                <ArrowRight size={18} />
              </Link>
              <Link href="/lien-he" className="btn btn-outline btn-lg" style={{ padding: '14px 32px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                Liên Hệ Nhận Tư Vấn
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section Testimonials */}
      <Testimonials />

    </div>
  )
}

