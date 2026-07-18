'use client'

import { useState, useEffect } from 'react'
import { Plus, UserPlus, Trash2, Key, Shield, UserX, UserCheck, Save, X } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import { formatDateVi } from '@/lib/validation'

interface UserAccount {
  id: string
  email: string
  name: string
  role: string
  avatar: string | null
  isActive: boolean
  createdAt: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Actions states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [targetUserId, setTargetUserId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('editor')

  // Password reset state
  const [newPassword, setNewPassword] = useState('')

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  // Load Current User
  useEffect(() => {
    fetch('/api/auth/me', {
      cache: 'no-store',
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user)
      })
      .catch((err) => console.error(err))
  }, [])

  // Load Users List
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/users')
      const data = await res.json()
      if (data.users) setUsers(data.users)
      else if (data.error) showToast('error', data.error)
    } catch {
      showToast('error', 'Lỗi kết nối máy chủ')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Nộp form thêm mới tài khoản
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password || !name) {
      showToast('warning', 'Vui lòng nhập đầy đủ thông tin bắt buộc')
      return
    }

    setLoading(true)
    const userData = { email, password, name, role }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Tạo tài khoản thất bại')
      }

      showToast('success', 'Tạo tài khoản mới thành công!')
      resetForm()
      fetchUsers()
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  // Thay đổi mật khẩu
  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword || !targetUserId) {
      showToast('warning', 'Mật khẩu mới là bắt buộc')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/users/${targetUserId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Thay đổi mật khẩu thất bại')
      }

      showToast('success', 'Đã thay đổi mật khẩu tài khoản thành công!')
      setIsPasswordModalOpen(false)
      setNewPassword('')
      setTargetUserId(null)
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  // Kích hoạt / Khóa tài khoản nhanh
  const toggleActiveStatus = async (id: string, currentActive: boolean) => {
    if (currentUser && currentUser.id === id) {
      showToast('warning', 'Bạn không thể tự khóa tài khoản của chính mình.')
      return
    }

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentActive }),
      })

      if (res.ok) {
        showToast('success', 'Đã cập nhật trạng thái hoạt động tài khoản thành công!')
        fetchUsers()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Thao tác thất bại')
      }
    } catch (err: any) {
      showToast('error', err.message)
    }
  }

  // Xóa tài khoản
  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/users/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        showToast('success', 'Xóa tài khoản thành công!')
        fetchUsers()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Xóa tài khoản thất bại')
      }
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setDeleteId(null)
    }
  }

  const resetForm = () => {
    setEmail('')
    setPassword('')
    setName('')
    setRole('editor')
    setIsFormOpen(false)
  }

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

  // Cột hiển thị
  const columns = [
    {
      header: 'Họ và tên',
      render: (row: UserAccount) => (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <strong style={{ color: 'var(--color-gray-800)' }}>{row.name}</strong>
          <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>Email: {row.email}</span>
        </div>
      ),
    },
    {
      header: 'Vai trò',
      render: (row: UserAccount) => (
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-navy-light)' }}>
          <Shield size={14} />
          {translateRole(row.role)}
        </span>
      ),
    },
    {
      header: 'Trạng thái',
      render: (row: UserAccount) => (
        <button
          onClick={() => toggleActiveStatus(row.id, row.isActive)}
          style={{
            background: 'transparent',
            color: row.isActive ? 'var(--color-success)' : 'var(--color-danger)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600
          }}
          title={row.isActive ? 'Click để khóa tài khoản' : 'Click để kích hoạt'}
        >
          {row.isActive ? <UserCheck size={16} /> : <UserX size={16} />}
          {row.isActive ? 'Đang hoạt động' : 'Bị khóa'}
        </button>
      ),
    },
    {
      header: 'Ngày tạo',
      render: (row: UserAccount) => <span>{formatDateVi(row.createdAt)}</span>,
    },
    {
      header: 'Thao tác',
      render: (row: UserAccount) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {/* Đổi mật khẩu */}
          <button
            onClick={() => { setTargetUserId(row.id); setIsPasswordModalOpen(true); }}
            className="btn btn-ghost btn-icon btn-sm"
            title="Đổi mật khẩu tài khoản"
          >
            <Key size={14} />
          </button>
          
          {/* Xóa */}
          <button
            onClick={() => setDeleteId(row.id)}
            disabled={currentUser && currentUser.id === row.id}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ color: 'var(--color-danger)' }}
            title="Xóa tài khoản"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  // Tránh hiển thị dữ liệu nếu không phải Admin
  if (currentUser && currentUser.role !== 'admin') {
    return (
      <div style={{ padding: 'var(--space-12)', textAlign: 'center', color: 'var(--color-danger)' }}>
        Bạn không có quyền truy cập trang quản lý tài khoản. Chỉ Quản trị viên mới được truy cập mục này.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      
      {/* Tiêu đề & Nút bật form */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
            Quản Lý Tài Khoản Cán Bộ Giáo Viên
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
            Phân quyền tài khoản quản trị cho Giáo viên (Biên tập viên, Người duyệt bài viết, Quản trị viên).
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-primary"
          style={{ gap: 'var(--space-2)' }}
        >
          {isFormOpen ? <X size={16} /> : <UserPlus size={16} />}
          {isFormOpen ? 'Hủy bỏ' : 'Tạo tài khoản mới'}
        </button>
      </div>

      {/* Form tạo mới tài khoản */}
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          style={{
            background: 'var(--color-white)',
            padding: 'var(--space-6)',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-gray-200)',
            boxShadow: 'var(--shadow-md)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
            animation: 'fadeInDown 0.3s ease'
          }}
        >
          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Họ và tên cán bộ *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} placeholder="Nguyễn Văn A" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Địa chỉ Email *</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} placeholder="example@thpt.edu.vn" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Mật khẩu ban đầu *</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} placeholder="Mật khẩu tối thiểu 8 ký tự..." />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Vai trò phân quyền *</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', background: 'var(--color-white)', fontSize: 'var(--font-size-sm)' }}>
              <option value="editor">Biên tập viên (Editor)</option>
              <option value="reviewer">Người duyệt bài (Reviewer)</option>
              <option value="admin">Quản trị viên cao cấp (Admin)</option>
            </select>
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <button type="button" onClick={resetForm} className="btn btn-ghost">Hủy bỏ</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
              <Save size={16} /> Lưu tài khoản
            </button>
          </div>
        </form>
      )}

      {/* Bảng danh sách */}
      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        emptyMessage="Không có tài khoản nào được quản lý."
      />

      {/* Modal đổi mật khẩu */}
      {isPasswordModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={handlePasswordResetSubmit} style={{ background: 'var(--color-white)', width: '100%', maxWidth: '400px', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', boxShadow: 'var(--shadow-2xl)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', borderBottom: '2px solid var(--color-gold)', paddingBottom: 'var(--space-2)', margin: 0 }}>
              Đổi Mật Khẩu Tài Khoản
            </h3>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Mật khẩu mới *</label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none' }} placeholder="Tối thiểu 8 ký tự, gồm chữ hoa, thường và số" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)' }}>
              <button type="button" onClick={() => { setIsPasswordModalOpen(false); setNewPassword(''); setTargetUserId(null); }} className="btn btn-ghost">Hủy</button>
              <button type="submit" disabled={loading} className="btn btn-primary">Cập nhật mật khẩu</button>
            </div>
          </form>
        </div>
      )}

      {/* Modal xác nhận xóa tài khoản */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Xóa tài khoản"
        message="Bạn có chắc chắn muốn xóa tài khoản này? Hành động này sẽ xóa vĩnh viễn quyền truy cập của giáo viên khỏi hệ thống."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
