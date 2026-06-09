'use client'

import { useState, useEffect } from 'react'
import { 
  GraduationCap, 
  Save, 
  Settings, 
  Award, 
  FileText, 
  Calendar, 
  Users, 
  MessageSquare, 
  Check, 
  Trash2, 
  Mail, 
  Phone, 
  User, 
  Eye, 
  X,
  FileCheck2,
  Clock
} from 'lucide-react'
import PostEditor from '@/components/admin/PostEditor'
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

export default function AdminAdmissionPage() {
  const [activeTab, setActiveTab] = useState<'content' | 'registrations'>('content')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Tab 1: Content states
  const [admissionQuotaHtml, setAdmissionQuotaHtml] = useState('')
  const [admissionMethodsHtml, setAdmissionMethodsHtml] = useState('')
  const [admissionTimelineHtml, setAdmissionTimelineHtml] = useState('')

  // Tab 2: Registrations states
  const [registrations, setRegistrations] = useState<ContactMessage[]>([])
  const [regLoading, setRegLoading] = useState(true)
  const [regFilter, setRegFilter] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const showToast = (type: 'success' | 'error' | 'warning', message: string) => {
    setToast({ id: Date.now().toString(), type, message })
  }

  // Fetch settings for Tab 1
  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.settings) {
        setAdmissionQuotaHtml(data.settings.admissionQuotaHtml || '')
        setAdmissionMethodsHtml(data.settings.admissionMethodsHtml || '')
        setAdmissionTimelineHtml(data.settings.admissionTimelineHtml || '')
      }
    } catch {
      showToast('error', 'Lỗi tải nội dung trang tuyển sinh')
    } finally {
      setLoading(false)
    }
  }

  // Fetch registrations for Tab 2
  const fetchRegistrations = async () => {
    setRegLoading(true)
    let url = `/api/contacts?page=${page}&limit=8&type=admission`
    if (regFilter) {
      url += `&isHandled=${regFilter}`
    }

    try {
      const res = await fetch(url)
      const data = await res.json()
      if (data.contacts) {
        setRegistrations(data.contacts)
        setTotalPages(data.pagination.totalPages)
      }
    } catch {
      showToast('error', 'Lỗi tải danh sách đăng ký tư vấn')
    } finally {
      setRegLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  useEffect(() => {
    if (activeTab === 'registrations') {
      fetchRegistrations()
    }
  }, [activeTab, page, regFilter])

  // Save settings (Tab 1)
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          settings: {
            admissionQuotaHtml,
            admissionMethodsHtml,
            admissionTimelineHtml
          }
        })
      })

      if (res.ok) {
        showToast('success', 'Cập nhật nội dung tuyển sinh thành công!')
      } else {
        const d = await res.json()
        showToast('error', d.error || 'Lỗi lưu cấu hình')
      }
    } catch {
      showToast('error', 'Lỗi hệ thống khi lưu cấu hình')
    } finally {
      setSaving(false)
    }
  }

  // Handle Mark Handled (Tab 2)
  const handleMarkHandled = async (id: string, currentHandled: boolean) => {
    try {
      const res = await fetch(`/api/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isHandled: !currentHandled, isRead: true }),
      })

      if (res.ok) {
        showToast('success', 'Cập nhật trạng thái xử lý đăng ký tuyển sinh thành công!')
        setSelectedMessage(null)
        fetchRegistrations()
      } else {
        throw new Error()
      }
    } catch {
      showToast('error', 'Lỗi hệ thống khi cập nhật trạng thái')
    }
  }

  // Handle Delete Contact (Tab 2)
  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    try {
      const res = await fetch(`/api/contacts/${deleteId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        showToast('success', 'Xóa lượt đăng ký tuyển sinh thành công!')
        fetchRegistrations()
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

  // Registrations Columns Configuration
  const columns = [
    {
      header: 'Phụ huynh đăng ký',
      render: (row: ContactMessage) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
          <span style={{ fontWeight: 700, color: 'var(--color-navy)', fontSize: 'var(--font-size-sm)' }}>{row.name}</span>
          <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Mail size={10} /> {row.email} {row.phone && ` | 📞 ${row.phone}`}
          </span>
        </div>
      ),
    },
    {
      header: 'Thông tin đăng ký',
      render: (row: ContactMessage) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ fontWeight: 600, color: 'var(--color-gold-dark)', fontSize: '12px' }}>{row.subject}</span>
          <span style={{ fontSize: '11px', color: 'var(--color-gray-500)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', maxWidth: '250px' }}>
            {row.message}
          </span>
        </div>
      ),
    },
    {
      header: 'Trạng thái',
      render: (row: ContactMessage) => (
        <span
          style={{
            background: row.isHandled ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
            color: row.isHandled ? 'var(--color-success-dark)' : 'var(--color-danger-dark)',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 700
          }}
        >
          {row.isHandled ? 'Đã tư vấn' : 'Chờ xử lý'}
        </span>
      ),
    },
    {
      header: 'Thời gian đăng ký',
      render: (row: ContactMessage) => (
        <span style={{ fontSize: '12px', color: 'var(--color-gray-500)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={12} />
          {formatDateVi(row.createdAt)}
        </span>
      ),
    },
    {
      header: 'Thao tác',
      render: (row: ContactMessage) => (
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button onClick={() => setSelectedMessage(row)} className="btn btn-ghost btn-icon btn-sm" title="Xem chi tiết nội dung">
            <Eye size={14} />
          </button>
          
          {!row.isHandled && (
            <button
              onClick={() => handleMarkHandled(row.id, row.isHandled)}
              className="btn btn-ghost btn-icon btn-sm"
              style={{ color: 'var(--color-success)' }}
              title="Đánh dấu đã hoàn thành tư vấn"
            >
              <Check size={16} />
            </button>
          )}

          <button
            onClick={() => setDeleteId(row.id)}
            className="btn btn-ghost btn-icon btn-sm"
            style={{ color: 'var(--color-danger)' }}
            title="Xóa lượt đăng ký này"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      
      {/* Header */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, var(--color-navy-dark), var(--color-navy))', 
          padding: '24px 32px', 
          borderRadius: '24px', 
          color: 'var(--color-white)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'absolute', right: '-50px', top: '-50px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255, 107, 0, 0.08)', zIndex: 0 }} />
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GraduationCap size={32} />
          </div>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, margin: 0, color: 'var(--color-gold)' }}>Quản Lý Tuyển Sinh</h1>
            <p style={{ fontSize: 'var(--font-size-sm)', opacity: 0.8, margin: 0 }}>
              Cập nhật quy chế, mốc thời gian và quản lý danh sách đăng ký học của phụ huynh học sinh.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '2px' }}>
        <button
          onClick={() => setActiveTab('content')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-sm)',
            fontWeight: activeTab === 'content' ? 700 : 500,
            color: activeTab === 'content' ? 'var(--color-navy)' : 'var(--color-gray-400)',
            borderBottom: activeTab === 'content' ? '3px solid var(--color-gold)' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          📝 Biên soạn trang thông tin tuyển sinh
        </button>
        <button
          onClick={() => setActiveTab('registrations')}
          style={{
            padding: '12px 24px',
            border: 'none',
            background: 'transparent',
            fontSize: 'var(--font-size-sm)',
            fontWeight: activeTab === 'registrations' ? 700 : 500,
            color: activeTab === 'registrations' ? 'var(--color-navy)' : 'var(--color-gray-400)',
            borderBottom: activeTab === 'registrations' ? '3px solid var(--color-gold)' : '3px solid transparent',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)'
          }}
        >
          🎓 Danh sách đăng ký tư vấn tuyển sinh
        </button>
      </div>

      {/* CONTENT TAB */}
      {activeTab === 'content' && (
        <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}>
              <p style={{ color: 'var(--color-gray-400)' }}>Đang tải nội dung cấu hình tuyển sinh...</p>
            </div>
          ) : (
            <>
              {/* Box 1: Quota */}
              <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Award size={18} style={{ color: 'var(--color-gold)' }} /> 1. Chỉ tiêu & đối tượng tuyển sinh
                </h3>
                <PostEditor
                  value={admissionQuotaHtml}
                  onChange={(html) => setAdmissionQuotaHtml(html)}
                />
              </div>

              {/* Box 2: Methods */}
              <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={18} style={{ color: 'var(--color-gold)' }} /> 2. Phương thức tuyển sinh
                </h3>
                <PostEditor
                  value={admissionMethodsHtml}
                  onChange={(html) => setAdmissionMethodsHtml(html)}
                />
              </div>

              {/* Box 3: Timelines */}
              <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} style={{ color: 'var(--color-gold)' }} /> 3. Mốc lịch trình quan trọng
                </h3>
                <PostEditor
                  value={admissionTimelineHtml}
                  onChange={(html) => setAdmissionTimelineHtml(html)}
                />
              </div>

              {/* Save Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-2)' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                  style={{ width: '280px', gap: '8px', padding: '14px 24px', borderRadius: '16px', boxShadow: '0 4px 14px rgba(10, 75, 175, 0.25)' }}
                >
                  <Save size={18} /> {saving ? 'Đang lưu nội dung...' : 'Lưu nội dung trang tuyển sinh'}
                </button>
              </div>
            </>
          )}
        </form>
      )}

      {/* REGISTRATIONS TAB */}
      {activeTab === 'registrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          {/* Filters */}
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
              value={regFilter}
              onChange={(e) => { setRegFilter(e.target.value); setPage(1); }}
              style={{ padding: '8px 16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', background: 'var(--color-white)', fontSize: 'var(--font-size-sm)' }}
            >
              <option value="">Tất cả trạng thái tư vấn</option>
              <option value="false">Chờ xử lý (Chưa tư vấn)</option>
              <option value="true">Đã tư vấn xong</option>
            </select>
          </div>

          {/* List Table */}
          <DataTable
            columns={columns}
            data={registrations}
            loading={regLoading}
            emptyMessage="Chưa có lượt đăng ký tuyển sinh nào được gửi lên."
          />

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </div>
      )}

      {/* Detail Modal */}
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
              maxWidth: '580px',
              borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-2xl)',
              overflow: 'hidden',
              animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            {/* Header Modal */}
            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck2 size={20} style={{ color: 'var(--color-primary)' }} />
                <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-gray-800)', margin: 0 }}>
                  Thông tin đăng ký tuyển sinh chi tiết
                </h4>
              </div>
              <button onClick={() => setSelectedMessage(null)} style={{ background: 'transparent', color: 'var(--color-gray-400)', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {/* Content Modal */}
            <div style={{ padding: '24px 32px', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-4)' }}>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600 }}>PHỤ HUYNH</span>
                  <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-navy)' }}>{selectedMessage.name}</strong>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600 }}>THỜI GIAN GỬI</span>
                  <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>{formatDateVi(selectedMessage.createdAt)}</span>
                </div>
                <div>
                  <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600 }}>ĐỊA CHỈ EMAIL</span>
                  <a href={`mailto:${selectedMessage.email}`} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-primary)', fontWeight: 600 }}>{selectedMessage.email}</a>
                </div>
                {selectedMessage.phone && (
                  <div>
                    <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600 }}>SỐ ĐIỆN THOẠI</span>
                    <a href={`tel:${selectedMessage.phone}`} style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-800)', fontWeight: 600 }}>{selectedMessage.phone}</a>
                  </div>
                )}
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600 }}>LỚP ĐĂNG KÝ / CHỦ ĐỀ</span>
                <strong style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-800)' }}>{selectedMessage.subject}</strong>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', fontWeight: 600, marginBottom: 'var(--space-1)' }}>CÂU HỎI / LỜI NHẮN</span>
                <div style={{ background: 'var(--color-gray-50)', padding: '16px', borderRadius: '12px', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-700)', minHeight: '80px', lineHeight: 1.6, border: '1px solid var(--color-gray-200)' }}>
                  {selectedMessage.message}
                </div>
              </div>

            </div>

            {/* Footer Modal Actions */}
            <div style={{ padding: '16px 24px', background: 'var(--color-gray-50)', borderTop: '1px solid var(--color-gray-100)', display: 'flex', justifyContent: 'flex-end', gap: 'var(--space-3)' }}>
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
                  Đã hoàn thành tư vấn
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={deleteId !== null}
        title="Xóa lượt đăng ký"
        message="Bạn có chắc chắn muốn xóa lượt đăng ký tư vấn tuyển sinh này không? Dữ liệu bị xóa sẽ không thể phục hồi."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
