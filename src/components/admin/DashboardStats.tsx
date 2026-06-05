import { FileText, FolderDown, Calendar, MessageSquare, Award, Mail, Users } from 'lucide-react'

interface StatsProps {
  postsCount: number
  documentsCount: number
  eventsCount: number
  contactsCount: number
  teachersCount: number
  achievementsCount: number
  subscribersCount: number
}

export default function DashboardStats({
  postsCount,
  documentsCount,
  eventsCount,
  contactsCount,
  teachersCount,
  achievementsCount,
  subscribersCount,
}: StatsProps) {
  const cards = [
    {
      title: 'Tổng số Bài Viết',
      value: postsCount,
      desc: 'Bản nháp & Đã xuất bản',
      icon: FileText,
      color: '#3b82f6', // Blue
      bg: 'rgba(59, 130, 246, 0.1)',
    },
    {
      title: 'Tài Liệu Học Tập',
      value: documentsCount,
      desc: 'Tệp giáo trình, công văn',
      icon: FolderDown,
      color: '#10b981', // Green
      bg: 'rgba(16, 185, 129, 0.1)',
    },
    {
      title: 'Đội Ngũ Giáo Viên',
      value: teachersCount,
      desc: 'Tổng số CB-GV trường',
      icon: Users,
      color: '#8b5cf6', // Purple
      bg: 'rgba(139, 92, 246, 0.1)',
    },
    {
      title: 'Thành Tích Học Sinh',
      value: achievementsCount,
      desc: 'Giải thưởng, bằng khen',
      icon: Award,
      color: '#f59e0b', // Gold
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      title: 'Đăng Ký Nhận Tin',
      value: subscribersCount,
      desc: 'Subscribers qua Email',
      icon: Mail,
      color: '#ec4899', // Pink
      bg: 'rgba(236, 72, 153, 0.1)',
    },
    {
      title: 'Sự Kiện Sắp Tới',
      value: eventsCount,
      desc: 'Lịch hoạt động trường',
      icon: Calendar,
      color: '#06b6d4', // Cyan
      bg: 'rgba(6, 182, 212, 0.1)',
    },
    {
      title: 'Ý Kiến Phản Hồi',
      value: contactsCount,
      desc: 'Liên hệ chưa xử lý',
      icon: MessageSquare,
      color: '#ef4444', // Red
      bg: 'rgba(239, 68, 68, 0.1)',
    },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
      {cards.map((card, idx) => {
        const Icon = card.icon
        return (
          <div
            key={idx}
            style={{
              background: 'var(--color-white)',
              borderRadius: 'var(--radius-xl)',
              padding: 'var(--space-6)',
              border: '1px solid var(--color-gray-200)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all var(--transition-base)'
            }}
            className="stats-card"
          >
            {/* Nội dung text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-400)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {card.title}
              </span>
              <span style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-gray-800)', lineHeight: 1 }}>
                {card.value}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>
                {card.desc}
              </span>
            </div>

            {/* Icon bao ngoài */}
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: 'var(--radius-lg)',
                background: card.bg,
                color: card.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Icon size={28} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
