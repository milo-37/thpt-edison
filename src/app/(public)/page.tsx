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

      {/* 6. Section Sự kiện & Album ảnh - PREMIUM */}
      <section className="section" style={{ background: 'var(--color-gray-50)', position: 'relative', overflow: 'hidden' }}>
        <style>{`
          .section6-card-container {
            background: var(--color-white);
            border-radius: 24px;
            padding: var(--space-8);
            border: 1px solid var(--color-gray-100);
            box-shadow: 0 4px 24px rgba(15, 23, 42, 0.04);
            position: relative;
            overflow: hidden;
            transition: box-shadow 0.3s ease;
          }
          .section6-card-container:hover {
            box-shadow: 0 8px 32px rgba(15, 23, 42, 0.08);
          }
          .section6-card-container .accent-line {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            border-radius: 24px 24px 0 0;
          }
          .section6-header-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            padding: 5px 14px;
            border-radius: 999px;
            margin-bottom: var(--space-3);
          }
          .section6-title {
            font-size: var(--font-size-2xl);
            font-weight: 800;
            color: var(--color-navy);
            margin: 0 0 var(--space-2) 0;
            font-family: var(--font-title);
            line-height: 1.2;
          }
          .section6-subtitle {
            font-size: var(--font-size-sm);
            color: var(--color-gray-500);
            margin: 0 0 var(--space-6) 0;
            line-height: 1.5;
          }
          .section6-view-all {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: var(--font-size-sm);
            font-weight: 600;
            color: var(--color-primary);
            text-decoration: none;
            padding: 8px 20px;
            border-radius: 999px;
            background: rgba(10, 75, 175, 0.06);
            border: 1px solid rgba(10, 75, 175, 0.1);
            transition: all 0.25s ease;
          }
          .section6-view-all:hover {
            background: rgba(10, 75, 175, 0.12);
            transform: translateX(3px);
            border-color: rgba(10, 75, 175, 0.2);
          }
          @media (max-width: 768px) {
            .section6-grid-layout { grid-template-columns: 1fr !important; }
          }
        `}</style>
        {/* Subtle background pattern */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(10,75,175,0.05) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section6-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
            
            {/* Cột trái: Album ảnh */}
            <div className="section6-card-container">
              <div className="accent-line" style={{ background: 'linear-gradient(90deg, var(--color-primary), var(--color-gold))' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
                <div>
                  <div className="section6-header-badge" style={{ color: 'var(--color-primary)', background: 'rgba(10, 75, 175, 0.06)', border: '1px solid rgba(10, 75, 175, 0.1)' }}>
                    <Images size={13} />
                    Thư viện
                  </div>
                  <h3 className="section6-title">Hình ảnh hoạt động</h3>
                  <p className="section6-subtitle">Lưu giữ những khoảnh khắc đáng nhớ trong hành trình giáo dục Edison.</p>
                </div>
              </div>
              <GalleryGrid albums={latestAlbums} limit={4} />
              <div style={{ marginTop: 'var(--space-5)', textAlign: 'center' }}>
                <Link href="/hoat-dong?tab=gallery" className="section6-view-all">
                  Xem toàn bộ thư viện ảnh
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Cột phải: Lịch Sự kiện */}
            <div className="section6-card-container">
              <div className="accent-line" style={{ background: 'linear-gradient(90deg, var(--color-gold), var(--color-gold-dark))' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
                <div>
                  <div className="section6-header-badge" style={{ color: 'var(--color-gold-dark)', background: 'rgba(255, 107, 0, 0.06)', border: '1px solid rgba(255, 107, 0, 0.12)' }}>
                    <Calendar size={13} />
                    Lịch trình
                  </div>
                  <h3 className="section6-title">Sự kiện sắp tới</h3>
                  <p className="section6-subtitle">Các hoạt động, hội thảo và kỳ thi quan trọng trong năm học.</p>
                </div>
              </div>
              <EventCalendar events={upcomingEvents as any} />
              <div style={{ marginTop: 'var(--space-5)', textAlign: 'center' }}>
                <Link href="/hoat-dong?tab=calendar" className="section6-view-all" style={{ color: 'var(--color-gold-dark)', background: 'rgba(255, 107, 0, 0.06)', borderColor: 'rgba(255, 107, 0, 0.12)' }}>
                  Xem lịch hoạt động đầy đủ
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Section Tuyển sinh - FULL-WIDTH PREMIUM HERO */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @keyframes admissionGlow {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.1); }
          }
          @keyframes admissionFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }
          @keyframes admissionPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(255, 107, 0, 0.4); }
            70% { box-shadow: 0 0 0 15px rgba(255, 107, 0, 0); }
          }
          @keyframes admissionShimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          @keyframes statCountUp {
            from { opacity: 0; transform: translateY(12px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .admission-stat-card {
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 24px 20px;
            text-align: center;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            animation: statCountUp 0.6s ease-out both;
          }
          .admission-stat-card:nth-child(1) { animation-delay: 0.1s; }
          .admission-stat-card:nth-child(2) { animation-delay: 0.2s; }
          .admission-stat-card:nth-child(3) { animation-delay: 0.3s; }
          .admission-stat-card:nth-child(4) { animation-delay: 0.4s; }
          .admission-stat-card:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: translateY(-6px);
            border-color: rgba(255, 107, 0, 0.3);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.2);
          }
          .admission-stat-card::after {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.5), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .admission-stat-card:hover::after {
            opacity: 1;
          }
          .admission-stat-number {
            font-size: 36px;
            font-weight: 900;
            font-family: var(--font-title);
            background: linear-gradient(135deg, #FFD700, #FF6B00, #FFD700);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            margin-bottom: 4px;
          }
          .admission-stat-label {
            font-size: 13px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.7);
            letter-spacing: 0.5px;
          }
          .admission-feature-row {
            display: flex;
            align-items: center;
            gap: 14px;
            padding: 14px 18px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 14px;
            transition: all 0.3s ease;
          }
          .admission-feature-row:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 107, 0, 0.2);
            transform: translateX(6px);
          }
          .admission-feature-icon {
            width: 36px;
            height: 36px;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .admission-cta-primary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 16px 36px;
            background: linear-gradient(135deg, #FF6B00, #FF8C00, #FFB300);
            color: white;
            font-size: var(--font-size-base);
            font-weight: 800;
            border-radius: 999px;
            text-decoration: none;
            transition: all 0.3s ease;
            box-shadow: 0 6px 24px rgba(255, 107, 0, 0.4);
            animation: admissionPulse 2.5s ease-in-out infinite;
            position: relative;
            overflow: hidden;
          }
          .admission-cta-primary::before {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 200%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
            animation: admissionShimmer 3s ease-in-out infinite;
          }
          .admission-cta-primary:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 10px 36px rgba(255, 107, 0, 0.5);
          }
          .admission-cta-secondary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 16px 32px;
            background: transparent;
            color: white;
            font-size: var(--font-size-sm);
            font-weight: 700;
            border-radius: 999px;
            text-decoration: none;
            border: 2px solid rgba(255, 255, 255, 0.3);
            transition: all 0.3s ease;
          }
          .admission-cta-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.6);
            transform: translateY(-2px);
          }
          .admission-info-card {
            background: rgba(255, 255, 255, 0.06);
            backdrop-filter: blur(8px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 20px;
            padding: 28px 24px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
          }
          .admission-info-card:hover {
            background: rgba(255, 255, 255, 0.12);
            transform: translateY(-6px);
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.15);
          }
          .admission-info-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 3px;
            background: linear-gradient(90deg, var(--card-accent, var(--color-gold)), transparent);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .admission-info-card:hover::before {
            opacity: 1;
          }
          @media (max-width: 768px) {
            .admission-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .admission-info-grid { grid-template-columns: 1fr !important; }
            .admission-main-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Full-width Navy Gradient Background */}
        <div style={{
          background: 'linear-gradient(135deg, #041C3D 0%, #0A4BAF 40%, #083A88 70%, #041C3D 100%)',
          padding: 'var(--space-16, 80px) 0',
          position: 'relative'
        }}>
          {/* Animated glow orbs */}
          <div style={{
            position: 'absolute', top: '-10%', right: '5%',
            width: '500px', height: '500px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 107, 0, 0.12) 0%, transparent 60%)',
            animation: 'admissionGlow 6s ease-in-out infinite', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-15%', left: '0%',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(10, 75, 175, 0.2) 0%, transparent 60%)',
            animation: 'admissionGlow 8s ease-in-out infinite 2s', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', top: '40%', left: '50%',
            width: '300px', height: '300px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 215, 0, 0.06) 0%, transparent 60%)',
            animation: 'admissionFloat 7s ease-in-out infinite 1s', pointerEvents: 'none'
          }} />
          {/* Subtle grid pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.04, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            {/* Top Section Label */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15), rgba(255, 215, 0, 0.1))',
                border: '1px solid rgba(255, 107, 0, 0.25)',
                padding: '8px 24px', borderRadius: '999px',
                marginBottom: 'var(--space-4)'
              }}>
                <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                  <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#FF6B00', opacity: 0.75, animation: 'admissionPulse 2s ease-in-out infinite' }} />
                  <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: '#FF6B00' }} />
                </span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#FFB300', letterSpacing: '2px', textTransform: 'uppercase' }}>
                  Đang mở đăng ký tuyển sinh 2026 - 2027
                </span>
              </div>
              <h2 style={{
                fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: 'white',
                margin: '0 auto var(--space-3)', fontFamily: 'var(--font-title)',
                lineHeight: 1.15, maxWidth: '700px'
              }}>
                Khởi đầu hành trình <br/>
                <span style={{
                  background: 'linear-gradient(135deg, #FFD700, #FF6B00)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>
                  tại Edison School
                </span>
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.6)', fontSize: 'var(--font-size-base)',
                maxWidth: '580px', margin: '0 auto', lineHeight: 1.7
              }}>
                Hồ sơ đăng ký tuyển sinh lớp 10 chính thức mở. Hãy nắm bắt cơ hội trở thành học sinh Edison với chính sách học bổng hấp dẫn.
              </p>
            </div>

            {/* Stats Row */}
            <div className="admission-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-10)', maxWidth: '800px', margin: '0 auto var(--space-10)' }}>
              <div className="admission-stat-card">
                <div className="admission-stat-number">450+</div>
                <div className="admission-stat-label">Chỉ tiêu tuyển sinh</div>
              </div>
              <div className="admission-stat-card">
                <div className="admission-stat-number">10</div>
                <div className="admission-stat-label">Lớp học chính quy</div>
              </div>
              <div className="admission-stat-card">
                <div className="admission-stat-number">98%</div>
                <div className="admission-stat-label">Tỷ lệ đỗ TN THPT</div>
              </div>
              <div className="admission-stat-card">
                <div className="admission-stat-number">2</div>
                <div className="admission-stat-label">Lớp CLC Quốc tế</div>
              </div>
            </div>

            {/* Main 2-column content */}
            <div className="admission-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'start' }}>

              {/* Left: Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'white', margin: '0 0 var(--space-2) 0', fontFamily: 'var(--font-title)' }}>
                  Tại sao chọn Edison?
                </h3>
                <div className="admission-feature-row">
                  <div className="admission-feature-icon" style={{ background: 'rgba(255, 107, 0, 0.15)', color: '#FFB300' }}>
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'white', marginBottom: '2px' }}>Chương trình tăng cường IELTS & STEM</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>Tích hợp ngoại ngữ, công nghệ thông tin và khoa học ứng dụng.</div>
                  </div>
                </div>
                <div className="admission-feature-row">
                  <div className="admission-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                    <Award size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'white', marginBottom: '2px' }}>Học bổng lên đến 100% học phí</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>Dành cho học sinh xuất sắc, HSG cấp tỉnh/thành phố, IELTS 6.5+.</div>
                  </div>
                </div>
                <div className="admission-feature-row">
                  <div className="admission-feature-icon" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'white', marginBottom: '2px' }}>Môi trường giáo dục hạnh phúc & an toàn</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>Cơ sở vật chất hiện đại, đội ngũ giáo viên tâm huyết.</div>
                  </div>
                </div>
                <div className="admission-feature-row">
                  <div className="admission-feature-icon" style={{ background: 'rgba(168, 85, 247, 0.15)', color: '#C084FC' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'white', marginBottom: '2px' }}>Đa dạng phương thức xét tuyển</div>
                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>Thi tuyển, xét tuyển thẳng, xét học bạ THCS.</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div style={{ display: 'flex', gap: 'var(--space-4)', marginTop: 'var(--space-4)', flexWrap: 'wrap' }}>
                  <Link href="/tuyen-sinh" className="admission-cta-primary">
                    Đăng ký tuyển sinh ngay
                    <ArrowRight size={18} />
                  </Link>
                  <Link href="/lien-he" className="admission-cta-secondary">
                    Liên hệ tư vấn
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Right: Info cards grid */}
              <div className="admission-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                {/* Card 1 */}
                <div className="admission-info-card" style={{ '--card-accent': '#FF6B00' } as React.CSSProperties}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.2), rgba(255, 179, 0, 0.1))', color: '#FFB300', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={22} />
                  </div>
                  <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'white', margin: 0 }}>Chương trình đào tạo</h4>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Giáo dục toàn diện theo chuẩn quốc tế, tăng cường kỹ năng thế kỷ 21.</span>
                </div>
                {/* Card 2 */}
                <div className="admission-info-card" style={{ '--card-accent': '#34D399' } as React.CSSProperties}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(52, 211, 153, 0.1))', color: '#34D399', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={22} />
                  </div>
                  <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'white', margin: 0 }}>Học phí & Học bổng</h4>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Chính sách học phí linh hoạt, học bổng giá trị cho học sinh tài năng.</span>
                </div>
                {/* Card 3 */}
                <div className="admission-info-card" style={{ '--card-accent': '#60A5FA' } as React.CSSProperties}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(96, 165, 250, 0.1))', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ClipboardList size={22} />
                  </div>
                  <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'white', margin: 0 }}>Quy trình nhập học</h4>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Đăng ký trực tuyến → Khảo sát → Xét duyệt → Nhập học chính thức.</span>
                </div>
                {/* Card 4 */}
                <div className="admission-info-card" style={{ '--card-accent': '#C084FC' } as React.CSSProperties}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(192, 132, 252, 0.1))', color: '#C084FC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={22} />
                  </div>
                  <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'white', margin: 0 }}>Hồ sơ cần thiết</h4>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>Học bạ THCS, giấy CN tốt nghiệp tạm thời, ảnh 3x4 và đơn đăng ký.</span>
                </div>
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

