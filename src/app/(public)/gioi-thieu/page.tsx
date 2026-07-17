import prisma from '@/lib/prisma'
import { Compass, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react'
import PageBanner from '@/components/public/PageBanner'

export const revalidate = 60

export const metadata = {
  title: 'Giới Thiệu - Trường THPT Edison',
  description: 'Tìm hiểu về lịch sử hình thành, sứ mệnh, tầm nhìn, đội ngũ cán bộ giáo viên và cơ sở vật chất của Trường THPT Edison.',
}

export default async function AboutPage() {
  const [leaders, teachers, settingsList] = await Promise.all([
    prisma.leader.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    }),
    prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    }),
    prisma.setting.findMany()
  ])

  const settings: Record<string, string> = {}
  settingsList.forEach(s => { settings[s.key] = s.value })

  // Fallback if DB is empty
  const defaultLeadership = [
    { name: 'ThS. Nguyễn Văn A', role: 'Hiệu trưởng', description: 'Hơn 20 năm kinh nghiệm quản lý giáo dục phổ thông, nguyên Hiệu phó trường chuyên Tỉnh.', avatar: null },
    { name: 'Cô Trần Thị B', role: 'Phó Hiệu trưởng Chuyên môn', description: 'Thạc sĩ Ngữ văn, chuyên gia bồi dưỡng học sinh giỏi cấp Quốc gia.', avatar: null },
    { name: 'Thầy Lê Văn C', role: 'Phó Hiệu trưởng Đời sống & Đoàn thể', description: 'Người định hướng và phát triển phong trào hoạt động ngoại khóa, CLB học sinh.', avatar: null },
  ]

  const displayLeaders = leaders.length > 0 ? leaders : defaultLeadership

  const visionMission = [
    {
      title: 'Tầm nhìn',
      desc: settings.aboutVisionText || 'Trở thành ngôi trường THPT hàng đầu về đổi mới giáo dục, đào tạo ra những thế hệ công dân toàn cầu có tư duy độc lập, giàu lòng nhân ái và khả năng thích ứng cao với kỷ nguyên số.',
      icon: Eye,
      accentColor: '#4f46e5',
      bgColor: 'rgba(99, 102, 241, 0.08)',
    },
    {
      title: 'Sứ mệnh',
      desc: settings.aboutMissionText || 'Xây dựng môi trường giáo dục hạnh phúc và sáng tạo, khơi dậy tối đa tiềm năng riêng biệt của từng học sinh, trang bị đầy đủ kiến thức, kỹ năng sống và đạo đức để các em tự tin lập nghiệp.',
      icon: Compass,
      accentColor: '#7c3aed',
      bgColor: 'rgba(168, 85, 247, 0.08)',
    },
    {
      title: 'Giá trị cốt lõi',
      desc: settings.aboutCoreValuesText || 'Khát vọng học hỏi - Tư duy sáng tạo - Trách nhiệm bản thân - Tôn trọng sự khác biệt - Tự hào nguồn cội dân tộc.',
      icon: ShieldCheck,
      accentColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      <style>{`
        .vision-card {
          background: var(--glass-bg);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          padding: var(--space-8);
          border-radius: 24px;
          border: 1px solid rgba(99, 102, 241, 0.1);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.03);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .vision-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-color, #6366f1), transparent);
          opacity: 0;
          transition: opacity 0.35s ease;
          border-radius: 24px 24px 0 0;
        }
        .vision-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 20px 50px rgba(99, 102, 241, 0.08);
        }
        .vision-card:hover::before {
          opacity: 1;
        }
        [data-theme="dark"] .vision-card {
          background: rgba(15, 23, 42, 0.7);
          border-color: rgba(99, 102, 241, 0.08);
        }
        .leader-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: var(--space-8);
          text-align: center;
          background: var(--glass-bg);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          border: 1px solid rgba(99, 102, 241, 0.1);
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.03);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .leader-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #6366f1, #8b5cf6, transparent);
          opacity: 0;
          transition: opacity 0.35s ease;
          border-radius: 24px 24px 0 0;
        }
        .leader-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 102, 241, 0.2);
          box-shadow: 0 20px 50px rgba(79, 70, 229, 0.08);
        }
        .leader-card:hover::before {
          opacity: 1;
        }
        .leader-card:hover .leader-avatar {
          border-color: #8b5cf6 !important;
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.2) !important;
        }
        [data-theme="dark"] .leader-card {
          background: rgba(15, 23, 42, 0.7);
          border-color: rgba(99, 102, 241, 0.08);
        }
      `}</style>
      
      {/* Banner đầu trang — Unified PageBanner */}
      <PageBanner
        label="Về Edison School"
        title="Giới thiệu nhà trường"
        description="Trường THPT Edison - Kiến tạo tương lai, dẫn đầu bằng tri thức và bản lĩnh."
      />

      {/* Gradient Divider */}
      <div className="gradient-divider" />

      {/* 1. Lịch sử hình thành */}
      <section className="section" style={{ background: 'transparent', position: 'relative' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-12)', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span className="section-label">Hành trình phát triển</span>
            <h2 className="section-title section-title--underlined" style={{ marginTop: 'var(--space-2)' }}>
              Lịch sử hình thành
            </h2>
            <div style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-4)', lineHeight: 1.6, marginTop: 'var(--space-4)', whiteSpace: 'pre-line' }}>
              {settings.aboutHistoryText || `Được thành lập từ năm 2015, Trường THPT Edison tọa lạc tại khu đô thị hiện đại với quy mô ban đầu chỉ gồm vài lớp học. Trải qua hơn một thập kỷ xây dựng và trưởng thành, nhà trường đã vươn lên thành một trong những điểm sáng của giáo dục phổ thông.

Edison tự hào sở hữu tỷ lệ học sinh đỗ tốt nghiệp luôn đạt 100%, tỷ lệ đỗ vào các trường đại học top đầu cả nước và du học đạt trên 85%. Nhiều thế hệ học sinh Edison đã ghi danh tại các kỳ thi học sinh giỏi cấp Thành phố và Quốc gia.`}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-sm)', fontWeight: 700, color: '#4f46e5' }}>
                <CheckCircle2 size={16} style={{ color: '#6366f1' }} />
                <span>Chuẩn Quốc Gia</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: 'var(--font-size-sm)', fontWeight: 700, color: '#4f46e5' }}>
                <CheckCircle2 size={16} style={{ color: '#6366f1' }} />
                <span>Phương Pháp Khai Phóng</span>
              </div>
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', inset: '-10px', borderRadius: '28px', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(168, 85, 247, 0.15))', filter: 'blur(10px)', zIndex: 0 }} />
            <img
              src={settings.aboutHistoryImage || "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60"}
              alt="Toàn cảnh trường THPT Edison"
              style={{ position: 'relative', zIndex: 1, borderRadius: 'var(--radius-xl)', boxShadow: '0 20px 45px rgba(99, 102, 241, 0.12)', width: '100%', objectFit: 'cover', height: '350px' }}
            />
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider" />

      {/* 2. Tầm nhìn & Sứ mệnh */}
      <section className="section" style={{ background: 'transparent' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Định hướng tương lai</span>
            <h2 className="section-title section-title--underlined">Tầm nhìn & sứ mệnh</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)' }}>
            {visionMission.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="vision-card"
                  style={{ '--accent-color': item.accentColor } as React.CSSProperties}
                >
                  <div
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '16px',
                      background: item.bgColor,
                      color: item.accentColor,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.35s ease',
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--color-gray-600)', fontSize: '14px', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Gradient Divider */}
      <div className="gradient-divider" />

      {/* 3. Ban giám hiệu */}
      <section className="section" style={{ background: 'transparent' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Đội ngũ đầu tàu</span>
            <h2 className="section-title section-title--underlined">Ban giám hiệu</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)' }}>
            {displayLeaders.map((leader, idx) => (
              <div key={idx} className="leader-card">
                <div
                  className="leader-avatar"
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.04)',
                    border: '3px solid #6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    overflow: 'hidden',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.12)',
                    transition: 'all 0.35s ease',
                  }}
                >
                  {leader.avatar ? (
                    <img src={leader.avatar} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: '#4f46e5', fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>
                      {leader.name.split(' ').pop()?.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 2px 0' }}>
                  {leader.name}
                </h3>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', marginBottom: 'var(--space-3)', letterSpacing: '0.5px' }}>
                  {leader.role}
                </span>
                <p style={{ fontSize: '14px', color: 'var(--color-gray-600)', margin: 0, lineHeight: 1.5 }}>
                  {leader.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Đội ngũ giáo viên tiêu biểu */}
      {teachers.length > 0 && (
        <>
          <div className="gradient-divider" />
          <section className="section" style={{ background: 'transparent' }}>
            <div className="container">
              <div className="section-header">
                <span className="section-label">Đội ngũ nhà giáo</span>
                <h2 className="section-title section-title--underlined">Giáo viên tiêu biểu</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    className="premium-card"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '50%',
                        background: 'rgba(99, 102, 241, 0.04)',
                        border: '2.5px solid #8b5cf6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 'var(--space-4)',
                        overflow: 'hidden',
                        transition: 'all 0.35s ease',
                      }}
                    >
                      {teacher.avatar ? (
                        <img src={teacher.avatar} alt={teacher.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <span style={{ color: '#7c3aed', fontSize: 'var(--font-size-xl)', fontWeight: 800 }}>
                          {teacher.name.split(' ').pop()?.charAt(0)}
                        </span>
                      )}
                    </div>
                    <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 2px 0' }}>
                      {teacher.name}
                    </h3>
                    <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, color: '#4f46e5', marginBottom: 'var(--space-2)' }}>
                      {teacher.subject} {teacher.degree ? `• ${teacher.degree}` : ''}
                    </span>
                    {teacher.description && (
                      <p style={{ fontSize: '13px', color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.4 }}>
                        {teacher.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

    </div>
  )
}
