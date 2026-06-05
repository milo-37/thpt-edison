'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Image as ImageIcon, ArrowUpDown } from 'lucide-react'
import FileUpload from '@/components/admin/FileUpload'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import ConfirmModal from '@/components/admin/ConfirmModal'

interface Slide {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string
  linkUrl: string | null
  order: number
  isActive: boolean
}

export default function AdminSlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const fetchSlides = async () => {
    setLoading(true)
    const res = await fetch('/api/slides?all=true')
    const data = await res.json()
    if (data.slides) setSlides(data.slides)
    setLoading(false)
  }

  useEffect(() => { fetchSlides() }, [])

  const resetForm = () => {
    setTitle(''); setSubtitle(''); setImageUrl(''); setLinkUrl(''); setOrder(0); setIsActive(true)
    setEditingSlide(null); setShowForm(false)
  }

  const openEdit = (s: Slide) => {
    setEditingSlide(s); setTitle(s.title); setSubtitle(s.subtitle || ''); setImageUrl(s.imageUrl)
    setLinkUrl(s.linkUrl || ''); setOrder(s.order); setIsActive(s.isActive); setShowForm(true)
  }

  const handleSave = async () => {
    if (!title || !imageUrl) { setToast({ id: Date.now().toString(), type: 'warning', message: 'Tiêu đề và ảnh là bắt buộc' }); return }
    const body = { title, subtitle, imageUrl, linkUrl, order, isActive }
    const url = editingSlide ? `/api/slides/${editingSlide.id}` : '/api/slides'
    const method = editingSlide ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      setToast({ id: Date.now().toString(), type: 'success', message: editingSlide ? 'Cập nhật slide thành công!' : 'Thêm slide thành công!' })
      resetForm(); fetchSlides()
    } else {
      const d = await res.json()
      setToast({ id: Date.now().toString(), type: 'error', message: d.error || 'Lỗi' })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/slides/${deleteId}`, { method: 'DELETE' })
    if (res.ok) { setToast({ id: Date.now().toString(), type: 'success', message: 'Xóa slide thành công!' }); fetchSlides() }
    setDeleteId(null)
  }

  const toggleActive = async (s: Slide) => {
    await fetch(`/api/slides/${s.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...s, isActive: !s.isActive }) })
    fetchSlides()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)' }}>Quản Lý Slideshow</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>Quản lý ảnh slideshow hiển thị trên banner trang chủ.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn btn-primary" style={{ gap: '6px' }}><Plus size={16} /> Thêm Slide</button>
      </div>

      {/* Form thêm/sửa */}
      {showForm && (
        <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>{editingSlide ? 'Chỉnh Sửa Slide' : 'Thêm Slide Mới'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Tiêu đề *</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Tiêu đề slide" style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Mô tả phụ</label>
              <input type="text" value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="Dòng mô tả nhỏ" style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Link khi click (tuỳ chọn)</label>
              <input type="text" value={linkUrl} onChange={e => setLinkUrl(e.target.value)} placeholder="/tuyen-sinh" style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Thứ tự</label>
                <input type="number" value={order} onChange={e => setOrder(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Trạng thái</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: 'var(--font-size-sm)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Đang hiển thị
                </label>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>Ảnh slide *</label>
            <FileUpload type="image" subDir="images" value={imageUrl} onUploadSuccess={f => setImageUrl(f.filePath)} label="Upload ảnh slide (1600x600 tối ưu)" />
            {imageUrl && !imageUrl.startsWith('/uploads') && (
              <div style={{ marginTop: 'var(--space-2)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: '4px' }}>Hoặc nhập URL ảnh:</label>
                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
              </div>
            )}
            {!imageUrl && (
              <div style={{ marginTop: 'var(--space-2)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: '4px' }}>Hoặc nhập URL ảnh:</label>
                <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <button onClick={resetForm} className="btn btn-ghost">Hủy</button>
            <button onClick={handleSave} className="btn btn-primary">{editingSlide ? 'Cập nhật' : 'Thêm mới'}</button>
          </div>
        </div>
      )}

      {/* Danh sách slides */}
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        {loading ? <p style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: 'var(--space-8)' }}>Đang tải...</p> :
          slides.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: 'var(--space-8)' }}>Chưa có slide nào.</p> :
            slides.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', background: 'var(--color-white)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', opacity: s.isActive ? 1 : 0.5 }}>
                <div style={{ width: '160px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0, background: 'var(--color-gray-100)' }}>
                  <img src={s.imageUrl} alt={s.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 2px 0' }}>{s.title}</h4>
                  {s.subtitle && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: 0 }}>{s.subtitle}</p>}
                  <span style={{ fontSize: '10px', color: 'var(--color-gray-400)' }}>Thứ tự: {s.order} {s.linkUrl ? `| Link: ${s.linkUrl}` : ''}</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                  <button onClick={() => toggleActive(s)} className="btn btn-ghost btn-icon" title={s.isActive ? 'Ẩn' : 'Hiện'}>{s.isActive ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                  <button onClick={() => openEdit(s)} className="btn btn-ghost btn-icon" title="Sửa"><Edit2 size={16} /></button>
                  <button onClick={() => setDeleteId(s.id)} className="btn btn-ghost btn-icon" title="Xóa" style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))
        }
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Xóa slide?" message="Slide sẽ bị xóa vĩnh viễn khỏi trang chủ." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
