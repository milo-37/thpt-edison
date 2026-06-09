'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'
import { isValidEmail, isValidPhone } from '@/lib/validation'

export default function AdmissionForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentClass: 'lop10',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: null, message: '' })

    try {
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error('Vui lòng nhập đầy đủ các trường thông tin bắt buộc')
      }

      if (!isValidEmail(formData.email)) {
        throw new Error('Địa chỉ email không đúng định dạng')
      }

      if (!isValidPhone(formData.phone)) {
        throw new Error('Số điện thoại không đúng định dạng Việt Nam')
      }

      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Đăng ký Tư vấn Tuyển sinh Lớp 10 (Học sinh dự tuyển: ${formData.studentClass.toUpperCase()})`,
          message: formData.message || 'Phụ huynh đăng ký tư vấn tuyển sinh lớp 10 năm học mới.',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gửi đăng ký tư vấn thất bại')
      }

      setStatus({
        type: 'success',
        message: 'Đăng ký tư vấn tuyển sinh thành công! Ban tư vấn sẽ liên hệ lại với phụ huynh trong 24 giờ tới.',
      })
      setFormData({
        name: '',
        email: '',
        phone: '',
        studentClass: 'lop10',
        message: '',
      })
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Có lỗi xảy ra. Vui lòng kiểm tra lại.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'sticky', top: '90px' }}>
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-navy)', borderBottom: '2px solid var(--color-gold)', paddingBottom: 'var(--space-2)', margin: 0 }}>
        Đăng ký tư vấn học
      </h3>
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', margin: 0 }}>
        Vui lòng điền thông tin dưới đây. Ban tư vấn tuyển sinh THPT Edison sẽ gọi lại tư vấn chi tiết cho phụ huynh.
      </p>

      {status.type && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? 'var(--color-success-dark)' : 'var(--color-danger-dark)', border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
          {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          <span>{status.message}</span>
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Họ và tên Phụ huynh *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', background: 'var(--color-white)', color: 'var(--color-gray-900)' }} placeholder="Nguyễn Văn A" />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Số điện thoại liên hệ *</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', background: 'var(--color-white)', color: 'var(--color-gray-900)' }} placeholder="0912345678" />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Địa chỉ Email *</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', background: 'var(--color-white)', color: 'var(--color-gray-900)' }} placeholder="example@gmail.com" />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Khối lớp dự tuyển *</label>
        <select name="studentClass" value={formData.studentClass} onChange={handleChange} style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', background: 'var(--color-white)', color: 'var(--color-gray-900)' }}>
          <option value="lop10" style={{ background: 'var(--color-white)', color: 'var(--color-gray-900)' }}>Dự tuyển vào lớp 10</option>
          <option value="lop11" style={{ background: 'var(--color-white)', color: 'var(--color-gray-900)' }}>Dự tuyển chuyển trường lớp 11</option>
          <option value="lop12" style={{ background: 'var(--color-white)', color: 'var(--color-gray-900)' }}>Dự tuyển chuyển trường lớp 12</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Câu hỏi của phụ huynh (nếu có)</label>
        <textarea name="message" value={formData.message} onChange={handleChange} rows={3} style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', resize: 'vertical', background: 'var(--color-white)', color: 'var(--color-gray-900)' }} placeholder="Nhập câu hỏi của bạn tại đây..." />
      </div>

      <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
        <Send size={16} />
        {loading ? 'Đang gửi đăng ký...' : 'Gửi đăng ký tư vấn'}
      </button>
    </form>
  )
}
