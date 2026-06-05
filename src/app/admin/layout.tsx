import React from 'react'
import Sidebar from '@/components/admin/Sidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export const metadata = {
  title: 'EDISON CMS - Hệ thống Quản trị',
  description: 'Trang quản trị nội dung của Trường THPT Edison.',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-gray-50)' }}>
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Content wrapper bên phải */}
      <div
        style={{
          flex: 1,
          marginLeft: 'var(--sidebar-width)', // Mặc định lùi lề bằng chiều rộng sidebar
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0, // Tránh lỗi flex item tràn màn hình
          transition: 'margin-left var(--transition-base)',
        }}
        className="admin-main-content"
      >
        {/* Header trên cùng */}
        <AdminHeader />

        {/* Nội dung trang quản trị cụ thể */}
        <main style={{ flex: 1, padding: 'var(--space-8) var(--space-8)' }}>
          {children}
        </main>
      </div>

      {/* Inline styles helper để tự động lùi lề khi sidebar collapsed */}
      <style>{`
        /* Khi sidebar bị collapsed, main content lùi sang trái nhiều hơn */
        .admin-sidebar[style*="width: var(--sidebar-collapsed)"] + .admin-main-content {
          margin-left: var(--sidebar-collapsed) !important;
        }
      `}</style>
    </div>
  )
}
