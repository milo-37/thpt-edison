'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import FileUpload from '@/components/admin/FileUpload'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import ConfirmModal from '@/components/admin/ConfirmModal'

interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string | null
  rating: number
  order: number
  isActive: boolean
}

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [content, setContent] = useState('')
  const [avatar, setAvatar] = useState('')
  const [rating, setRating] = useState(5)
  const [order, setOrder] = useState(0)
  const [isActive, setIsActive] = useState(true)

  const fetchTestimonials = async () => {
    setLoading(true)
    const res = await fetch('/api/testimonials?all=true')
    const data = await res.json()
    if (data.testimonials) setTestimonials(data.testimonials)
    setLoading(false)
  }

  useEffect(() => { fetchTestimonials() }, [])

  const resetForm = () => {
    setName(''); setRole(''); setContent(''); setAvatar(''); setRating(5); setOrder(0); setIsActive(true)
    setEditingTestimonial(null); setShowForm(false)
  }

  const openEdit = (t: Testimonial) => {
    setEditingTestimonial(t); setName(t.name); setRole(t.role); setContent(t.content)
    setAvatar(t.avatar || ''); setRating(t.rating); setOrder(t.order); setIsActive(t.isActive); setShowForm(true)
  }

  const handleSave = async () => {
    if (!name || !content) { setToast({ id: Date.now().toString(), type: 'warning', message: 'Họ tên và nội dung đánh giá là bắt buộc' }); return }
    const body = { name, role, content, avatar, rating, order, isActive }
    const url = editingTestimonial ? `/api/testimonials/${editingTestimonial.id}` : '/api/testimonials'
    const method = editingTestimonial ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) {
      setToast({ id: Date.now().toString(), type: 'success', message: editingTestimonial ? 'Cập nhật đánh giá thành công!' : 'Thêm đánh giá thành công!' })
      resetForm(); fetchTestimonials()
    } else {
      const d = await res.json()
      setToast({ id: Date.now().toString(), type: 'error', message: d.error || 'Lỗi' })
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    const res = await fetch(`/api/testimonials/${deleteId}`, { method: 'DELETE' })
    if (res.ok) { setToast({ id: Date.now().toString(), type: 'success', message: 'Xóa đánh giá thành công!' }); fetchTestimonials() }
    setDeleteId(null)
  }

  const toggleActive = async (t: Testimonial) => {
    await fetch(`/api/testimonials/${t.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...t, isActive: !t.isActive }) })
    fetchTestimonials()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)' }}>Quản Lý Ý Kiến Phụ Huynh</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>Quản lý các nhận xét, đánh giá từ phụ huynh và học sinh hiển thị trên trang chủ.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn btn-primary" style={{ gap: '6px' }}><Plus size={16} /> Thêm Ý Kiến</button>
      </div>

      {/* Form thêm/sửa */}
      {showForm && (
        <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>{editingTestimonial ? 'Chỉnh Sửa Ý Kiến' : 'Thêm Ý Kiến Mới'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Họ tên người đánh giá *</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Nguyễn Văn A" style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Vai trò (ví dụ: Phụ huynh học sinh Lớp 10A2) *</label>
              <input type="text" value={role} onChange={e => setRole(e.target.value)} placeholder="Phụ huynh..." style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Số sao đánh giá (1-5)</label>
              <select value={rating} onChange={e => setRating(parseInt(e.target.value) || 5)} style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }}>
                <option value={5}>5 sao</option>
                <option value={4}>4 sao</option>
                <option value={3}>3 sao</option>
                <option value={2}>2 sao</option>
                <option value={1}>1 sao</option>
              </select>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Thứ tự hiển thị</label>
                <input type="number" value={order} onChange={e => setOrder(parseInt(e.target.value) || 0)} style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Trạng thái</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: 'var(--font-size-sm)', cursor: 'pointer' }}>
                  <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)} /> Hiển thị công khai
                </label>
              </div>
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Nội dung nhận xét *</label>
              <textarea value={content} onChange={e => setContent(e.target.value)} rows={3} placeholder="Lời nhận xét..." style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)', resize: 'vertical' }} />
            </div>
          </div>
          <div style={{ marginTop: 'var(--space-4)' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>Ảnh đại diện người nhận xét</label>
            <FileUpload type="image" subDir="images" value={avatar || ''} onUploadSuccess={f => setAvatar(f.filePath)} label="Upload ảnh chân dung đại diện (Tỷ lệ 1:1 tối ưu)" />
            {avatar && !avatar.startsWith('/uploads') && (
              <div style={{ marginTop: 'var(--space-2)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: '4px' }}>Hoặc nhập URL ảnh:</label>
                <input type="text" value={avatar} onChange={e => setAvatar(e.target.value)} style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
              </div>
            )}
            {!avatar && (
              <div style={{ marginTop: 'var(--space-2)' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: '4px' }}>Hoặc nhập URL ảnh:</label>
                <input type="text" value={avatar} onChange={e => setAvatar(e.target.value)} placeholder="https://..." style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
              </div>
            )}
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <button onClick={resetForm} className="btn btn-ghost">Hủy</button>
            <button onClick={handleSave} className="btn btn-primary">{editingTestimonial ? 'Cập nhật' : 'Thêm mới'}</button>
          </div>
        </div>
      )}

      {/* Danh sách testimonials */}
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        {loading ? <p style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: 'var(--space-8)' }}>Đang tải...</p> :
          testimonials.length === 0 ? <p style={{ textAlign: 'center', color: 'var(--color-gray-400)', padding: 'var(--space-8)' }}>Chưa có ý kiến đánh giá nào.</p> :
            testimonials.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', background: 'var(--color-white)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', opacity: t.isActive ? 1 : 0.5 }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'var(--color-gray-100)', border: '2px solid var(--color-gold)' }}>
                  <img src={t.avatar || '/uploads/images/31aaeadd-50b6-4821-b138-f841c019f772.jpg'} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{t.name}</h4>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>({t.role})</span>
                  </div>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-600)', margin: '4px 0', fontStyle: 'italic' }}>"{t.content}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--color-gray-400)' }}>
                    <span>Thứ tự: {t.order}</span>
                    <span>|</span>
                    <span style={{ display: 'flex', color: '#fbbf24', gap: '1px' }}>
                      {[...Array(t.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" stroke="none" />)}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                  <button onClick={() => toggleActive(t)} className="btn btn-ghost btn-icon" title={t.isActive ? 'Ẩn' : 'Hiện'}>{t.isActive ? <Eye size={16} /> : <EyeOff size={16} />}</button>
                  <button onClick={() => openEdit(t)} className="btn btn-ghost btn-icon" title="Sửa"><Edit2 size={16} /></button>
                  <button onClick={() => setDeleteId(t.id)} className="btn btn-ghost btn-icon" title="Xóa" style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
                </div>
              </div>
            ))
        }
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Xóa đánh giá?" message="Đánh giá sẽ bị xóa vĩnh viễn khỏi trang chủ." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
