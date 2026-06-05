'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Check, Trash2, Mail, Phone, Calendar, User, Eye, X } from 'lucide-react'
import DataTable from '@/components/admin/DataTable'
import ConfirmModal from '@/components/admin/ConfirmModal'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import Pagination from '@/components/admin/Pagination'
import { formatDateVi } from '@/lib/validation'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string
  message: string
  isRead: boolean
  isHandled: boolean
  createdAt: string
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<ContactMessage[]>()
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  
  // Filter & Pagination
  const [isHandledFilter, setIsHandledFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Actions states
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  const fetchContacts = async () => {
    setLoading(true)
    let url = `/api/contacts?page=${page}&limit=8`
    if (isHandledFilter) {
      url += `&isHandled=${isHandledFilter}`
    }

    try {
      const res = await fetch(url)
      const data = await res.json()
      if (data.contacts) {
        setContacts(data.contacts)
        setTotalPages(data.pagination.totalPages)
      }
    } catch {
      showToast('error', 'Lỗi tải danh sách phản hồi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchContacts()
  }, [page, isHandledFilter])

  // Đánh dấu đã xử lý
  const handleMarkHandled = async (id: string, currentHandled: boolean) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHandled: !currentHandled, isRead: true }),
      })

      if (res.ok) {
        showToast('success', 'Cập nhật trạng thái xử lý phản hồi thành công!')
        setSelectedMessage(null)
        fetchContacts()
      } else {
        throw new Error('Thao tác thất bại')
      }
    } catch {
      showToast('error', 'Lỗi hệ thống')
    }
  }

  // Xử lý Xóa phản hồi
  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/contacts/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        showToast('success', 'Xóa phản hồi liên hệ thành công!')
        fetchContacts()
      } else {
        const data = await res.json()
        throw new Error(data.error || 'Thao tác xóa thất bại')
      }
    } catch (err: any) {
      showToast('error', err.message)
    } finally {
      setDeleteId(null)
    }
  }

  // Cột hiển thị
  const columns = [
    {
      header: 'Người gửi',
      render: (row: ContactMessage) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-gray-800)' }}>{row.name}</span>
          <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Mail size={10} /> {row.email} {row.phone && `| 📞 ${row.phone}`}
          </span>
        </div>
      ),
    },
    {
      header: 'Tiêu đề liên hệ',
      render: (row: ContactMessage) => (
        <span style={{ fontWeight: 600, color: 'var(--color-navy-light)' }}>{row.subject}</span>
      ),
    },
    {
      header: 'Trạng thái',
      render: (row: ContactMessage) => (
        <span
          style={{
            background: row.isHandled ? '#d1fae5' : '#fee2e2',
            color: row.isHandled ? '#065f46' : '#991b1b',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 600
          }}
        >
          {row.isHandled ? 'Đã xử lý' : 'Chưa xử lý'}
        </span>
      ),
    },
    {
      header: 'Ngày gửi',
      render: (row: ContactMessage) => <span>{formatDateVi(row.createdAt)}</span>,
    },
    {
      header: 'Thao tác',
      render: (row: ContactMessage) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          {/* Xem chi tiết */}
          <button onClick={() => setSelectedMessage(row)} className="btn btn-ghost btn-icon btn-sm" title="Xem chi tiết nội dung">
            <Eye size={14} />
          </button>
          
          {/* Đánh dấu xử lý nhanh */}
          {!row.isHandled && (
            <button
              onClick={() => handleMarkHandled(row.id, row.isHandled)}
              className="btn btn-ghost btn-icon btn-sm"
              style={{ color: 'var(--color-success)' }}
              title="Đánh dấu đã xử lý"
            >
              <Check size={16} />
            </button>
          )}

          {/* Xóa */}
          <button
            onClick={() => setDeleteId(row.id)}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ color: 'var(--color-danger)' }}
            title="Xóa phản hồi"
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 0 }}>
            Quản Lý Phản Hồi & Liên Hệ
          </h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
            Xem các yêu cầu tư vấn tuyển sinh, thắc mắc học phí, góp ý dịch vụ của phụ huynh học sinh gửi lên.
          </p>
        </div>
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
          alignItems: 'center'
        }}
      >
        <select
          value={isHandledFilter}
          onChange={(e) => { setIsHandledFilter(e.target.value); setPage(1); }}
          style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', background: 'var(--color-white)', fontSize: 'var(--font-size-sm)' }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="false">Chưa xử lý</option>
          <option value="true">Đã xử lý</option>
        </select>
      </div>

      {/* DataTable hiển thị danh sách */}
      <DataTable
        columns={columns}
        data={contacts || []}
        loading={loading}
        emptyMessage="Không tìm thấy liên hệ nào phù hợp."
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />

      {/* Modal xem chi tiết tin nhắn phản hồi */}
      {selectedMessage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div
            style={{
              background: 'var(--color-white)',
              width: '100%',
              maxWidth: '550px',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-2xl)',
              overflow: 'hidden',
              animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Header Modal */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <MessageSquare size={20} style={{ color: 'var(--color-primary)' }} />
                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-gray-800)', margin: 0 }}>
                  Chi tiết thư phản hồi
                </h4>
              </div>
              <button onClick={() => setSelectedMessage(null)} style={{ background: 'transparent', color: 'var(--color-gray-400)', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Content Modal */}
            <div style={{ padding: 'var(--space-6) var(--space-8)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-4)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600 }}>NGƯỜI GỬI</span>
                  <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-800)' }}>{selectedMessage.name}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600 }}>THỜI GIAN</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>{formatDateVi(selectedMessage.createdAt)}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600 }}>EMAIL</span>
                  <a href={`mailto:${selectedMessage.email}`} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)' }}>{selectedMessage.email}</a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600 }}>ĐIỆN THOẠI</span>
                    <a href={`tel:${selectedMessage.phone}`} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-800)' }}>{selectedMessage.phone}</a>
                  </div>
                )}
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600 }}>TIÊU ĐỀ THƯ</span>
                <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)' }}>{selectedMessage.subject}</strong>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600, marginBottom: 'var(--space-1)' }}>NỘI DUNG</span>
                <div style={{ background: 'var(--color-gray-50)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', minHeight: '100px', lineHeight: 1.6 }}>
                  {selectedMessage.message}
                </div>
              </div>

            </div>

            {/* Footer Modal Actions */}
            <div style={{ padding: 'var(--space-4) var(--space-6)', background: 'var(--color-gray-50)', borderTop: '1px solid var(--color-gray-100)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
              <button onClick={() => setSelectedMessage(null)} className="btn btn-ghost btn-sm">
                Đóng
              </button>
              {!selectedMessage.isHandled && (
                <button
                  onClick={() => handleMarkHandled(selectedMessage.id, selectedMessage.isHandled)}
                  className="btn btn-success btn-sm"
                  style={{ gap: '4px' }}
                >
                  <Check size={14} />
                  Đã giải quyết xong
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Xóa phản hồi"
        message="Bạn có chắc chắn muốn xóa thư liên hệ phản hồi này khỏi hệ thống?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
