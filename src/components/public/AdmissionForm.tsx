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
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        background: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(20px)',
        padding: 'var(--space-6)', 
        borderRadius: '24px', 
        border: '1px solid rgba(99, 102, 241, 0.15)', 
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.04)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-4)', 
        position: 'sticky', 
        top: '90px' 
      }}
    >
      <style>{`
        .admission-input {
          width: 100%;
          padding: 10px 14px;
          border-radius: 12px;
          border: 1.5px solid rgba(99, 102, 241, 0.15);
          outline: none;
          background: rgba(255, 255, 255, 0.85);
          color: var(--color-navy);
          font-size: 14px;
          transition: all 0.25s ease;
        }
        .admission-input:focus {
          border-color: #6366f1;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
        }
        .admission-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: var(--space-2);
          border-radius: 12px;
          padding: 12px 24px;
          font-weight: 700;
          font-size: 14px;
          color: white;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.18);
        }
        .admission-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.28);
          opacity: 0.95;
        }
        .admission-btn:active {
          transform: translateY(0);
        }
        .admission-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-navy)', paddingBottom: 'var(--space-2)', margin: 0, borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
        Đăng ký tư vấn học
      </h3>
      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.5 }}>
        Vui lòng điền thông tin dưới đây. Ban tư vấn tuyển sinh THPT Edison sẽ gọi lại tư vấn chi tiết cho phụ huynh.
      </p>

      {status.type && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', borderRadius: '12px', fontSize: 'var(--font-size-xs)', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)', color: status.type === 'success' ? '#10b981' : '#ef4444', border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}` }}>
          {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
          <span style={{ fontWeight: 500 }}>{status.message}</span>
        </div>
      )}

      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>Họ và tên Phụ huynh *</label>
        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="admission-input" placeholder="Nguyễn Văn A" />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>Số điện thoại liên hệ *</label>
        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className="admission-input" placeholder="0912345678" />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>Địa chỉ Email *</label>
        <input type="email" name="email" value={formData.email} onChange={handleChange} required className="admission-input" placeholder="example@gmail.com" />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>Khối lớp dự tuyển *</label>
        <select name="studentClass" value={formData.studentClass} onChange={handleChange} className="admission-input" style={{ cursor: 'pointer' }}>
          <option value="lop10">Dự tuyển vào lớp 10</option>
          <option value="lop11">Dự tuyển chuyển trường lớp 11</option>
          <option value="lop12">Dự tuyển chuyển trường lớp 12</option>
        </select>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-1)' }}>Câu hỏi của phụ huynh (nếu có)</label>
        <textarea name="message" value={formData.message} onChange={handleChange} rows={3} className="admission-input" style={{ resize: 'vertical' }} placeholder="Nhập câu hỏi của bạn tại đây..." />
      </div>

      <button type="submit" disabled={loading} className="admission-btn">
        <Send size={16} />
        {loading ? 'Đang gửi đăng ký...' : 'Gửi đăng ký tư vấn'}
      </button>
    </form>
  )
}
