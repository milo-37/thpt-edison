import prisma from '@/lib/prisma'
import { Compass, Eye, ShieldCheck, CheckCircle2 } from 'lucide-react'

export const revalidate = 60

export const metadata = {
  title: 'Giới Thiệu - Trường THPT Edison',
  description: 'Tìm hiểu về lịch sử hình thành, sứ mệnh, tầm nhìn, đội ngũ cán bộ giáo viên và cơ sở vật chất của Trường THPT Edison.',
}

export default async function AboutPage() {
  const [leaders, teachers] = await Promise.all([
    prisma.leader.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    }),
    prisma.teacher.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
  ])

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
      desc: 'Trở thành ngôi trường THPT hàng đầu về đổi mới giáo dục, đào tạo ra những thế hệ công dân toàn cầu có tư duy độc lập, giàu lòng nhân ái và khả năng thích ứng cao với kỷ nguyên số.',
      icon: Eye,
      color: 'var(--color-primary)',
    },
    {
      title: 'Sứ mệnh',
      desc: 'Xây dựng môi trường giáo dục hạnh phúc và sáng tạo, khơi dậy tối đa tiềm năng riêng biệt của từng học sinh, trang bị đầy đủ kiến thức, kỹ năng sống và đạo đức để các em tự tin lập nghiệp.',
      icon: Compass,
      color: 'var(--color-gold-dark)',
    },
    {
      title: 'Giá trị cốt lõi',
      desc: 'Khát vọng học hỏi - Tư duy sáng tạo - Trách nhiệm bản thân - Tôn trọng sự khác biệt - Tự hào nguồn cội dân tộc.',
      icon: ShieldCheck,
      color: 'var(--color-success)',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      <style>{`
        .vision-card {
          background: rgba(255, 255, 255, 0.65);
          backdrop-filter: blur(12px);
          padding: var(--space-8);
          border-radius: var(--radius-xl);
          border: 1px solid rgba(99, 102, 241, 0.15);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.04);
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
          transition: all 0.3s ease;
        }
        .vision-card:hover {
          transform: translateY(-5px);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: 0 15px 35px rgba(99, 102, 241, 0.08);
        }
      `}</style>
      
      {/* Banner đầu trang - Light Futuristic */}
      <section
        style={{
          background: 'linear-gradient(135deg, #f0f4ff 0%, #e8eeff 50%, #f5f0ff 100%)',
          color: '#0f172a',
          padding: 'var(--space-16) 0',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid rgba(99, 102, 241, 0.15)'
        }}
      >
        {/* Animated grid overlay */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none', backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(99,102,241,0.08) 1px, transparent 0)', backgroundSize: '32px 32px' }} />
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)', filter: 'blur(30px)', pointerEvents: 'none' }} />
        
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <span className="section-label">Về Edison School</span>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 900, margin: '12px 0 0 0', background: 'linear-gradient(135deg, #3b82f6, #4f46e5, #7c3aed)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontFamily: 'var(--font-title)' }}>
            Giới thiệu nhà trường
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-base)', marginTop: 'var(--space-3)', maxWidth: '600px', margin: 'var(--space-3) auto 0 auto', fontWeight: 500 }}>
            Trường THPT Edison - Kiến tạo tương lai, dẫn đầu bằng tri thức và bản lĩnh.
          </p>
        </div>
      </section>

      {/* 1. Lịch sử hình thành */}
      <section className="section" style={{ background: '#ffffff', position: 'relative' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-12)', alignItems: 'center' }}>
          <div>
            <span className="section-label">Hành trình phát triển</span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-navy)', marginBottom: 'var(--space-4)', marginTop: 'var(--space-2)' }}>
              Lịch sử hình thành
            </h2>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>
              Được thành lập từ năm 2015, Trường THPT Edison tọa lạc tại khu đô thị hiện đại với quy mô ban đầu chỉ gồm vài lớp học. Trải qua hơn một thập kỷ xây dựng và trưởng thành, nhà trường đã vươn lên thành một trong những điểm sáng của giáo dục phổ thông.
            </p>
            <p style={{ color: 'var(--color-gray-600)', marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
              Edison tự hào sở hữu tỷ lệ học sinh đỗ tốt nghiệp luôn đạt 100%, tỷ lệ đỗ vào các trường đại học top đầu cả nước và du học đạt trên 85%. Nhiều thế hệ học sinh Edison đã ghi danh tại các kỳ thi học sinh giỏi cấp Thành phố và Quốc gia.
            </p>
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
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60"
              alt="Toàn cảnh trường THPT Edison"
              style={{ position: 'relative', zIndex: 1, borderRadius: 'var(--radius-xl)', boxShadow: '0 20px 45px rgba(99, 102, 241, 0.12)', width: '100%', objectFit: 'cover', height: '350px' }}
            />
          </div>
        </div>
      </section>

      {/* 2. Tầm nhìn & Sứ mệnh */}
      <section className="section section-alt" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f5f8ff 100%)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Định hướng tương lai</span>
            <h2 className="section-title">Tầm nhìn & sứ mệnh</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)' }}>
            {visionMission.map((item, idx) => {
              const Icon = item.icon
              return (
                <div
                  key={idx}
                  className="vision-card"
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(99, 102, 241, 0.08)',
                      color: item.color === 'var(--color-primary)' ? '#4f46e5' : (item.color === 'var(--color-gold-dark)' ? '#7c3aed' : '#10b981'),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 10px rgba(99, 102, 241, 0.05)'
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

      {/* 3. Ban giám hiệu */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Đội ngũ đầu tàu</span>
            <h2 className="section-title">Ban giám hiệu</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-8)' }}>
            {displayLeaders.map((leader, idx) => (
              <div
                key={idx}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: 'var(--space-8)',
                  textAlign: 'center',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(99, 102, 241, 0.12)',
                  borderRadius: '24px',
                  boxShadow: '0 10px 30px rgba(99, 102, 241, 0.03)'
                }}
              >
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'rgba(99, 102, 241, 0.05)',
                    border: '3px solid #6366f1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    overflow: 'hidden',
                    boxShadow: '0 0 20px rgba(99, 102, 241, 0.15)'
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
        <section className="section section-alt" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f4f6ff 100%)' }}>
          <div className="container">
            <div className="section-header">
              <span className="section-label">Đội ngũ nhà giáo</span>
              <h2 className="section-title">Giáo viên tiêu biểu</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)' }}>
              {teachers.map((teacher) => (
                <div
                  key={teacher.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: 'var(--space-6)',
                    textAlign: 'center',
                    background: 'rgba(255, 255, 255, 0.85)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(99, 102, 241, 0.1)',
                    borderRadius: '20px',
                    boxShadow: '0 10px 25px rgba(99, 102, 241, 0.02)'
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
                      overflow: 'hidden'
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
      )}

    </div>
  )
}
