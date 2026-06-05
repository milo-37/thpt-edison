'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, FolderDown, Download, Eye, EyeOff, Save, X } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import FileUpload from '@/components/admin/FileUpload'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import Pagination from '@/components/admin/Pagination'
import { formatDateVi, formatFileSize, getFileIcon } from '@/lib/validation'

interface DocumentFile {
  id: string
  title: string
  description: string | null
  filePath: string
  fileName: string
  fileSize: number
  fileType: string
  isVisible: boolean
  downloadCount: number
  createdAt: string
  category: { id: string; name: string } | null
}

interface Category {
  id: string
  name: string
}

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<DocumentFile[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Pagination states
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isVisible, setIsVisible] = useState(true)
  
  // File upload state
  const [uploadedFile, setUploadedFile] = useState<any>(null)

  // Actions states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  // Load Categories
  useEffect(() => {
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories)
      })
  }, [])

  // Load Documents
  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/documents?page=${page}&limit=8`)
      const data = await res.json()
      if (data.documents) {
        setDocuments(data.documents)
        setTotalPages(data.pagination.totalPages)
      }
    } catch {
      showToast('error', 'Lỗi tải danh sách tài liệu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDocuments()
  }, [page])

  // Xử lý nộp form thêm mới tài liệu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) {
      showToast('warning', 'Vui lòng nhập tiêu đề tài liệu')
      return
    }
    if (!uploadedFile) {
      showToast('warning', 'Vui lòng upload tệp tài liệu trước')
      return
    }

    setLoading(true)
    const docData = {
      title,
      description,
      categoryId,
      isVisible,
      filePath: uploadedFile.filePath,
      fileName: uploadedFile.fileName,
      fileSize: uploadedFile.fileSize,
      fileType: uploadedFile.fileType,
    }

    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(docData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Thêm tài liệu thất bại')
      }

      showToast('success', 'Đăng tải tài liệu thành công!')
      resetForm()
      fetchDocuments()
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  // Ẩn hiện tài liệu nhanh
  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !currentVisible }),
      })

      if (res.ok) {
        showToast('success', 'Cập nhật trạng thái hiển thị thành công!')
        fetchDocuments()
      } else {
        throw new Error('Cập nhật thất bại')
      }
    } catch {
      showToast('error', 'Lỗi hệ thống')
    }
  }

  // Xóa tài liệu
  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/documents/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        showToast('success', 'Xóa tài liệu thành công!')
        fetchDocuments()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Xóa tài liệu thất bại')
      }
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setDeleteId(null)
    }
  }

  const resetForm = () => {
    setTitle('')
    setDescription('')
    setCategoryId('')
    setIsVisible(true)
    setUploadedFile(null)
    setIsFormOpen(false)
  }

  // Định nghĩa cột hiển thị trong bảng
  const columns = [
    {
      header: 'Tên tài liệu',
      render: (row: DocumentFile) => (
        <div style={{ display: 'flex', gap: 'var(--space-3)', alignItems: 'center' }}>
          <span style={{ fontSize: 'var(--font-size-xl)' }}>{getFileIcon(row.fileType)}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontWeight: 600, color: 'var(--color-gray-800)' }}>{row.title}</span>
            <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>File: {row.fileName} ({formatFileSize(row.fileSize)})</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Danh mục',
      render: (row: DocumentFile) => <span>{row.category?.name || 'Không có'}</span>,
    },
    {
      header: 'Lượt tải',
      render: (row: DocumentFile) => (
        <span style={{ fontWeight: 600, color: 'var(--color-navy)' }}>{row.downloadCount}</span>
      ),
    },
    {
      header: 'Hiển thị',
      render: (row: DocumentFile) => (
        <button
          onClick={() => toggleVisibility(row.id, row.isVisible)}
          style={{ background: 'transparent', color: row.isVisible ? 'var(--color-success)' : 'var(--color-gray-400)', border: 'none', cursor: 'pointer' }}
          title={row.isVisible ? 'Click để ẩn' : 'Click để hiện'}
        >
          {row.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
        </button>
      ),
    },
    {
      header: 'Ngày đăng',
      render: (row: DocumentFile) => <span>{formatDateVi(row.createdAt)}</span>,
    },
    {
      header: 'Thao tác',
      render: (row: DocumentFile) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <a href={row.filePath} download className="btn btn-ghost btn-icon btn-sm" title="Tải xuống tệp">
            <Download size={14} />
          </a>
          <button
            onClick={() => setDeleteId(row.id)}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ color: 'var(--color-danger)' }}
            title="Xóa tài liệu"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      
      {/* Tiêu đề & Nút bật form */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
            Quản Lý Tài Liệu
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
            Upload tài liệu giáo trình ôn tập, các mẫu đơn xin phép, văn bản thông báo học sinh.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-primary"
          style={{ gap: 'var(--space-2)' }}
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen ? 'Hủy bỏ' : 'Đăng tải tài liệu'}
        </button>
      </div>

      {/* Form đăng tải (Chỉ hiển thị khi bấm nút) */}
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
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-6)',
            animation: 'fadeInDown 0.3s ease'
          }}
        >
          {/* Cột trái: Nhập thông tin */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>
                Tiêu đề tài liệu *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none' }}
                placeholder="Ví dụ: Đề cương Toán ôn thi Học kỳ II lớp 12"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>
                Danh mục tài liệu
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', background: 'var(--color-white)' }}
              >
                <option value="">-- Chọn danh mục --</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>
                Mô tả tài liệu
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', resize: 'vertical' }}
                placeholder="Thông tin giới thiệu ngắn về nội dung tài liệu..."
              />
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', cursor: 'pointer', marginTop: 'var(--space-2)' }}>
              <input
                type="checkbox"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                style={{ width: '16px', height: '16px' }}
              />
              <span>Cho phép học sinh/phụ huynh tìm thấy ngoài trang chủ public</span>
            </label>
          </div>

          {/* Cột phải: Drag Drop File Upload */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', justifyContent: 'center' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)' }}>
              Tải lên file tài liệu *
            </label>
            <FileUpload
              type="document"
              subDir="documents"
              onUploadSuccess={(file) => setUploadedFile(file)}
              label="Kéo thả file PDF, Word, Excel hoặc click để chọn"
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              <button type="button" onClick={resetForm} className="btn btn-ghost">
                Hủy bỏ
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
                <Save size={16} />
                Lưu tài liệu
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Bảng Dữ liệu tài liệu */}
      <DataTable
        columns={columns}
        data={documents}
        loading={loading}
        emptyMessage="Chưa có tài liệu nào được đăng tải."
      />

      {/* Phân trang */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {/* Modal xác nhận xóa */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Xóa tài liệu"
        message="Bạn có chắc chắn muốn xóa tài liệu này? Hành động này sẽ xóa tệp tin vĩnh viễn khỏi hệ thống."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
