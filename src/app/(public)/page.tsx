import prisma from '@/lib/prisma'
import HeroBanner from '@/components/public/HeroBanner'
import NewsCard from '@/components/public/NewsCard'
import EventCalendar from '@/components/public/EventCalendar'
import GalleryGrid from '@/components/public/GalleryGrid'
import QuickStats from '@/components/public/QuickStats'
import Testimonials from '@/components/public/Testimonials'
import Link from 'next/link'
import { ArrowRight, Bell, Calendar, Eye, Compass, ShieldCheck, CheckCircle2, Award, ClipboardList, BookOpen, Images, GraduationCap } from 'lucide-react'

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
                border: '1px solid rgba(99, 102, 241, 0.15)',
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
                  background: rgba(99, 102, 241, 0.04);
                  border: 1px solid rgba(99, 102, 241, 0.08);
                  border-radius: 12px;
                  transition: all var(--transition-base);
                }
                .pinned-link-card:hover {
                  color: #4f46e5 !important;
                  background: rgba(99, 102, 241, 0.08);
                  border-color: rgba(99, 102, 241, 0.2);
                  transform: translateY(-2px);
                  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
                }
                .pinned-link-card .chevron-icon {
                  transition: transform var(--transition-fast);
                  color: #6366f1;
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
                  background: 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 50%, #6366f1 100%)',
                }} 
              />

              {/* Badge "THÔNG BÁO MỚI" */}
              <div 
                className="bell-shake-hover"
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px', 
                  background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(139, 92, 246, 0.06) 100%)', 
                  color: '#4f46e5', 
                  padding: '6px 14px', 
                  borderRadius: '9999px',
                  fontSize: '11px',
                  fontWeight: 800,
                  letterSpacing: '1px',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                  cursor: 'default',
                  userSelect: 'none'
                }}
              >
                {/* Pulsing indicator dot */}
                <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                  <span className="pulse-dot-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#6366f1', opacity: 0.75 }}></span>
                  <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: '#6366f1' }}></span>
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
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.1)', fontSize: '10px' }}>📌</span>
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
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(79, 70, 229, 0.2) 0%, transparent 60%)' }} />
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
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(99, 102, 241, 0.08)', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'rgba(168, 85, 247, 0.08)', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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

      {/* 6. Section Sự kiện & Album ảnh - FUTURISTIC PREMIUM */}
      <section className="section" style={{ background: 'var(--color-gray-50)', position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @keyframes s6MeshGradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes s6Float {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(2deg); }
          }
          .section6-card-container {
            background: var(--color-white);
            border-radius: 28px;
            padding: 32px;
            position: relative;
            overflow: hidden;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 24px rgba(15, 23, 42, 0.04);
          }
          .section6-card-container::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 28px;
            padding: 1.5px;
            background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.1), rgba(99, 102, 241, 0.05));
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
          }
          .section6-card-container:hover {
            box-shadow: 0 16px 48px rgba(79, 70, 229, 0.08), 0 0 0 1px rgba(99, 102, 241, 0.06);
            transform: translateY(-4px);
          }
          .section6-card-container .accent-line {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            border-radius: 28px 28px 0 0;
          }
          .section6-header-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 10px;
            font-weight: 800;
            text-transform: uppercase;
            letter-spacing: 2px;
            padding: 5px 14px;
            border-radius: 999px;
            margin-bottom: var(--space-3);
          }
          .section6-title {
            font-size: clamp(1.4rem, 3vw, var(--font-size-2xl));
            font-weight: 800;
            color: var(--color-navy);
            margin: 0 0 var(--space-1) 0;
            font-family: var(--font-title);
            line-height: 1.2;
            letter-spacing: -0.02em;
            position: relative;
            display: inline-block;
          }
          .section6-title-underline {
            display: block;
            width: 48px;
            height: 3px;
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
            border-radius: 3px;
            margin-top: 8px;
            margin-bottom: 4px;
            transition: width 0.3s ease;
          }
          .section6-card-container:hover .section6-title-underline {
            width: 72px;
          }
          .section6-subtitle {
            font-size: 14px;
            color: var(--color-gray-400);
            margin: 0 0 var(--space-6) 0;
            line-height: 1.6;
            max-width: 400px;
          }
          .section6-view-all {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            font-weight: 600;
            color: #4f46e5;
            text-decoration: none;
            padding: 10px 24px;
            border-radius: 999px;
            background: rgba(99, 102, 241, 0.04);
            border: 1px solid rgba(99, 102, 241, 0.1);
          }
          .section6-view-all:hover {
            background: rgba(99, 102, 241, 0.1);
            transform: translateX(4px);
            border-color: rgba(99, 102, 241, 0.25);
            box-shadow: 0 4px 12px rgba(99, 102, 241, 0.08);
          }
          @media (max-width: 768px) {
            .section6-grid-layout { grid-template-columns: 1fr !important; }
            .section6-card-container { padding: 24px !important; }
          }
        `}</style>

        {/* Animated mesh background */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none',
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.04) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
        {/* Floating accent orbs */}
        <div style={{
          position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, transparent 70%)',
          animation: 's6Float 12s ease-in-out infinite', pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute', bottom: '-15%', left: '-8%', width: '350px', height: '350px',
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.06) 0%, transparent 70%)',
          animation: 's6Float 15s ease-in-out infinite 3s', pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section6-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
            
            {/* Cột trái: Album ảnh */}
            <div className="section6-card-container">
              <div className="accent-line" style={{ background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #6366f1)' }} />
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <div className="section6-header-badge" style={{ color: '#4f46e5', background: 'rgba(99, 102, 241, 0.06)', border: '1px solid rgba(99, 102, 241, 0.1)' }}>
                  <Images size={12} />
                  Thư viện ảnh
                </div>
                <h3 className="section6-title">Hình ảnh hoạt động</h3>
                <div className="section6-title-underline" />
                <p className="section6-subtitle">Lưu giữ những khoảnh khắc đáng nhớ trong hành trình giáo dục Edison.</p>
              </div>
              <GalleryGrid albums={latestAlbums} limit={4} />
              <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                <Link href="/hoat-dong?tab=gallery" className="section6-view-all">
                  Xem toàn bộ thư viện ảnh
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

            {/* Cột phải: Lịch Sự kiện */}
            <div className="section6-card-container">
              <div className="accent-line" style={{ background: 'linear-gradient(90deg, #8b5cf6, #6366f1, #8b5cf6)' }} />
              <div style={{ marginBottom: 'var(--space-5)' }}>
                <div className="section6-header-badge" style={{ color: '#7c3aed', background: 'rgba(168, 85, 247, 0.06)', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                  <Calendar size={12} />
                  Lịch trình
                </div>
                <h3 className="section6-title">Sự kiện sắp tới</h3>
                <div className="section6-title-underline" style={{ background: 'linear-gradient(90deg, #8b5cf6, #6366f1)' }} />
                <p className="section6-subtitle">Các hoạt động, hội thảo và kỳ thi quan trọng trong năm học.</p>
              </div>
              <EventCalendar events={upcomingEvents as any} />
              <div style={{ marginTop: 'var(--space-6)', textAlign: 'center' }}>
                <Link href="/hoat-dong?tab=calendar" className="section6-view-all" style={{ color: '#7c3aed', background: 'rgba(168, 85, 247, 0.04)', borderColor: 'rgba(168, 85, 247, 0.1)' }}>
                  Xem lịch hoạt động đầy đủ
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. Section Tuyển sinh - FUTURISTIC PREMIUM */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>
        <style>{`
          @keyframes admissionGlow {
            0%, 100% { opacity: 0.25; transform: scale(1); }
            50% { opacity: 0.55; transform: scale(1.15); }
          }
          @keyframes admissionFloat {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(1deg); }
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
            from { opacity: 0; transform: translateY(16px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes auroraShift {
            0%, 100% { background-position: 0% 50%; }
            25% { background-position: 50% 0%; }
            50% { background-position: 100% 50%; }
            75% { background-position: 50% 100%; }
          }

          /* Stat Cards */
          .admission-stat-card {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.05);
            border-radius: 24px;
            padding: 32px 24px 28px;
            text-align: center;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
            animation: statCountUp 0.6s ease-out both;
          }
          .admission-stat-card:nth-child(1) { animation-delay: 0.1s; }
          .admission-stat-card:nth-child(2) { animation-delay: 0.2s; }
          .admission-stat-card:nth-child(3) { animation-delay: 0.3s; }
          .admission-stat-card:nth-child(4) { animation-delay: 0.4s; }
          .admission-stat-card:hover {
            background: rgba(255, 255, 255, 0.06);
            transform: translateY(-10px) scale(1.02);
            border-color: rgba(255, 107, 0, 0.3);
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 0 30px rgba(255, 107, 0, 0.15);
          }
          .admission-stat-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0; right: 0;
            height: 3px;
            background: linear-gradient(90deg, transparent, rgba(255, 107, 0, 0.4), rgba(255, 215, 0, 0.3), transparent);
            opacity: 0;
            transition: opacity 0.4s ease;
          }
          .admission-stat-card:hover::before {
            opacity: 1;
          }
          .admission-stat-icon-ring {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 16px;
            position: relative;
            background: rgba(255, 255, 255, 0.04);
            border: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .admission-stat-card:hover .admission-stat-icon-ring {
            transform: scale(1.15) rotate(5deg);
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.15);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.05);
          }
          .admission-stat-number {
            font-size: 44px;
            font-weight: 900;
            font-family: var(--font-title);
            background: linear-gradient(135deg, #FFF5C0 0%, #FFB300 50%, #FF6B00 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            margin-bottom: 8px;
            letter-spacing: -0.03em;
            text-shadow: 0 0 20px rgba(255, 107, 0, 0.1);
          }
          .admission-stat-label {
            font-size: 13px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.55);
            letter-spacing: 0.3px;
            line-height: 1.4;
          }

          /* Feature Rows */
          .admission-feature-row {
            display: flex;
            align-items: flex-start;
            gap: 18px;
            padding: 20px 24px;
            background: rgba(255, 255, 255, 0.02);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 20px;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            backdrop-filter: blur(12px);
          }
          .admission-feature-row:hover {
            background: rgba(255, 255, 255, 0.06);
            border-color: var(--row-accent, rgba(255, 107, 0, 0.2)) !important;
            transform: translateX(8px);
            box-shadow: 0 16px 36px var(--row-glow, rgba(0, 0, 0, 0.15));
          }
          .admission-feature-row::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 0;
            background: linear-gradient(to bottom, var(--row-accent, var(--color-gold)), transparent);
            border-radius: 4px;
            transition: height 0.35s ease;
          }
          .admission-feature-row:hover::before {
            height: 50%;
          }
          .admission-feature-icon {
            width: 44px;
            height: 44px;
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            position: relative;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .admission-feature-row:hover .admission-feature-icon {
            transform: scale(1.12);
            box-shadow: 0 0 20px var(--row-glow);
          }

          /* CTA Buttons */
          .admission-cta-primary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 16px 40px;
            background: linear-gradient(135deg, #FF6B00, #FF8C00, #FFB300);
            color: white;
            font-size: var(--font-size-base);
            font-weight: 800;
            border-radius: 999px;
            text-decoration: none;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 6px 28px rgba(255, 107, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.15);
            animation: admissionPulse 3s ease-in-out infinite;
            position: relative;
            overflow: hidden;
            letter-spacing: 0.3px;
          }
          .admission-cta-primary::before {
            content: '';
            position: absolute;
            top: 0; left: -100%;
            width: 200%; height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent);
            animation: admissionShimmer 3.5s ease-in-out infinite;
          }
          .admission-cta-primary:hover {
            transform: translateY(-3px) scale(1.03);
            box-shadow: 0 12px 40px rgba(255, 107, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          .admission-cta-secondary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 16px 32px;
            background: rgba(255, 255, 255, 0.04);
            color: white;
            font-size: var(--font-size-sm);
            font-weight: 700;
            border-radius: 999px;
            text-decoration: none;
            border: 1.5px solid rgba(255, 255, 255, 0.2);
            transition: all 0.3s ease;
            backdrop-filter: blur(8px);
          }
          .admission-cta-secondary:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          }

          /* Info Cards */
          .admission-info-card {
            background: rgba(255, 255, 255, 0.02);
            backdrop-filter: blur(16px);
            border: 1px solid rgba(255, 255, 255, 0.04);
            border-radius: 24px;
            padding: 32px 28px;
            display: flex;
            flex-direction: column;
            gap: 14px;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
          }
          .admission-info-card::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 3px;
            background: linear-gradient(90deg, var(--card-accent, var(--color-gold)), transparent);
            opacity: 0;
            transition: opacity 0.35s ease;
          }
          .admission-info-card::after {
            content: '';
            position: absolute;
            top: -50%; right: -50%;
            width: 100%; height: 100%;
            background: radial-gradient(circle, var(--card-glow, rgba(255, 107, 0, 0.04)) 0%, transparent 70%);
            pointer-events: none;
            transition: opacity 0.45s ease;
            opacity: 0;
          }
          .admission-info-card:hover {
            background: rgba(255, 255, 255, 0.07);
            transform: translateY(-8px) scale(1.01);
            border-color: var(--card-accent, rgba(255, 255, 255, 0.15)) !important;
            box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35), 0 0 30px var(--card-glow);
          }
          .admission-info-card:hover::before {
            opacity: 1;
          }
          .admission-info-card:hover::after {
            opacity: 1;
          }
          .admission-info-card-icon {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .admission-info-card:hover .admission-info-card-icon {
            transform: scale(1.15) rotate(4deg);
            box-shadow: 0 0 20px var(--card-glow);
          }

          /* Responsive */
          @media (max-width: 768px) {
            .admission-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .admission-info-grid { grid-template-columns: 1fr !important; }
            .admission-main-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Full-width Background with Aurora Effect */}
        <div style={{
          background: 'linear-gradient(160deg, #020B1A 0%, #041C3D 20%, #0A4BAF 45%, #083A88 65%, #041C3D 85%, #020B1A 100%)',
          padding: 'var(--space-20, 100px) 0',
          position: 'relative'
        }}>
          {/* Aurora mesh overlay */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(255, 107, 0, 0.2) 25%, rgba(139, 92, 246, 0.15) 50%, rgba(255, 215, 0, 0.1) 75%, rgba(59, 130, 246, 0.2) 100%)',
            backgroundSize: '400% 400%',
            animation: 'auroraShift 20s ease-in-out infinite',
          }} />

          {/* Animated glow orbs */}
          <div style={{
            position: 'absolute', top: '-15%', right: '0%',
            width: '600px', height: '600px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 107, 0, 0.1) 0%, transparent 55%)',
            animation: 'admissionGlow 8s ease-in-out infinite', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', bottom: '-20%', left: '-5%',
            width: '700px', height: '700px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(10, 75, 175, 0.15) 0%, transparent 55%)',
            animation: 'admissionGlow 10s ease-in-out infinite 3s', pointerEvents: 'none'
          }} />
          <div style={{
            position: 'absolute', top: '30%', left: '60%',
            width: '350px', height: '350px', borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.06) 0%, transparent 60%)',
            animation: 'admissionFloat 9s ease-in-out infinite 1s', pointerEvents: 'none'
          }} />

          {/* Grid pattern */}
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03, pointerEvents: 'none',
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }} />

          <div className="container" style={{ position: 'relative', zIndex: 2 }}>
            {/* Top Section - Header */}
            <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: '10px',
                background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.12), rgba(255, 215, 0, 0.08))',
                border: '1px solid rgba(255, 107, 0, 0.2)',
                padding: '8px 24px', borderRadius: '999px',
                marginBottom: 'var(--space-5)',
                backdropFilter: 'blur(8px)',
              }}>
                <span style={{ position: 'relative', display: 'flex', height: '8px', width: '8px' }}>
                  <span style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', backgroundColor: '#FF6B00', opacity: 0.75, animation: 'admissionPulse 2s ease-in-out infinite' }} />
                  <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '8px', width: '8px', backgroundColor: '#FF6B00' }} />
                </span>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#FFB300', letterSpacing: '2.5px', textTransform: 'uppercase' }}>
                  Đang mở đăng ký tuyển sinh 2026 – 2027
                </span>
              </div>
              <h2 style={{
                fontSize: 'clamp(30px, 4.5vw, 48px)', fontWeight: 900, color: 'white',
                margin: '0 auto var(--space-4)', fontFamily: 'var(--font-title)',
                lineHeight: 1.1, maxWidth: '750px', letterSpacing: '-0.03em'
              }}>
                Khởi đầu hành trình <br/>
                <span style={{
                  background: 'linear-gradient(135deg, #FFD700, #FF6B00, #FF8C00)',
                  backgroundSize: '200% auto',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'
                }}>
                  tại Edison School
                </span>
              </h2>
              <p style={{
                color: 'rgba(255, 255, 255, 0.55)', fontSize: 'var(--font-size-base)',
                maxWidth: '560px', margin: '0 auto', lineHeight: 1.7, letterSpacing: '0.01em'
              }}>
                Hồ sơ đăng ký tuyển sinh lớp 10 chính thức mở. Hãy nắm bắt cơ hội trở thành học sinh Edison với chính sách học bổng hấp dẫn.
              </p>
            </div>

            {/* Stats Row */}
            <div className="admission-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: 'var(--space-12)', maxWidth: '860px', margin: '0 auto var(--space-12)' }}>
              <div className="admission-stat-card">
                <div className="admission-stat-icon-ring" style={{ background: 'rgba(255, 107, 0, 0.08)' }}>
                  <GraduationCap size={20} style={{ color: '#FFB300' }} />
                </div>
                <div className="admission-stat-number">450+</div>
                <div className="admission-stat-label">Chỉ tiêu tuyển sinh</div>
              </div>
              <div className="admission-stat-card">
                <div className="admission-stat-icon-ring" style={{ background: 'rgba(59, 130, 246, 0.08)' }}>
                  <BookOpen size={20} style={{ color: '#60A5FA' }} />
                </div>
                <div className="admission-stat-number">10</div>
                <div className="admission-stat-label">Lớp học chính quy</div>
              </div>
              <div className="admission-stat-card">
                <div className="admission-stat-icon-ring" style={{ background: 'rgba(16, 185, 129, 0.08)' }}>
                  <Award size={20} style={{ color: '#34D399' }} />
                </div>
                <div className="admission-stat-number">98%</div>
                <div className="admission-stat-label">Tỷ lệ đỗ TN THPT</div>
              </div>
              <div className="admission-stat-card">
                <div className="admission-stat-icon-ring" style={{ background: 'rgba(168, 85, 247, 0.08)' }}>
                  <ShieldCheck size={20} style={{ color: '#C084FC' }} />
                </div>
                <div className="admission-stat-number">2</div>
                <div className="admission-stat-label">Lớp CLC Quốc tế</div>
              </div>
            </div>

            {/* Main 2-column content */}
            <div className="admission-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

              {/* Left: Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
                <div style={{ marginBottom: 'var(--space-2)' }}>
                  <h3 style={{ fontSize: 'clamp(1.3rem, 2.5vw, var(--font-size-2xl))', fontWeight: 800, color: 'white', margin: '0 0 var(--space-2) 0', fontFamily: 'var(--font-title)', letterSpacing: '-0.02em' }}>
                    Tại sao chọn Edison?
                  </h3>
                  <div style={{ width: '40px', height: '3px', background: 'linear-gradient(90deg, var(--color-gold), var(--color-primary))', borderRadius: '3px' }} />
                </div>

                <div className="admission-feature-row" style={{ '--row-accent': '#FFB300', '--row-glow': 'rgba(255, 179, 0, 0.08)' } as React.CSSProperties}>
                  <div className="admission-feature-icon" style={{ background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15), rgba(255, 179, 0, 0.08))', color: '#FFB300', border: '1px solid rgba(255, 107, 0, 0.1)' }}>
                    <BookOpen size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '4px', lineHeight: 1.3 }}>Chương trình tăng cường IELTS & STEM</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Tích hợp ngoại ngữ, công nghệ thông tin và khoa học ứng dụng.</div>
                  </div>
                </div>
                <div className="admission-feature-row" style={{ '--row-accent': '#34D399', '--row-glow': 'rgba(16, 185, 129, 0.08)' } as React.CSSProperties}>
                  <div className="admission-feature-icon" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.08))', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                    <Award size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '4px', lineHeight: 1.3 }}>Học bổng lên đến 100% học phí</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Dành cho học sinh xuất sắc, HSG cấp tỉnh/thành phố, IELTS 6.5+.</div>
                  </div>
                </div>
                <div className="admission-feature-row" style={{ '--row-accent': '#60A5FA', '--row-glow': 'rgba(59, 130, 246, 0.08)' } as React.CSSProperties}>
                  <div className="admission-feature-icon" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(96, 165, 250, 0.08))', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <ShieldCheck size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '4px', lineHeight: 1.3 }}>Môi trường giáo dục hạnh phúc & an toàn</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Cơ sở vật chất hiện đại, đội ngũ giáo viên tâm huyết.</div>
                  </div>
                </div>
                <div className="admission-feature-row" style={{ '--row-accent': '#C084FC', '--row-glow': 'rgba(168, 85, 247, 0.08)' } as React.CSSProperties}>
                  <div className="admission-feature-icon" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(192, 132, 252, 0.08))', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                    <CheckCircle2 size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: 'white', marginBottom: '4px', lineHeight: 1.3 }}>Đa dạng phương thức xét tuyển</div>
                    <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>Thi tuyển, xét tuyển thẳng, xét học bạ THCS.</div>
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
              <div className="admission-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {/* Card 1 */}
                <div className="admission-info-card" style={{ '--card-accent': '#FF6B00', '--card-glow': 'rgba(255, 107, 0, 0.06)' } as React.CSSProperties}>
                  <div className="admission-info-card-icon" style={{ background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.15), rgba(255, 179, 0, 0.08))', color: '#FFB300', border: '1px solid rgba(255, 107, 0, 0.1)' }}>
                    <BookOpen size={22} />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.3 }}>Chương trình đào tạo</h4>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Giáo dục toàn diện theo chuẩn quốc tế, tăng cường kỹ năng thế kỷ 21.</span>
                </div>
                {/* Card 2 */}
                <div className="admission-info-card" style={{ '--card-accent': '#34D399', '--card-glow': 'rgba(16, 185, 129, 0.06)' } as React.CSSProperties}>
                  <div className="admission-info-card-icon" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(52, 211, 153, 0.08))', color: '#34D399', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
                    <Award size={22} />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.3 }}>Học phí & Học bổng</h4>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Chính sách học phí linh hoạt, học bổng giá trị cho học sinh tài năng.</span>
                </div>
                {/* Card 3 */}
                <div className="admission-info-card" style={{ '--card-accent': '#60A5FA', '--card-glow': 'rgba(59, 130, 246, 0.06)' } as React.CSSProperties}>
                  <div className="admission-info-card-icon" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(96, 165, 250, 0.08))', color: '#60A5FA', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                    <ClipboardList size={22} />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.3 }}>Quy trình nhập học</h4>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Đăng ký trực tuyến → Khảo sát → Xét duyệt → Nhập học chính thức.</span>
                </div>
                {/* Card 4 */}
                <div className="admission-info-card" style={{ '--card-accent': '#C084FC', '--card-glow': 'rgba(168, 85, 247, 0.06)' } as React.CSSProperties}>
                  <div className="admission-info-card-icon" style={{ background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(192, 132, 252, 0.08))', color: '#C084FC', border: '1px solid rgba(168, 85, 247, 0.1)' }}>
                    <Calendar size={22} />
                  </div>
                  <h4 style={{ fontSize: '15px', fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.3 }}>Hồ sơ cần thiết</h4>
                  <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6 }}>Học bạ THCS, giấy CN tốt nghiệp tạm thời, ảnh 3x4 và đơn đăng ký.</span>
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

