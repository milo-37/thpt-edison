'use client'

import { useState, useEffect } from 'react'
import { History, Shield, Calendar, RefreshCw } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import { formatDateVi, formatDateTimeVi } from '@/lib/validation'

interface ActivityLog {
  id: string
  action: string
  entity: string
  details: string | null
  createdAt: string
  user: {
    name: string
    email: string
    role: string
  }
}

export default function AdminActivityLogPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Filters & Pagination
  const [action, setAction] = useState('')
  const [entity, setEntity] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  const fetchLogs = async () => {
    setLoading(true)
    let url = `/api/activity-log?page=${page}&limit=12`
    if (action) url += `&action=${action}`
    if (entity) url += `&entity=${entity}`

    try {
      const res = await fetch(url)
      const data = await res.json()
      if (data.logs) {
        setLogs(data.logs)
        setTotalPages(data.pagination.totalPages)
      } else if (data.error) {
        showToast('error', data.error)
      }
    } catch {
      showToast('error', 'Lỗi tải lịch sử hoạt động')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [page, action, entity])

  const translateRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên'
      case 'editor':
        return 'Biên tập viên'
      case 'reviewer':
        return 'Người duyệt bài'
      default:
        return role
    }
  }

  const getActionBadge = (actionName: string) => {
    let bg = '#f1f5f9'
    let color = '#475569'

    switch (actionName) {
      case 'create':
        bg = '#d1fae5'
        color = '#065f46'
        break
      case 'update':
        bg = '#e0f2fe'
        color = '#0369a1'
        break
      case 'delete':
        bg = '#fee2e2'
        color = '#991b1b'
        break
      case 'login':
        bg = '#ede9fe'
        color = '#5b21b6'
        break
      case 'logout':
        bg = '#f1f5f9'
        color = '#475569'
        break
      case 'publish':
        bg = '#dcfce7'
        color = '#15803d'
        break
      case 'reject':
        bg = '#fef3c7'
        color = '#b45309'
        break
    }

    return (
      <span style={{ background: bg, color, padding: '2px 8px', borderRadius: 'var(--radius-sm)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase' }}>
        {actionName}
      </span>
    )
  }

  // Cột hiển thị
  const columns = [
    {
      header: 'Thời gian',
      render: (row: ActivityLog) => (
        <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
          {formatDateTimeVi(row.createdAt)}
        </span>
      ),
      width: '150px',
    },
    {
      header: 'Người thực hiện',
      render: (row: ActivityLog) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong style={{ color: 'var(--color-gray-800)', fontSize: 'var(--font-size-sm)' }}>{row.user.name}</strong>
          <span style={{ fontSize: '10px', color: 'var(--color-gold-dark)', fontWeight: 600 }}>{translateRole(row.user.role)}</span>
        </div>
      ),
      width: '180px',
    },
    {
      header: 'Hành động',
      render: (row: ActivityLog) => getActionBadge(row.action),
      width: '110px',
    },
    {
      header: 'Chi tiết thao tác',
      render: (row: ActivityLog) => (
        <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', fontWeight: 500 }}>
          {row.details || '-'}
        </span>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      
      {/* Tiêu đề & Làm mới */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
            Nhật Ký Thao Tác Hệ Thống
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
            Kiểm tra vết các hoạt động tạo mới, cập nhật, xóa, duyệt và đăng nhập của ban biên tập viên.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="btn btn-ghost"
          style={{ gap: 'var(--space-2)', border: '1px solid var(--color-gray-200)' }}
        >
          <RefreshCw size={14} />
          Tải lại log
        </button>
      </div>

      {/* Thanh bộ lọc */}
      <div
        style={{
          background: 'var(--color-white)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-gray-200)',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 'var(--space-3)',
          flexWrap: 'wrap'
        }}
      >
        {/* Bộ lọc Hành động */}
        <select
          value={action}
          onChange={(e) => { setAction(e.target.value); setPage(1); }}
          style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', background: 'var(--color-white)', fontSize: 'var(--font-size-sm)' }}
        >
          <option value="">Tất cả hành động</option>
          <option value="create">Tạo mới (Create)</option>
          <option value="update">Cập nhật (Update)</option>
          <option value="delete">Xóa bỏ (Delete)</option>
          <option value="publish">Phê duyệt (Publish)</option>
          <option value="reject">Từ chối (Reject)</option>
          <option value="login">Đăng nhập (Login)</option>
          <option value="logout">Đăng xuất (Logout)</option>
        </select>

        {/* Bộ lọc Đối tượng */}
        <select
          value={entity}
          onChange={(e) => { setEntity(e.target.value); setPage(1); }}
          style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', background: 'var(--color-white)', fontSize: 'var(--font-size-sm)' }}
        >
          <option value="">Tất cả đối tượng</option>
          <option value="post">Bài viết (Post)</option>
          <option value="document">Tài liệu (Document)</option>
          <option value="category">Danh mục (Category)</option>
          <option value="event">Sự kiện (Event)</option>
          <option value="album">Album ảnh (Album)</option>
          <option value="user">Tài khoản (User)</option>
          <option value="contact">Liên hệ (Contact)</option>
        </select>
      </div>

      {/* Bảng DataTable Nhật ký */}
      <DataTable
        columns={columns}
        data={logs}
        loading={loading}
        emptyMessage="Chưa ghi nhận thao tác hệ thống nào tương ứng."
      />

      {/* Phân trang */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
