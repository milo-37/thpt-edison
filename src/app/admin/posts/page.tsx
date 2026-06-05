'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Check, X, FileText, Search, Eye } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import Pagination from '@/components/admin/Pagination'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import { formatDateVi } from '@/lib/validation'

interface Post {
  id: string
  title: string
  status: string
  isFeatured: boolean
  isPinned: boolean
  viewCount: number
  publishedAt: string | null
  createdAt: string
  category: { name: string } | null
  author: { name: string }
}

interface Category {
  id: string
  name: string
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Modals & Toast State
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Load User Info
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setCurrentUser(data.user)
      })
  }, [])

  // Load Categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories)
      })
  }, [])

  // Load Posts based on filters
  const fetchPosts = () => {
    setLoading(true)
    let url = `/api/posts?page=${page}&limit=8`
    if (search) url += `&search=${encodeURIComponent(search)}`
    if (category) url += `&category=${category}`
    if (status) url += `&status=${status}`
    else url += `&status=` // rỗng để lấy tất cả trạng thái thay vì mặc định là published

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) {
          setPosts(data.posts)
          setTotalPages(data.pagination.totalPages)
        }
      })
      .catch((err) => showToast('error', 'Lỗi tải danh sách bài viết'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchPosts()
  }, [page, category, status])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchPosts()
  }

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  // Phê duyệt nhanh bài viết
  const handleApprove = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xuất bản bài viết này trực tiếp?')) return

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'published' }),
      })

      if (res.ok) {
        showToast('success', 'Đã phê duyệt xuất bản bài viết thành công!')
        fetchPosts()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Duyệt bài thất bại')
      }
    } catch (err: any) {
      showToast('error', err.message)
    }
  }

  // Từ chối phê duyệt nhanh
  const handleReject = async (id: string) => {
    const note = window.prompt('Nhập lý do từ chối bài viết:')
    if (note === null) return
    if (!note) {
      showToast('warning', 'Vui lòng cung cấp lý do từ chối bài viết.')
      return
    }

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected', note }),
      })

      if (res.ok) {
        showToast('success', 'Đã từ chối bài viết và ghi nhận lý do.')
        fetchPosts()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Thao tác thất bại')
      }
    } catch (err: any) {
      showToast('error', err.message)
    }
  }

  // Xử lý Xóa bài viết
  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/posts/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        showToast('success', 'Xóa bài viết thành công!')
        fetchPosts()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Xóa bài viết thất bại')
      }
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setDeleteId(null)
    }
  }

  // Định nghĩa cột hiển thị trong bảng
  const columns = [
    {
      header: 'Bài viết',
      render: (row: Post) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxWidth: '380px' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-gray-800)', fontSize: 'var(--font-size-sm)' }}>
            {row.title}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>
            Đăng bởi: {row.author.name} | Ngày tạo: {formatDateVi(row.createdAt)}
          </span>
        </div>
      ),
    },
    {
      header: 'Danh mục',
      render: (row: Post) => <span>{row.category?.name || 'Không có'}</span>,
    },
    {
      header: 'Trạng thái',
      render: (row: Post) => {
        switch (row.status) {
          case 'published':
            return <span style={{ background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 600 }}>Đã xuất bản</span>
          case 'pending':
            return <span style={{ background: '#fef3c7', color: '#92400e', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 600 }}>Chờ duyệt</span>
          case 'rejected':
            return <span style={{ background: '#fee2e2', color: '#991b1b', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 600 }}>Từ chối</span>
          default:
            return <span style={{ background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: 'var(--radius-full)', fontSize: '11px', fontWeight: 600 }}>Nháp</span>
        }
      },
    },
    {
      header: 'Đặc trưng / Ghim',
      render: (row: Post) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {row.isFeatured && <span style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--color-primary)', padding: '1px 6px', borderRadius: 'var(--radius-sm)', fontSize: '10px', fontWeight: 600 }}>Đặc trưng</span>}
          {row.isPinned && <span style={{ background: 'rgba(245,158,11,0.1)', color: 'var(--color-warning-dark)', padding: '1px 6px', borderRadius: 'var(--radius-sm)', fontSize: '10px', fontWeight: 600 }}>Ghim</span>}
          {!row.isFeatured && !row.isPinned && <span style={{ color: 'var(--color-gray-400)', fontSize: '11px' }}>-</span>}
        </div>
      ),
    },
    {
      header: 'Lượt xem',
      render: (row: Post) => (
        <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)' }}>
          {row.viewCount}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      render: (row: Post) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {/* Sửa */}
          <Link href={`/admin/posts/${row.id}/edit`} className="btn btn-ghost btn-icon btn-sm" title="Sửa bài viết">
            <Edit size={14} />
          </Link>

          {/* Duyệt bài nhanh (Reviewer / Admin) */}
          {row.status === 'pending' && currentUser && ['admin', 'reviewer'].includes(currentUser.role) && (
            <>
              <button
                onClick={() => handleApprove(row.id)}
                className="btn btn-ghost btn-icon btn-sm"
                style={{ color: 'var(--color-success)' }}
                title="Duyệt xuất bản bài viết"
              >
                <Check size={16} />
              </button>
              <button
                onClick={() => handleReject(row.id)}
                className="btn btn-ghost btn-icon btn-sm"
                style={{ color: 'var(--color-danger)' }}
                title="Từ chối xuất bản bài viết"
              >
                <X size={16} />
              </button>
            </>
          )}

          {/* Xóa */}
          <button
            onClick={() => setDeleteId(row.id)}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ color: 'var(--color-danger)' }}
            title="Xóa bài viết"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      
      {/* Tiêu đề & Nút Tạo mới */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
            Quản Lý Bài Viết
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
            Tạo bản tin nháp, viết thông báo mới, kiểm duyệt và xuất bản tin tức nhà trường.
          </p>
        </div>
        <Link href="/admin/posts/new" className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
          <Plus size={16} />
          Viết bài mới
        </Link>
      </div>

      {/* Thanh bộ lọc */}
      <div
        style={{
          background: 'var(--color-white)',
          padding: 'var(--space-4)',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--color-gray-200)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-4)',
          flexWrap: 'wrap'
        }}
      >
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: 'var(--space-2)', flex: 1, maxWidth: '350px' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài viết..."
              style={{
                width: '100%',
                padding: 'var(--space-2) var(--space-4) var(--space-2) var(--space-10)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-gray-300)',
                outline: 'none',
                fontSize: 'var(--font-size-sm)'
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)', pointerEvents: 'none' }} />
          </div>
          <button type="submit" className="btn btn-primary btn-sm">
            Tìm
          </button>
        </form>

        <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          {/* Lọc danh mục */}
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', background: 'var(--color-white)', fontSize: 'var(--font-size-sm)' }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>

          {/* Lọc trạng thái */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', background: 'var(--color-white)', fontSize: 'var(--font-size-sm)' }}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Bản nháp</option>
            <option value="pending">Chờ duyệt</option>
            <option value="published">Đã xuất bản</option>
            <option value="rejected">Bị từ chối</option>
          </select>
        </div>
      </div>

      {/* Bảng Dữ liệu */}
      <DataTable
        columns={columns}
        data={posts}
        loading={loading}
        emptyMessage="Không tìm thấy bài viết nào tương ứng."
      />

      {/* Phân trang */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {/* Modals & Toast notifications */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này không? Hành động này sẽ xóa vĩnh viễn bài viết cùng các tệp đính kèm liên quan."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
