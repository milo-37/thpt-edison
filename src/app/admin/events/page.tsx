'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Edit2, Calendar, MapPin, Clock, Save, X } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import { formatDateVi, formatDateTimeVi } from '@/lib/validation'

interface SchoolEvent {
  id: string
  title: string
  description: string | null
  startDate: string
  endDate: string | null
  location: string | null
  createdAt: string
}

export default function AdminEventsPage() {
  const [events, setEvents] = useState<SchoolEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Actions states
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [location, setLocation] = useState('')

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/events')
      const data = await res.json()
      if (data.events) setEvents(data.events)
    } catch {
      showToast('error', 'Lỗi tải danh sách sự kiện')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  // Nộp form lưu sự kiện
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !startDate) {
      showToast('warning', 'Tiêu đề và ngày bắt đầu là bắt buộc')
      return
    }

    setLoading(true)
    const eventData = {
      title,
      description,
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : null,
      location,
    }

    try {
      const url = editId ? `/api/events/${editId}` : '/api/events'
      const method = editId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Lưu sự kiện thất bại')
      }

      showToast('success', editId ? 'Cập nhật sự kiện thành công!' : 'Tạo sự kiện mới thành công!')
      resetForm()
      fetchEvents()
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setLoading(false)
    }
  }

  // Chuyển sang chế độ Sửa sự kiện
  const handleEditClick = (event: SchoolEvent) => {
    setEditId(event.id)
    setIsFormOpen(true)
    setTitle(event.title)
    setDescription(event.description || '')
    
    // Format date string to datetime-local input value (YYYY-MM-DDTHH:MM)
    const formatToDatetimeLocal = (isoString: string) => {
      const d = new Date(isoString)
      const pad = (num: number) => num.toString().padStart(2, '0')
      return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    }

    setStartDate(formatToDatetimeLocal(event.startDate))
    setEndDate(event.endDate ? formatToDatetimeLocal(event.endDate) : '')
    setLocation(event.location || '')
  }

  // Xóa sự kiện
  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/events/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        showToast('success', 'Xóa sự kiện thành công!')
        fetchEvents()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Xóa sự kiện thất bại')
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
    setStartDate('')
    setEndDate('')
    setLocation('')
    setEditId(null)
    setIsFormOpen(false)
  }

  // Cột hiển thị
  const columns = [
    {
      header: 'Thời gian diễn ra',
      render: (row: SchoolEvent) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Clock size={16} style={{ color: 'var(--color-primary)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600 }}>{formatDateTimeVi(row.startDate)}</span>
            {row.endDate && <span style={{ fontSize: '11px', color: 'var(--color-gray-400)' }}>Đến: {formatDateTimeVi(row.endDate)}</span>}
          </div>
        </div>
      ),
      width: '220px',
    },
    {
      header: 'Tên sự kiện',
      render: (row: SchoolEvent) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-gray-800)' }}>{row.title}</span>
          {row.description && <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{row.description}</span>}
        </div>
      ),
    },
    {
      header: 'Địa điểm',
      render: (row: SchoolEvent) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: 'var(--font-size-sm)' }}>
          <MapPin size={14} style={{ color: 'var(--color-gold-dark)' }} />
          <span>{row.location || 'Tại trường'}</span>
        </div>
      ),
    },
    {
      header: 'Thao tác',
      render: (row: SchoolEvent) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={() => handleEditClick(row)} className="btn btn-ghost btn-icon btn-sm" title="Sửa sự kiện">
            <Edit2 size={14} />
          </button>
          <button
            onClick={() => setDeleteId(row.id)}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ color: 'var(--color-danger)' }}
            title="Xóa sự kiện"
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
            Quản Lý Lịch Sự Kiện Trường
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
            Đăng ký và lên lịch trình các kỳ thi tốt nghiệp, lễ bế giảng khai giảng, hội nghị phụ huynh.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="btn btn-primary"
          style={{ gap: 'var(--space-2)' }}
        >
          {isFormOpen ? <X size={16} /> : <Plus size={16} />}
          {isFormOpen ? 'Hủy bỏ' : 'Lên lịch sự kiện'}
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
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-4)',
            animation: 'fadeInDown 0.3s ease'
          }}
        >
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Tiêu đề sự kiện *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} placeholder="Ví dụ: Đại hội Cha mẹ học sinh đầu năm" />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Thời gian bắt đầu *</label>
            <input type="datetime-local" value={startDate} onChange={(e) => setStartDate(e.target.value)} required style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Thời gian kết thúc (Tùy chọn)</label>
            <input type="datetime-local" value={endDate} onChange={(e) => setEndDate(e.target.value)} style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Địa điểm tổ chức</label>
            <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }} placeholder="Ví dụ: Phòng họp Hội đồng tầng 3" />
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Mô tả nội dung sự kiện</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)', resize: 'vertical' }} placeholder="Nhập các nội dung chi tiết hoặc lưu ý cho giáo viên/học sinh về sự kiện này..." />
          </div>

          <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
            <button type="button" onClick={resetForm} className="btn btn-ghost">Hủy bỏ</button>
            <button type="submit" disabled={loading} className="btn btn-primary" style={{ gap: 'var(--space-2)' }}>
              <Save size={16} /> {editId ? 'Cập nhật sự kiện' : 'Lên lịch trình'}
            </button>
          </div>
        </form>
      )}

      {/* Bảng danh sách sự kiện */}
      <DataTable
        columns={columns}
        data={events}
        loading={loading}
        emptyMessage="Không có sự kiện nào trong hệ thống."
      />

      <ConfirmModal
        isOpen={deleteId !== null}
        title="Xóa sự kiện"
        message="Bạn có chắc chắn muốn xóa sự kiện này khỏi lịch trình hoạt động của trường không?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
