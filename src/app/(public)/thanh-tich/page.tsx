import prisma from '@/lib/prisma'
import AchievementsList from '@/components/public/AchievementsList'

export const revalidate = 60

export const metadata = {
  title: 'Thành Tích Nổi Bật - Trường THPT Edison',
  description: 'Tôn vinh các thành tích xuất sắc của học sinh Trường THPT Edison trong học tập, thể thao và nghệ thuật.',
}

export default async function AchievementsPage() {
  const achievements = await prisma.achievement.findMany({
    where: { isActive: true },
    orderBy: [
      { order: 'asc' },
      { createdAt: 'desc' }
    ]
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Banner */}
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
            Thành tích học sinh
          </h1>
          <p style={{ opacity: 0.8, fontSize: 'var(--font-size-base)', marginTop: 'var(--space-2)', maxWidth: '600px', margin: 'var(--space-2) auto 0 auto' }}>
            Nơi vinh danh những nỗ lực vượt bậc và bảng vàng thành tích xuất sắc của học sinh Edison.
          </p>
        </div>
      </section>

      {/* Interactive Achievements Section */}
      <section className="section">
        <div className="container">
          <AchievementsList initialAchievements={achievements} />
        </div>
      </section>
    </div>
  )
}
