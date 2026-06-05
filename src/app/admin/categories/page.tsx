'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Folder, Save, X } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast, { ToastMessage } from '@/components/admin/Toast'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  order: number
  _count?: {
    posts: number
    documents: number
  }
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Form states (Cho cả chế độ Thêm mới và Sửa)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [order, setOrder] = useState('0')
  const [editId, setEditId] = useState<string | null>(null) // ID danh mục đang sửa
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/categories')
      const data = await res.json()
      if (data.categories) setCategories(data.categories)
    } catch {
      showToast('error', 'Lỗi tải danh sách danh mục')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Xử lý Gửi Form (Thêm mới hoặc Cập nhật)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name) {
      showToast('warning', 'Vui lòng nhập tên danh mục')
      return
    }

    setLoading(true)
    const categoryData = { name, description, order }

    try {
      const url = editId ? `/api/categories/${editId}` : '/api/categories'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Thao tác thất bại')
      }

      showToast('success', editId ? 'Cập nhật danh mục thành công!' : 'Tạo danh mục mới thành công!')
      resetForm()
      fetchCategories()
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  // Chuyển sang chế độ Sửa
  const handleEditClick = (cat: Category) => {
    setEditId(cat.id)
    setName(cat.name)
    setDescription(cat.description || '')
    setOrder(cat.order.toString())
  }

  // Hủy sửa
  const resetForm = () => {
    setEditId(null)
    setName('')
    setDescription('')
    setOrder('0')
  }

  // Xử lý Xóa danh mục
  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/categories/${deleteId}`, {
        method: 'DELETE',
      })

      const data = await res.json()

      if (res.ok) {
        showToast('success', 'Xóa danh mục thành công!')
        fetchCategories()
      } else {
        throw new Error(data.error || 'Xóa danh mục thất bại')
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
      header: 'Thứ tự',
      render: (row: Category) => <strong style={{ color: 'var(--color-navy)' }}>{row.order}</strong>,
      width: '80px',
    },
    {
      header: 'Tên danh mục',
      render: (row: Category) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-gray-800)' }}>{row.name}</span>
          <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>Slug: {row.slug}</span>
        </div>
      ),
    },
    {
      header: 'Mô tả',
      accessor: 'description' as keyof Category,
    },
    {
      header: 'Số bài viết',
      render: (row: Category) => <span>{row._count?.posts || 0} bài</span>,
    },
    {
      header: 'Số tài liệu',
      render: (row: Category) => <span>{row._count?.documents || 0} tài liệu</span>,
    },
    {
      header: 'Thao tác',
      render: (row: Category) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={() => handleEditClick(row)} className="btn btn-ghost btn-icon btn-sm" title="Sửa danh mục">
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ color: 'var(--color-danger)' }}
            title="Xóa danh mục"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      
      {/* Tiêu đề */}
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
          Quản Lý Danh Mục
        </h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
          Quản lý các danh mục phân loại bài viết tin tức và tài liệu học tập của trường.
        </p>
      </div>

      {/* Grid: Form bên trái / Lưới bên phải */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 'var(--space-8)' }}>
        
        {/* Cột trái: Form nhập liệu */}
        <div>
          <form
            onSubmit={handleSubmit}
            style={{
              background: 'var(--color-white)',
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-xl)',
              border: '1px solid var(--color-gray-200)',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-4)',
              position: 'sticky',
              top: '90px'
            }}
          >
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', borderBottom: '2px solid var(--color-gold)', paddingBottom: 'var(--space-2)', margin: 0 }}>
              {editId ? 'Sửa Danh Mục' : 'Thêm Danh Mục Mới'}
            </h3>

            {/* Tên danh mục */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
                Tên danh mục *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }}
                placeholder="Ví dụ: Tin nhà trường"
              />
            </div>

            {/* Thứ tự sắp xếp */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }}
              />
              <span style={{ fontSize: '10px', color: 'var(--color-gray-400)', display: 'block', marginTop: '2px' }}>
                Thứ tự số nhỏ hơn sẽ xếp lên trước.
              </span>
            </div>

            {/* Mô tả */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
                Mô tả ngắn
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)', resize: 'vertical' }}
                placeholder="Mô tả nội dung của danh mục này..."
              />
            </div>

            {/* Nút lưu */}
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              {editId && (
                <button type="button" onClick={resetForm} className="btn btn-ghost btn-sm" style={{ flex: 1 }}>
                  <X size={14} style={{ marginRight: '4px' }} />
                  Hủy sửa
                </button>
              )}
              <button type="submit" disabled={loading} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                <Save size={14} style={{ marginRight: '4px' }} />
                {editId ? 'Cập nhật' : 'Thêm mới'}
              </button>
            </div>
          </form>
        </div>

        {/* Cột phải: Bảng danh sách */}
        <div>
          <DataTable
            columns={columns}
            data={categories}
            loading={loading}
            emptyMessage="Chưa có danh mục nào được tạo."
          />
        </div>

      </div>

      {/* Xác nhận xóa & Toast */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Xóa danh mục"
        message="Bạn có chắc chắn muốn xóa danh mục này? Lưu ý: Không thể xóa danh mục nếu đang chứa bài viết hoặc tài liệu."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
