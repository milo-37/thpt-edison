import prisma from '@/lib/prisma'
import AchievementsList from '@/components/public/AchievementsList'

import PageBanner from '@/components/public/PageBanner'

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
      {/* Banner — Unified PageBanner */}
      <PageBanner
        label="Bảng vàng vinh danh"
        title="Thành tích học sinh"
        description="Nơi vinh danh những nỗ lực vượt bậc và bảng vàng thành tích xuất sắc của học sinh Edison."
      />

      {/* Gradient Divider */}
      <div className="gradient-divider" />

      {/* Interactive Achievements Section */}
      <section className="section" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f5f8ff 100%)' }}>
        <div className="container">
          <AchievementsList initialAchievements={achievements} />
        </div>
      </section>
    </div>
  )
}
