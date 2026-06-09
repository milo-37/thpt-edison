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
  const settingsList = await (prisma as any).setting.findMany()
  const settings: Record<string, string> = {
    missionImageUrl: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    schoolName: 'EDISON SCHOOL MINH DUC',
    logoUrl: '/school-logo.jpg',
  }
  settingsList.forEach((s: any) => {
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
            padding: 'var(--space-4) 0 0 0',
            position: 'relative',
            zIndex: 4,
            background: 'transparent',
            marginTop: '-30px',
          }}
        >
          <div className="container">
            <div 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-4)', 
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-blur)',
                WebkitBackdropFilter: 'var(--glass-blur)',
                border: '1px solid rgba(255, 107, 0, 0.15)',
                borderRadius: 'var(--radius-xl)',
                padding: '14px 24px',
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
                overflow: 'hidden',
                flexWrap: 'wrap'
              }}
            >
              <style>{`
                @keyframes pulseDotPing {
                  0% { transform: scale(1); opacity: 1; }
                  70%, 100% { transform: scale(2.2); opacity: 0; }
                }
                .pulse-dot-ping {
                  animation: pulseDotPing 2s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                @keyframes bellShake {
                  0%, 100% { transform: rotate(0); }
                  10%, 30%, 50%, 70%, 90% { transform: rotate(10deg); }
                  20%, 40%, 60%, 80% { transform: rotate(-10deg); }
                }
                .bell-shake-hover:hover .bell-shake {
                  animation: bellShake 1.2s ease-in-out infinite;
                }
                
                .bell-shake-auto {
                  animation: bellShake 2.5s ease-in-out infinite;
                  animation-delay: 1s;
                }

                .pinned-link-card {
                  font-size: var(--font-size-sm);
                  color: var(--color-gray-800);
                  font-weight: 600;
                  text-decoration: none;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  padding: 6px 16px;
                  background: rgba(10, 75, 175, 0.03);
                  border: 1px solid rgba(10, 75, 175, 0.06);
                  border-radius: 12px;
                  transition: all var(--transition-base);
                }
                .pinned-link-card:hover {
                  color: var(--color-navy) !important;
                  background: rgba(10, 75, 175, 0.08);
                  border-color: rgba(10, 75, 175, 0.15);
                  transform: translateY(-2px);
                  box-shadow: 0 4px 12px rgba(10, 75, 175, 0.05);
                }
                .pinned-link-card .chevron-icon {
                  transition: transform var(--transition-fast);
                  color: var(--color-gold);
                }
                .pinned-link-card:hover .chevron-icon {
                  transform: translateX(3px);
                }
              `}</style>

              {/* Decorative top-accent gradient line */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '3px', 
                  background: 'linear-gradient(90deg, var(--color-gold) 0%, var(--color-primary) 50%, var(--color-gold) 100%)',
                }} 
              />

              {/* Badge "THÔNG BÁO MỚI" */}
              <div 
                className="bell-shake-hover"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.12) 0%, rgba(255, 107, 0, 0.05) 100%)', 
                  color: 'var(--color-gold-dark)', 
                  padding: '6px 14px', 
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  border: '1px solid rgba(255, 107, 0, 0.2)',
                  cursor: 'default',
                  userSelect: 'none'
                }}
              >
                {/* Pulsing indicator dot */}
                <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                  <span className="pulse-dot-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: 'var(--color-gold)', opacity: 0.75 }}></span>
                  <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: 'var(--color-gold)' }}></span>
                </span>
                <Bell size={13} className="bell-shake-auto" />
                <span>THÔNG BÁO MỚI</span>
              </div>

              {/* Pinned Links */}
              <div style={{ display: 'flex', gap: 'var(--space-3)', flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {pinnedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/tin-tuc/${post.slug}`}
                    className="pinned-link-card"
                  >
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255, 107, 0, 0.1)', fontSize: '10px' }}>📌</span>
                    <span>{post.title}</span>
                    <span className="chevron-icon" style={{ fontSize: '12px', fontWeight: 'bold' }}>➔</span>
                  </Link>
                ))}
              </div>
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
                <span className="section-label">Hành trình khai phóng</span>
                <h2 className="section-title" style={{ margin: '8px 0 0 0' }}>Kiến tạo thế hệ tiên phong</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Tầm nhìn */}
                <div className="glass-card" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-5)', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.7)', border: '1px solid rgba(255,255,255,0.4)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(10, 75, 175, 0.08)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Eye size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>Tầm nhìn</h3>
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
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>Sứ mệnh</h3>
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
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px 0', fontFamily: 'var(--font-title)' }}>Giá trị cốt lõi</h3>
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
              <h2 className="section-title" style={{ margin: 0 }}>Tin mới nhất</h2>
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
                    Hình ảnh hoạt động
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
                    Sự kiện sắp tới
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
      <section className="section" style={{ position: 'relative', overflow: 'hidden', background: 'linear-gradient(180deg, var(--color-white) 0%, var(--color-gray-50) 100%)' }}>
        <style>{`
          .cta-info-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          .cta-info-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 20px -8px rgba(10, 75, 175, 0.12);
            border-color: var(--hover-border-color, var(--color-primary)) !important;
          }
          .cta-info-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            background: transparent;
            transition: background-color 0.3s ease;
          }
          .cta-info-card:hover::before {
            background: var(--theme-color, var(--color-primary));
          }
        `}</style>

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div 
            className="glass-card" 
            style={{ 
              borderRadius: '32px', 
              padding: 'var(--space-10) var(--space-8)', 
              background: 'var(--glass-bg)', 
              backdropFilter: 'blur(20px)',
              border: 'var(--glass-border)', 
              boxShadow: 'var(--shadow-xl)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: 'var(--space-8)',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Glowing background blobs */}
            <div style={{
              position: 'absolute',
              top: '-20%',
              right: '-10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)',
              zIndex: 0,
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-20%',
              left: '-10%',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(10,75,175,0.06) 0%, transparent 70%)',
              zIndex: 0,
              pointerEvents: 'none'
            }} />

            {/* Trái: Giới thiệu tuyển sinh + Nút bấm */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', position: 'relative', zIndex: 1 }}>
              <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gold-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                Tuyển sinh lớp 10 niên khóa 2026 - 2027
              </span>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0, lineHeight: 1.2, fontFamily: 'var(--font-title)' }}>
                Đăng ký học tập tại Edison School Minh Đức
              </h2>
              <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-base)', lineHeight: 1.6, margin: 0 }}>
                Hồ sơ đăng ký tuyển sinh chính thức mở. Hãy chuẩn bị các tài liệu cần thiết và đăng ký tham gia kỳ xét tuyển để có cơ hội nhận các suất học bổng giá trị.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-1)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', fontWeight: 600 }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Chương trình giảng dạy ưu việt & tăng cường IELTS</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', fontWeight: 600 }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Học phí minh bạch, chính sách học bổng đa cấp độ</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', fontWeight: 600 }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
                  <span>Môi trường học tập hạnh phúc, an toàn & khai phóng</span>
                </div>
              </div>

              {/* Nút bấm CTA (moved here to fill the left column) */}
              <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-3)', flexWrap: 'wrap' }}>
                <Link href="/tuyen-sinh" className="btn btn-gold btn-lg" style={{ padding: '14px 28px', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(255, 107, 0, 0.3)' }}>
                  Đăng ký tuyển sinh ngay
                  <ArrowRight size={18} />
                </Link>
                <Link href="/lien-he" className="btn btn-outline btn-lg" style={{ padding: '14px 28px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                  Liên hệ nhận tư vấn
                </Link>
              </div>
            </div>
            
            {/* Phải: Chi tiết các mục */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', position: 'relative', zIndex: 1 }}>
              {/* Box 1 */}
              <div 
                className="cta-info-card glass-card" 
                style={{ 
                  padding: 'var(--space-5) var(--space-4)', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px', 
                  border: '1px solid rgba(15, 23, 42, 0.06)', 
                  background: 'var(--color-white)',
                  // @ts-ignore
                  '--theme-color': 'var(--color-primary)',
                  '--hover-border-color': 'rgba(10, 75, 175, 0.2)'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(10, 75, 175, 0.08)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <BookOpen size={20} />
                </div>
                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Chương trình đào tạo</h4>
                <span style={{ fontSize: '12px', color: 'var(--color-gray-500)', lineHeight: 1.4 }}>Tích hợp phát triển kỹ năng ngoại ngữ, công nghệ & khoa học.</span>
              </div>

              {/* Box 2 */}
              <div 
                className="cta-info-card glass-card" 
                style={{ 
                  padding: 'var(--space-5) var(--space-4)', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px', 
                  border: '1px solid rgba(15, 23, 42, 0.06)', 
                  background: 'var(--color-white)',
                  // @ts-ignore
                  '--theme-color': 'var(--color-gold)',
                  '--hover-border-color': 'rgba(255, 107, 0, 0.2)'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(255, 109, 0, 0.08)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Award size={20} />
                </div>
                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Học phí & học bổng</h4>
                <span style={{ fontSize: '12px', color: 'var(--color-gray-500)', lineHeight: 1.4 }}>Nhiều cơ hội học bổng dành cho học sinh có thành tích vượt trội.</span>
              </div>

              {/* Box 3 */}
              <div 
                className="cta-info-card glass-card" 
                style={{ 
                  padding: 'var(--space-5) var(--space-4)', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px', 
                  border: '1px solid rgba(15, 23, 42, 0.06)', 
                  background: 'var(--color-white)',
                  // @ts-ignore
                  '--theme-color': 'var(--color-success)',
                  '--hover-border-color': 'rgba(16, 185, 129, 0.2)'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.08)', color: 'var(--color-success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ClipboardList size={20} />
                </div>
                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Quy trình nhập học</h4>
                <span style={{ fontSize: '12px', color: 'var(--color-gray-500)', lineHeight: 1.4 }}>Hướng dẫn đăng ký trực tuyến, làm bài khảo sát năng lực.</span>
              </div>

              {/* Box 4 */}
              <div 
                className="cta-info-card glass-card" 
                style={{ 
                  padding: 'var(--space-5) var(--space-4)', 
                  borderRadius: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  gap: '8px', 
                  border: '1px solid rgba(15, 23, 42, 0.06)', 
                  background: 'var(--color-white)',
                  // @ts-ignore
                  '--theme-color': 'rgba(59, 130, 246, 1)',
                  '--hover-border-color': 'rgba(59, 130, 246, 0.2)'
                }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.08)', color: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={20} />
                </div>
                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>Hồ sơ cần thiết</h4>
                <span style={{ fontSize: '12px', color: 'var(--color-gray-500)', lineHeight: 1.4 }}>Bản sao học bạ THCS, giấy chứng nhận tốt nghiệp tạm thời.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Section Testimonials */}
      <Testimonials />

    </div>
  )
}

