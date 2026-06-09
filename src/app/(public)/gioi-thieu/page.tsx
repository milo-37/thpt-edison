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
      
      {/* Banner đầu trang */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-navy-dark), var(--color-navy))',
          color: 'var(--color-white)',
          padding: 'var(--space-12) 0',
          textAlign: 'center'
        }}
      >
        <div className="container">
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, margin: 0, color: 'var(--color-gold)' }}>
            Giới thiệu nhà trường
          </h1>
          <p style={{ opacity: 0.8, fontSize: 'var(--font-size-base)', marginTop: 'var(--space-2)', maxWidth: '600px', margin: 'var(--space-2) auto 0 auto' }}>
            Trường THPT Edison - Khát vọng, Sáng tạo và Bản lĩnh dẫn đầu.
          </p>
        </div>
      </section>

      {/* 1. Lịch sử hình thành */}
      <section className="section">
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-navy)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-gold)' }} />
                <span>Chuẩn Quốc Gia</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-navy)' }}>
                <CheckCircle2 size={16} style={{ color: 'var(--color-gold)' }} />
                <span>Phương Pháp Khai Phóng</span>
              </div>
            </div>
          </div>
          <div>
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=60"
              alt="Toàn cảnh trường THPT Edison"
              style={{ borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-xl)', width: '100%', objectFit: 'cover', height: '350px' }}
            />
          </div>
        </div>
      </section>

      {/* 2. Tầm nhìn & Sứ mệnh */}
      <section className="section section-alt">
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
                  style={{
                    background: 'var(--color-white)',
                    padding: 'var(--space-8)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--color-gray-200)',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-3)'
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--color-gray-50)',
                      color: item.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  >
                    <Icon size={24} />
                  </div>
                  <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>
                    {item.title}
                  </h3>
                  <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* 3. Ban giám hiệu */}
      <section className="section">
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
                  background: 'var(--color-white)'
                }}
              >
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'var(--color-gray-100)',
                    border: '3px solid var(--color-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 'var(--space-4)',
                    overflow: 'hidden'
                  }}
                >
                  {leader.avatar ? (
                    <img src={leader.avatar} alt={leader.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ color: 'var(--color-navy)', fontSize: 'var(--font-size-3xl)', fontWeight: 700 }}>
                      {leader.name.split(' ').pop()?.charAt(0)}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 2px 0' }}>
                  {leader.name}
                </h3>
                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gold-dark)', textTransform: 'uppercase', marginBottom: 'var(--space-3)' }}>
                  {leader.role}
                </span>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.5 }}>
                  {leader.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Đội ngũ giáo viên tiêu biểu */}
      {teachers.length > 0 && (
        <section className="section section-alt">
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
                    background: 'var(--color-white)'
                  }}
                >
                  <div
                    style={{
                      width: '90px',
                      height: '90px',
                      borderRadius: '50%',
                      background: 'var(--color-gray-100)',
                      border: '2px solid var(--color-primary-light)',
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
                      <span style={{ color: 'var(--color-navy)', fontSize: 'var(--font-size-xl)', fontWeight: 700 }}>
                        {teacher.name.split(' ').pop()?.charAt(0)}
                      </span>
                    )}
                  </div>
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 2px 0' }}>
                    {teacher.name}
                  </h3>
                  <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-primary)', marginBottom: 'var(--space-2)' }}>
                    {teacher.subject} {teacher.degree ? `• ${teacher.degree}` : ''}
                  </span>
                  {teacher.description && (
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.4 }}>
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
