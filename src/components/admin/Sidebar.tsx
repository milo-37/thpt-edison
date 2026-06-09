'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  FolderDown,
  Image as ImageIcon,
  MessageSquare,
  Users,
  Calendar,
  History,
  LogOut,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Award,
  HelpCircle,
  Mail,
  SlidersHorizontal,
  Info,
  Settings
} from 'lucide-react'

interface UserSession {
  id: string
  name: string
  email: string
  role: string
}

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [user, setUser] = useState<UserSession | null>(null)

  useEffect(() => {
    // Gọi API để lấy user info hiện hành
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})
  }, [])

  const handleLogout = async () => {
    if (confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      const res = await fetch('/api/auth/logout', { method: 'POST' })
      if (res.ok) {
        router.push('/admin/login')
      }
    }
  }

  // Định nghĩa menu
  const menuItems = [
    { label: 'Bảng điều khiển', href: '/admin/dashboard', icon: LayoutDashboard, roles: ['admin', 'editor', 'reviewer'] },
    { label: 'Bài viết', href: '/admin/posts', icon: FileText, roles: ['admin', 'editor', 'reviewer'] },
    { label: 'Danh mục', href: '/admin/categories', icon: FolderOpen, roles: ['admin', 'editor'] },
    { label: 'Slideshow', href: '/admin/slides', icon: SlidersHorizontal, roles: ['admin', 'editor'] },
    { label: 'Ý kiến phụ huynh', href: '/admin/testimonials', icon: MessageSquare, roles: ['admin', 'editor'] },
    { label: 'Giới thiệu & GV', href: '/admin/about', icon: Info, roles: ['admin', 'editor'] },
    { label: 'Thành tích', href: '/admin/achievements', icon: Award, roles: ['admin', 'editor'] },
    { label: 'Hỏi đáp FAQ', href: '/admin/faqs', icon: HelpCircle, roles: ['admin', 'editor'] },
    { label: 'Đăng ký nhận tin', href: '/admin/subscribers', icon: Mail, roles: ['admin'] },
    { label: 'Tài liệu', href: '/admin/documents', icon: FolderDown, roles: ['admin', 'editor'] },
    { label: 'Thư viện ảnh', href: '/admin/gallery', icon: ImageIcon, roles: ['admin', 'editor'] },
    { label: 'Lịch sự kiện', href: '/admin/events', icon: Calendar, roles: ['admin', 'editor'] },
    { label: 'Liên hệ / Ý kiến', href: '/admin/contacts', icon: MessageSquare, roles: ['admin'] },
    { label: 'Tài khoản CB-GV', href: '/admin/users', icon: Users, roles: ['admin'] },
    { label: 'Cài đặt hệ thống', href: '/admin/settings', icon: Settings, roles: ['admin'] },
    { label: 'Nhật ký thao tác', href: '/admin/activity-log', icon: History, roles: ['admin'] },
  ]

  // Lọc menu theo vai trò người dùng
  const filteredMenuItems = menuItems.filter(
    (item) => !user || item.roles.includes(user.role)
  )

  return (
    <aside
      className="admin-sidebar"
      style={{
        width: isCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
        background: 'var(--color-navy-dark)',
        color: 'var(--color-white)',
        transition: 'width var(--transition-base)',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 100,
        boxShadow: 'var(--shadow-xl)',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }}
    >
      {/* Logo sidebar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-3)',
          padding: 'var(--space-6) var(--space-4)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            background: 'var(--color-gold)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-navy-dark)',
            flexShrink: 0
          }}
        >
          <GraduationCap size={24} />
        </div>
        {!isCollapsed && (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 800, fontSize: 'var(--font-size-sm)', letterSpacing: '0.5px' }}>EDISON CMS</span>
            <span style={{ fontSize: '10px', color: 'var(--color-gold-light)', textTransform: 'uppercase' }}>
              Trang Quản Trị
            </span>
          </div>
        )}
      </div>

      {/* Menu list */}
      <nav
        style={{
          flex: 1,
          padding: 'var(--space-4) var(--space-2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)',
          overflowY: 'auto'
        }}
      >
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/admin/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3) var(--space-4)',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--color-navy-dark)' : 'var(--color-gray-400)',
                background: isActive ? 'var(--color-gold)' : 'transparent',
                fontWeight: isActive ? 600 : 500,
                fontSize: 'var(--font-size-sm)',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
                overflow: 'hidden'
              }}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon size={18} style={{ flexShrink: 0 }} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer / Toggle & Logout */}
      <div
        style={{
          padding: 'var(--space-4) var(--space-2)',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-1)'
        }}
      >
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--color-danger)',
            background: 'transparent',
            fontWeight: 500,
            fontSize: 'var(--font-size-sm)',
            width: '100%',
            textAlign: 'left',
            transition: 'all var(--transition-fast)'
          }}
          title={isCollapsed ? 'Đăng xuất' : undefined}
        >
          <LogOut size={18} style={{ flexShrink: 0 }} />
          {!isCollapsed && <span>Đăng xuất</span>}
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-end',
            padding: 'var(--space-2)',
            background: 'rgba(255,255,255,0.02)',
            color: 'var(--color-gray-500)',
            borderRadius: 'var(--radius-sm)',
            marginTop: 'var(--space-2)',
            cursor: 'pointer'
          }}
        >
          {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </aside>
  )
}
