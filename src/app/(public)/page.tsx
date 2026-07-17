import prisma from '@/lib/prisma'
import HeroBanner from '@/components/public/HeroBanner'
import NewsCard from '@/components/public/NewsCard'
import EventCalendar from '@/components/public/EventCalendar'
import GalleryGrid from '@/components/public/GalleryGrid'
import QuickStats from '@/components/public/QuickStats'
import Testimonials from '@/components/public/Testimonials'
import Link from 'next/link'
import { ArrowRight, Bell, Calendar, Eye, Compass, ShieldCheck, CheckCircle2, Award, ClipboardList, BookOpen, Images, GraduationCap, Users, UserCheck } from 'lucide-react'

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
  let admissionStats = [
    { value: '450', suffix: '+', label: 'Chỉ tiêu tuyển sinh', icon: 'GraduationCap' },
    { value: '10', suffix: '', label: 'Lớp học chính quy', icon: 'BookOpen' },
    { value: '98', suffix: '%', label: 'Tỷ lệ đỗ TN THPT', icon: 'Award' },
    { value: '2', suffix: '', label: 'Lớp CLC Quốc tế', icon: 'ShieldCheck' }
  ]
  let quickStats = [
    { value: '1.500', suffix: '+', label: 'Học sinh đang theo học', icon: 'Users' },
    { value: '120', suffix: '+', label: 'Giáo viên chuyên môn', icon: 'UserCheck' },
    { value: '30', suffix: '+', label: 'Phòng học hiện đại', icon: 'BookOpen' },
    { value: '98', suffix: '%', label: 'Tỷ lệ đỗ Đại học', icon: 'GraduationCap' }
  ]

  settingsList.forEach((s: any) => {
    settings[s.key] = s.value
    if (s.key === 'admissionStats') {
      try { admissionStats = JSON.parse(s.value) } catch (e) {}
    }
    if (s.key === 'quickStats') {
      try { quickStats = JSON.parse(s.value) } catch (e) {}
    }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* 1. Hero Banner */}
      <HeroBanner slides={slides} />

      {/* 2. Section Thống Kê Nổi Bật (Quick Stats) */}
      <QuickStats stats={quickStats} />

      {/* 3. Section Thông báo quan trọng (nếu có) */}
      {pinnedPosts.length > 0 && (
        <section 
          style={{ 
            padding: 'var(--space-4) 0 0 0',
            position: 'relative',
            zIndex: 4,
            background: 'transparent',
            marginTop: '-45px',
          }}
        >
          <div className="container">
            <div 
              className="pinned-container"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--space-4)', 
                background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)',
                backdropFilter: 'blur(4px)',
                WebkitBackdropFilter: 'blur(4px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '20px',
                padding: '16px 24px',
                boxShadow: '0 25px 50px -12px rgba(67, 56, 202, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)',
                position: 'relative',
                overflow: 'hidden',
                flexWrap: 'wrap'
              }}
            >
              <style>{`
                @keyframes pulseDotPing {
                  0% { transform: scale(1); opacity: 1; }
                  70%, 100% { transform: scale(3); opacity: 0; }
                }
                .pulse-dot-ping {
                  animation: pulseDotPing 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
                }
                
                @keyframes bellShake {
                  0%, 100% { transform: rotate(0); }
                  10%, 30%, 50%, 70%, 90% { transform: rotate(15deg); }
                  20%, 40%, 60%, 80% { transform: rotate(-15deg); }
                }
                .bell-shake-hover:hover .bell-shake-auto {
                  animation: bellShake 0.6s ease-in-out infinite;
                }
                .bell-shake-auto {
                  animation: bellShake 2.5s ease-in-out infinite;
                  animation-delay: 1s;
                }

                @keyframes shimmer {
                  0% { transform: translateX(-150%) skewX(-20deg); }
                  100% { transform: translateX(250%) skewX(-20deg); }
                }

                .pinned-container::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: -50%;
                  width: 30%;
                  height: 100%;
                  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                  animation: shimmer 5s infinite;
                  pointer-events: none;
                }

                .pinned-link-card {
                  font-size: 14px;
                  color: #e0e7ff;
                  font-weight: 600;
                  text-decoration: none;
                  display: flex;
                  align-items: center;
                  gap: 10px;
                  padding: 8px 18px;
                  background: var(--glass-bg);
                  border: 1px solid rgba(255, 255, 255, 0.2);
                  border-radius: 99px;
                  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                  position: relative;
                  overflow: hidden;
                  backdrop-filter: blur(8px);
                }
                
                .pinned-link-card:hover {
                  color: #ffffff !important;
                  border-color: rgba(255, 255, 255, 0.6);
                  transform: translateY(-3px);
                  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(236, 72, 153, 0.4);
                  background: var(--glass-bg);
                }

                .pinned-link-card:hover .chevron-icon {
                  transform: translateX(5px);
                  color: #ec4899;
                }
                
                .chevron-icon {
                  transition: transform 0.3s ease, color 0.3s ease;
                  color: #a5b4fc;
                }
                
                .pinned-badge {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  background: linear-gradient(135deg, #ec4899 0%, #f43f5e 100%);
                  color: white;
                  padding: 8px 18px;
                  border-radius: 99px;
                  font-size: 13px;
                  font-weight: 800;
                  letter-spacing: 0.5px;
                  box-shadow: 0 0 20px rgba(236, 72, 153, 0.5);
                  cursor: default;
                  user-select: none;
                  position: relative;
                  text-transform: uppercase;
                }
              `}</style>

              {/* Decorative top gradient line */}
              <div 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  height: '4px', 
                  background: 'linear-gradient(90deg, #ec4899 0%, #f43f5e 50%, #8b5cf6 100%)',
                }} 
              />

              {/* Badge "THÔNG BÁO MỚI" */}
              <div className="pinned-badge bell-shake-hover">
                {/* Pulsing indicator dot */}
                <span style={{ position: 'relative', display: 'flex', height: '10px', width: '10px' }}>
                  <span className="pulse-dot-ping" style={{ position: 'absolute', display: 'inline-flex', height: '100%', width: '100%', borderRadius: '50%', background: 'var(--glass-bg)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', opacity: 0.9 }}></span>
                  <span style={{ position: 'relative', display: 'inline-flex', borderRadius: '50%', height: '10px', width: '10px', background: 'var(--glass-bg)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' }}></span>
                </span>
                <Bell size={16} className="bell-shake-auto" />
                <span>THÔNG BÁO QUAN TRỌNG</span>
              </div>

              {/* Pinned Links */}
              <div style={{ display: 'flex', gap: '12px', flex: 1, flexWrap: 'wrap', alignItems: 'center' }}>
                {pinnedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/tin-tuc/${post.slug}`}
                    className="pinned-link-card"
                  >
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      background: 'linear-gradient(135deg, #34d399, #10b981)',
                      boxShadow: '0 0 10px rgba(52, 211, 153, 0.8)'
                    }}></span>
                    <span>{post.title}</span>
                    <ArrowRight size={15} className="chevron-icon" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Section Giới thiệu nhanh (Sứ mệnh - Tầm nhìn) */}
      <section className="section" >
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span className="section-label">Hành trình khai phóng</span>
                <h2 className="section-title section-title--underlined" style={{ margin: '8px 0 0 0' }}>Kiến tạo thế hệ tiên phong</h2>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {/* Tầm nhìn */}
                <div className="premium-card" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-5)', alignItems: 'center' }}>
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
                <div className="premium-card" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-5)', alignItems: 'center' }}>
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
                <div className="premium-card" style={{ display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-5)', alignItems: 'center' }}>
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
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="section-label">Tin tức & Thông báo</span>
              <h2 className="section-title section-title--underlined" style={{ margin: 0, marginTop: 'var(--space-2)' }}>Tin mới nhất</h2>
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
      <section className="section" style={{ position: 'relative', overflow: 'hidden' }}>
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
            background: var(--glass-bg);
            backdrop-filter: blur(4px);
            -webkit-backdrop-filter: blur(4px);
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
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
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 'var(--space-5)' }}>
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

      {/* 7. Section Tuyển sinh - FUTURISTIC PREMIUM (Synchronized Light Theme) */}
      <section className="section" style={{ position: 'relative', overflow: 'hidden', background: 'transparent' }}>
        <style>{`
          .admission-stat-card-custom {
            background: var(--glass-bg);
            backdrop-filter: blur(4px);
            border: 1px solid rgba(99, 102, 241, 0.1);
            border-radius: 24px;
            padding: 32px 24px;
            text-align: center;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 16px;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
          }
          .admission-stat-card-custom:hover {
            transform: translateY(-8px);
            box-shadow: 0 16px 40px rgba(79, 70, 229, 0.08), 0 0 20px rgba(99, 102, 241, 0.04);
            border-color: rgba(99, 102, 241, 0.2);
          }
          .admission-stat-icon {
            width: 64px;
            height: 64px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .admission-stat-card-custom:hover .admission-stat-icon {
            transform: scale(1.1) rotate(5deg);
          }
          .admission-stat-number {
            font-size: 42px;
            font-weight: 900;
            color: var(--color-navy);
            font-family: var(--font-title);
            line-height: 1;
            letter-spacing: -0.02em;
          }
          .admission-stat-label {
            font-size: 16px;
            font-weight: 600;
            color: var(--color-gray-600);
          }

          .admission-feature-icon {
            width: 56px;
            height: 56px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            background: rgba(99, 102, 241, 0.08);
            color: #4f46e5;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          }
          .premium-card:hover .admission-feature-icon {
            transform: scale(1.12);
            background: rgba(99, 102, 241, 0.15);
          }
          
          .feature-title {
            font-size: 18px;
            font-weight: 800;
            color: var(--color-navy);
            margin-bottom: 8px;
            line-height: 1.3;
          }
          .feature-desc {
            font-size: 15px;
            color: var(--color-gray-600);
            line-height: 1.6;
          }

          .admission-cta-primary {
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 16px 36px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            font-size: 16px;
            font-weight: 700;
            border-radius: 999px;
            text-decoration: none;
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
          }
          .admission-cta-primary:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 12px 35px rgba(99, 102, 241, 0.4);
          }
          .admission-cta-secondary {
            display: inline-flex;
            align-items: center;
            gap: 8px;
            padding: 16px 36px;
            background: var(--glass-bg);
            color: var(--color-navy);
            font-size: 16px;
            font-weight: 700;
            border-radius: 999px;
            text-decoration: none;
            border: 1px solid rgba(99, 102, 241, 0.2);
            transition: all 0.3s ease;
          }
          .admission-cta-secondary:hover {
            background: rgba(99, 102, 241, 0.05);
            border-color: rgba(99, 102, 241, 0.4);
            transform: translateY(-2px);
            color: #4f46e5;
          }
          @media (max-width: 768px) {
            .admission-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .admission-info-grid { grid-template-columns: 1fr !important; }
            .admission-main-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>

        {/* Decorative Background */}
        <div style={{ position: 'absolute', top: '10%', left: '-5%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '15%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Top Section - Header */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-16)' }}>
            <span className="section-label" style={{ fontSize: '14px', padding: '6px 16px' }}>Đang mở đăng ký tuyển sinh 2026 – 2027</span>
            <h2 className="section-title section-title--underlined" style={{ display: 'block', margin: 'var(--space-4) auto', maxWidth: '750px', fontSize: 'clamp(32px, 4vw, 48px)' }}>
              Khởi đầu hành trình tại Edison School
            </h2>
            <p className="section-desc" style={{ maxWidth: '650px', margin: 'var(--space-5) auto 0', fontSize: '18px' }}>
              Hồ sơ đăng ký tuyển sinh lớp 10 chính thức mở. Hãy nắm bắt cơ hội trở thành học sinh Edison với chính sách học bổng hấp dẫn.
            </p>
          </div>

          {/* Stats Row */}
          <div className="admission-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px', marginBottom: 'var(--space-16)', maxWidth: '1000px', margin: '0 auto var(--space-16)' }}>
            {admissionStats.map((stat: any, index: number) => {
              let IconComp: any = null;
              if (stat.icon === 'GraduationCap') IconComp = GraduationCap;
              else if (stat.icon === 'BookOpen') IconComp = BookOpen;
              else if (stat.icon === 'Award') IconComp = Award;
              else if (stat.icon === 'ShieldCheck') IconComp = ShieldCheck;
              else if (stat.icon === 'Users') IconComp = Users;
              else if (stat.icon === 'UserCheck') IconComp = UserCheck;
              
              const bgColors = [
                'rgba(245, 158, 11, 0.1)', // amber
                'rgba(59, 130, 246, 0.1)', // blue
                'rgba(16, 185, 129, 0.1)', // emerald
                'rgba(168, 85, 247, 0.1)'  // purple
              ]
              const textColors = ['#f59e0b', '#3b82f6', '#10b981', '#a855f7']

              return (
                <div key={index} className="admission-stat-card-custom">
                  <div className="admission-stat-icon" style={{ background: bgColors[index % 4], color: textColors[index % 4] }}>
                    {IconComp && <IconComp size={28} />}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div className="admission-stat-number">{stat.value}<span style={{ color: textColors[index % 4] }}>{stat.suffix}</span></div>
                    <div className="admission-stat-label">{stat.label}</div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Main 2-column content */}
          <div className="admission-main-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', alignItems: 'start' }}>

            {/* Left: Features */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <h3 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 var(--space-3) 0', fontFamily: 'var(--font-title)' }}>
                  Tại sao chọn Edison?
                </h3>
              </div>

              <div className="premium-card" style={{ display: 'flex', gap: '20px', padding: '24px', alignItems: 'flex-start' }}>
                <div className="admission-feature-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><BookOpen size={24} /></div>
                <div style={{ flex: 1 }}>
                  <div className="feature-title">Chương trình tăng cường IELTS & STEM</div>
                  <div className="feature-desc">Tích hợp ngoại ngữ, công nghệ thông tin và khoa học ứng dụng một cách toàn diện.</div>
                </div>
              </div>
              <div className="premium-card" style={{ display: 'flex', gap: '20px', padding: '24px', alignItems: 'flex-start' }}>
                <div className="admission-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Award size={24} /></div>
                <div style={{ flex: 1 }}>
                  <div className="feature-title">Học bổng lên đến 100% học phí</div>
                  <div className="feature-desc">Dành cho học sinh xuất sắc, HSG cấp tỉnh/thành phố, IELTS 6.5+ và tài năng đặc biệt.</div>
                </div>
              </div>
              <div className="premium-card" style={{ display: 'flex', gap: '20px', padding: '24px', alignItems: 'flex-start' }}>
                <div className="admission-feature-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><ShieldCheck size={24} /></div>
                <div style={{ flex: 1 }}>
                  <div className="feature-title">Môi trường giáo dục hạnh phúc & an toàn</div>
                  <div className="feature-desc">Cơ sở vật chất hiện đại, đội ngũ giáo viên tận tâm, thấu hiểu và đồng hành.</div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap' }}>
                <Link href="/tuyen-sinh" className="admission-cta-primary">
                  Đăng ký tuyển sinh ngay
                  <ArrowRight size={20} />
                </Link>
                <Link href="/lien-he" className="admission-cta-secondary">
                  Liên hệ tư vấn
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Right: Info cards grid */}
            <div className="admission-info-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="premium-card" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="admission-feature-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b' }}><BookOpen size={24} /></div>
                <div>
                  <h4 className="feature-title">Chương trình đào tạo</h4>
                  <span className="feature-desc">Giáo dục toàn diện theo chuẩn quốc tế, rèn luyện kỹ năng thế kỷ 21.</span>
                </div>
              </div>
              <div className="premium-card" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="admission-feature-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><Award size={24} /></div>
                <div>
                  <h4 className="feature-title">Học phí & Học bổng</h4>
                  <span className="feature-desc">Chính sách linh hoạt, quỹ học bổng dồi dào luôn sẵn sàng cho nhân tài.</span>
                </div>
              </div>
              <div className="premium-card" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="admission-feature-icon" style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}><ClipboardList size={24} /></div>
                <div>
                  <h4 className="feature-title">Quy trình nhập học</h4>
                  <span className="feature-desc">Đăng ký trực tuyến nhanh chóng → Khảo sát năng lực → Xét duyệt hồ sơ.</span>
                </div>
              </div>
              <div className="premium-card" style={{ padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="admission-feature-icon" style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#a855f7' }}><Calendar size={24} /></div>
                <div>
                  <h4 className="feature-title">Hồ sơ cần thiết</h4>
                  <span className="feature-desc">Học bạ THCS, giấy chứng nhận tốt nghiệp tạm thời, ảnh và đơn đăng ký.</span>
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

