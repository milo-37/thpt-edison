'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Image as ImageIcon, Camera, Save, X, Eye } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import FileUpload from '@/components/admin/FileUpload'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import { formatDateVi } from '@/lib/validation'

interface Photo {
  filePath: string
  caption: string
  order: number
}

interface Album {
  id: string
  title: string
  description: string | null
  coverImage: string | null
  createdAt: string
  _count?: {
    photos: number
  }
}

export default function AdminGalleryPage() {
  const [albums, setAlbums] = useState<Album[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Actions states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [photosList, setPhotosList] = useState<Photo[]>([])
  
  // State upload ảnh chi tiết tạm thời
  const [tempPhotoUrl, setTempPhotoUrl] = useState('')
  const [tempCaption, setTempCaption] = useState('')

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  const fetchAlbums = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/gallery')
      const data = await res.json()
      if (data.albums) setAlbums(data.albums)
    } catch {
      showToast('error', 'Lỗi tải danh sách album ảnh')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlbums()
  }, [])

  // Thêm ảnh chi tiết vào danh sách tạm thời của album
  const handleAddPhotoToAlbum = () => {
    if (!tempPhotoUrl) {
      showToast('warning', 'Vui lòng upload ảnh chi tiết trước')
      return
    }

    const newPhoto: Photo = {
      filePath: tempPhotoUrl,
      caption: tempCaption,
      order: photosList.length,
    }

    setPhotosList((prev) => [...prev, newPhoto])
    setTempPhotoUrl('')
    setTempCaption('')
    showToast('success', 'Đã thêm ảnh vào danh sách album!')
  }

  // Xóa ảnh khỏi danh sách tạm thời
  const handleRemovePhotoFromList = (idx: number) => {
    setPhotosList((prev) => prev.filter((_, i) => i !== idx))
  }

  // Nộp form lưu album
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) {
      showToast('warning', 'Tiêu đề album là bắt buộc')
      return
    }

    setLoading(true)
    const albumData = {
      title,
      description,
      coverImage: coverImage || (photosList.length > 0 ? photosList[0].filePath : ''),
      photos: photosList,
    }

    try {
      const url = editId ? `/api/gallery/${editId}` : '/api/gallery'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(albumData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Lưu album thất bại')
      }

      showToast('success', editId ? 'Cập nhật album thành công!' : 'Tạo album mới thành công!')
      resetForm()
      fetchAlbums()
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  // Chuyển sang chế độ Sửa album
  const handleEditClick = (album: Album) => {
    setLoading(true)
    setEditId(album.id)
    setIsFormOpen(true)
    
    // Gọi API lấy chi tiết album bao gồm photos list
    fetch(`/api/gallery?albumId=${album.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.album) {
          const a = data.album
          setTitle(a.title)
          setDescription(a.description || '')
          setCoverImage(a.coverImage || '')
          setPhotosList(a.photos || [])
        }
      })
      .catch(() => showToast('error', 'Lỗi tải ảnh chi tiết của album'))
      .finally(() => setLoading(false))
  }

  // Xóa album ảnh
  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/gallery/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        showToast('success', 'Xóa album ảnh thành công!')
        fetchAlbums()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Xóa album thất bại')
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
    setCoverImage('')
    setPhotosList([])
    setTempPhotoUrl('')
    setTempCaption('')
    setEditId(null)
    setIsFormOpen(false)
  }

  // Cột hiển thị
  const columns = [
    {
      header: 'Ảnh bìa',
      render: (row: Album) => (
        <div style={{ width: '64px', height: '48px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', border: '1px solid var(--color-gray-200)' }}>
          <img src={row.coverImage || '/uploads/images/gallery-default.jpg'} alt={row.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ),
      width: '100px',
    },
    {
      header: 'Tiêu đề album',
      render: (row: Album) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-gray-800)' }}>{row.title}</span>
          <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>Số lượng ảnh: {row._count?.photos || 0} ảnh</span>
        </div>
      ),
    },
    {
      header: 'Mô tả',
      accessor: 'description' as keyof Album,
    },
    {
      header: 'Ngày tạo',
      render: (row: Album) => <span>{formatDateVi(row.createdAt)}</span>,
    },
    {
      header: 'Thao tác',
      render: (row: Album) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={() => handleEditClick(row)} className="btn btn-ghost btn-icon btn-sm" title="Sửa album">
            <Plus size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ color: 'var(--color-danger)' }}
            title="Xóa album"
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
            Quản Lý Thư Viện Ảnh
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
            Tạo album hình ảnh các hoạt động thể thao, văn nghệ, hoạt động dã ngoại dâng hương của học sinh.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-primary"
          style={{ gap: 'var(--space-2)' }}
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen ? 'Hủy bỏ' : 'Tạo album ảnh mới'}
        </button>
      </div>

      {/* Form tạo mới/chỉnh sửa */}
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
          {/* Cột trái: Thông tin cơ bản */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)', margin: 0 }}>
              Thông tin album
            </h3>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>
                Tiêu đề album *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none' }}
                placeholder="Ví dụ: Đại hội thể thao học sinh Edison 2026"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>
                Mô tả ngắn
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', resize: 'vertical' }}
                placeholder="Giới thiệu nội dung, thời gian diễn ra hoạt động..."
              />
            </div>

            {/* Upload ảnh bìa */}
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>
                Ảnh bìa album (tự động lấy ảnh đầu nếu trống)
              </label>
              <FileUpload
                type="image"
                subDir="images"
                value={coverImage}
                onUploadSuccess={(file) => setCoverImage(file.filePath)}
                label="Tải ảnh bìa"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              <button type="button" onClick={resetForm} className="btn btn-ghost">
                Hủy bỏ
              </button>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
                <Save size={16} />
                {editId ? 'Cập nhật album' : 'Lưu album'}
              </button>
            </div>
          </div>

          {/* Cột phải: Quản lý danh sách ảnh chi tiết */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-2)', margin: 0 }}>
              Hình ảnh chi tiết trong album
            </h3>

            {/* Widget upload ảnh chi tiết tạm thời */}
            <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-gray-200)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <FileUpload
                type="image"
                subDir="images"
                value={tempPhotoUrl}
                onUploadSuccess={(file) => setTempPhotoUrl(file.filePath)}
                label="Chọn ảnh để thêm vào album"
              />
              <input
                type="text"
                value={tempCaption}
                onChange={(e) => setTempCaption(e.target.value)}
                placeholder="Nhập chú thích ngắn cho hình ảnh này..."
                style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-xs)' }}
              />
              <button
                type="button"
                onClick={handleAddPhotoToAlbum}
                className="btn btn-gold btn-sm"
                style={{ alignSelf: 'flex-end' }}
              >
                Thêm vào album
              </button>
            </div>

            {/* Danh sách ảnh hiện tại */}
            <div style={{ border: '1px solid var(--color-gray-200)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-3)', maxHeight: '250px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-500)' }}>
                Đã chọn ({photosList.length} ảnh):
              </span>
              {photosList.length === 0 ? (
                <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', textAlign: 'center', padding: 'var(--space-4)' }}>Chưa có ảnh nào được thêm.</span>
              ) : (
                photosList.map((photo, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--color-white)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-gray-100)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', overflow: 'hidden' }}>
                      <img src={photo.filePath} alt="List item" style={{ width: '32px', height: '24px', objectFit: 'cover', borderRadius: '2px' }} />
                      <span style={{ fontSize: '11px', color: 'var(--color-gray-600)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {photo.caption || 'Không có chú thích'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemovePhotoFromList(idx)}
                      style={{ background: 'transparent', color: 'var(--color-danger)', border: 'none', cursor: 'pointer' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </form>
      )}

      {/* Danh sách album dưới dạng DataTable */}
      <DataTable
        columns={columns}
        data={albums}
        loading={loading}
        emptyMessage="Chưa có album ảnh nào được tạo."
      />

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Xóa album ảnh"
        message="Bạn có chắc chắn muốn xóa album này? Toàn bộ hình ảnh bên trong album sẽ bị xóa khỏi cơ sở dữ liệu."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
