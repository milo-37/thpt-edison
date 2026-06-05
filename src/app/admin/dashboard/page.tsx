import prisma from '@/lib/prisma'
import DashboardStats from '@/components/admin/DashboardStats'
import Link from 'next/link'
import { FileText, FolderDown, History, MessageSquare, ArrowRight, BarChart2 } from 'lucide-react'
import { formatDateVi } from '@/lib/validation'

// Ép kiểu dynamic fetch để tránh static cache lỗi thời
export const revalidate = 0

export default async function AdminDashboard() {
  // Lấy mốc thời gian 6 tháng trước
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  // Query các chỉ số thống kê cùng lúc
  const [
    postsCount,
    documentsCount,
    eventsCount,
    contactsCount,
    teachersCount,
    achievementsCount,
    subscribersCount,
    latestPosts,
    latestLogs,
    unreadContacts,
    topPosts,
    postsInSixMonths,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.document.count(),
    prisma.event.count({ where: { startDate: { gte: new Date() } } }),
    prisma.contact.count({ where: { isHandled: false } }),
    prisma.teacher.count(),
    prisma.achievement.count(),
    prisma.subscriber.count(),
    prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { category: true, author: { select: { name: true } } },
    }),
    prisma.activityLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: { user: { select: { name: true, role: true } } },
    }),
    prisma.contact.findMany({
      where: { isHandled: false },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { viewCount: 'desc' },
      take: 5,
      select: { id: true, title: true, viewCount: true },
    }),
    prisma.post.findMany({
      where: {
        createdAt: { gte: sixMonthsAgo },
      },
      select: { createdAt: true },
    }),
  ])

  // Khởi tạo và gom nhóm bài viết theo tháng trong 6 tháng gần đây
  const monthlyData: { [key: string]: number } = {}
  const monthLabels: string[] = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const monthYear = `${d.getMonth() + 1}/${d.getFullYear()}`
    monthlyData[monthYear] = 0
    monthLabels.push(monthYear)
  }

  postsInSixMonths.forEach((post) => {
    const d = new Date(post.createdAt)
    const monthYear = `${d.getMonth() + 1}/${d.getFullYear()}`
    if (monthlyData[monthYear] !== undefined) {
      monthlyData[monthYear]++
    }
  })

  const maxViews = topPosts.reduce((max, p) => Math.max(max, p.viewCount), 1)
  const maxCount = Object.values(monthlyData).reduce((max, count) => Math.max(max, count), 1)

  const translateRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Admin'
      case 'editor':
        return 'Editor'
      case 'reviewer':
        return 'Reviewer'
      default:
        return role
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600 }}>Đã đăng</span>
      case 'pending':
        return <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600 }}>Chờ duyệt</span>
      case 'rejected':
        return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600 }}>Từ chối</span>
      default:
        return <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '10px', fontWeight: 600 }}>Nháp</span>
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
      {/* 1. Tiêu đề Dashboard */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)' }}>
          Bảng Điều Khiển
        </h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
          Tổng quan số liệu và hoạt động vận hành hệ thống của Trường THPT Edison.
        </p>
      </div>

      {/* 2. Các thẻ số liệu thống kê */}
      <DashboardStats
        postsCount={postsCount}
        documentsCount={documentsCount}
        eventsCount={eventsCount}
        contactsCount={contactsCount}
        teachersCount={teachersCount}
        achievementsCount={achievementsCount}
        subscribersCount={subscribersCount}
      />

      {/* Biểu đồ Báo cáo Thống kê (CSS-only Charts) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
        
        {/* Biểu đồ CSS: Top 5 bài viết nhiều lượt xem nhất */}
        <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <BarChart2 size={18} style={{ color: 'var(--color-primary)' }} />
            Top 5 Bài Viết Xem Nhiều Nhất
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
            {topPosts.length === 0 ? (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)', textAlign: 'center', padding: 'var(--space-4)' }}>Chưa có bài viết nào được xuất bản.</p>
            ) : (
              topPosts.map((post, idx) => {
                const percentage = Math.min(100, Math.max(5, (post.viewCount / maxViews) * 100))
                return (
                  <div key={post.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--font-size-xs)' }}>
                      <span style={{ fontWeight: 600, color: 'var(--color-gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>
                        {idx + 1}. {post.title}
                      </span>
                      <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{post.viewCount} lượt xem</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--color-gray-100)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{ width: `${percentage}%`, height: '100%', background: 'linear-gradient(90deg, var(--color-primary), var(--color-gold))', borderRadius: 'var(--radius-full)', transition: 'width 1s ease-in-out' }}></div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        {/* Biểu đồ CSS: Số bài viết theo tháng */}
        <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-6)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <BarChart2 size={18} style={{ color: 'var(--color-gold-dark)' }} />
            Số Lượng Bài Viết Mới Theo Tháng
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '160px', padding: 'var(--space-4) var(--space-2) 0 var(--space-2)', gap: 'var(--space-2)' }}>
            {monthLabels.map((label) => {
              const count = monthlyData[label] || 0
              const percentage = Math.min(100, Math.max(5, (count / maxCount) * 100))
              return (
                <div key={label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: 'var(--color-navy-light)' }}>{count}</span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '32px',
                      height: `${percentage * 0.7}%`,
                      background: 'linear-gradient(0deg, var(--color-primary), var(--color-gold-light))',
                      borderRadius: 'var(--radius-sm) var(--radius-sm) 0 0',
                      transition: 'height 1s ease-in-out',
                    }}
                    title={`${count} bài viết`}
                  ></div>
                  <span style={{ fontSize: '9px', fontWeight: 600, color: 'var(--color-gray-500)', whiteSpace: 'nowrap' }}>Th. {label.split('/')[0]}</span>
                </div>
              )
            })}
          </div>
        </div>

      </div>

      {/* 3. Lưới hiển thị chi tiết (Bài viết mới & Ý kiến phụ huynh) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
        
        {/* Khối Bài viết mới nhất */}
        <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <FileText size={18} style={{ color: 'var(--color-primary)' }} />
              Bài Viết Mới Cập Nhật
            </h3>
            <Link href="/admin/posts" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              Quản lý
              <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {latestPosts.length === 0 ? (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)', textAlign: 'center', padding: 'var(--space-4)' }}>Chưa có bài viết nào.</p>
            ) : (
              latestPosts.map((post) => (
                <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-2)', borderBottom: '1px dashed var(--color-gray-100)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden', paddingRight: 'var(--space-4)' }}>
                    <Link href={`/admin/posts/${post.id}/edit`} style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-800)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {post.title}
                    </Link>
                    <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>
                      Danh mục: {post.category?.name || 'Chưa phân loại'} | Đăng bởi: {post.author.name}
                    </span>
                  </div>
                  <div>{getStatusBadge(post.status)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Khối Ý kiến liên hệ chưa xử lý */}
        <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
              <MessageSquare size={18} style={{ color: 'var(--color-danger)' }} />
              Ý Kiến Liên Hệ Chưa Xử Lý
            </h3>
            <Link href="/admin/contacts" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
              Quản lý
              <ArrowRight size={12} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {unreadContacts.length === 0 ? (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)', textAlign: 'center', padding: 'var(--space-4)' }}>Tuyệt vời! Không còn liên hệ nào chưa xử lý.</p>
            ) : (
              unreadContacts.map((contact) => (
                <div key={contact.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px', paddingBottom: 'var(--space-2)', borderBottom: '1px dashed var(--color-gray-100)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-800)' }}>{contact.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>{formatDateVi(contact.createdAt)}</span>
                  </div>
                  <span style={{ fontWeight: 600, fontSize: 'var(--font-size-xs)', color: 'var(--color-navy-light)' }}>{contact.subject}</span>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {contact.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* 4. Khối Hoạt động hệ thống gần đây */}
      <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <History size={18} style={{ color: 'var(--color-warning-dark)' }} />
            Hoạt Động Quản Trị Gần Đây
          </h3>
          <Link href="/admin/activity-log" style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '2px', fontWeight: 600 }}>
            Nhật ký đầy đủ
            <ArrowRight size={12} />
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {latestLogs.length === 0 ? (
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)', textAlign: 'center', padding: 'var(--space-4)' }}>Chưa ghi nhận hoạt động nào.</p>
          ) : (
            latestLogs.map((log) => (
              <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-2)', borderBottom: '1px dashed var(--color-gray-100)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', background: 'var(--color-gray-100)', padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontWeight: 600, color: 'var(--color-navy)' }}>
                    {log.action.toUpperCase()}
                  </div>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)' }}>
                    {log.details}
                  </span>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>
                  {log.user.name} ({translateRole(log.user.role)}) | {formatDateVi(log.createdAt)}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  )
}
