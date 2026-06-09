'use client'

import { useState } from 'react'
import { Send, CheckCircle, AlertCircle } from 'lucide-react'

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: null, message: '' })

    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gửi liên hệ thất bại')
      }

      setStatus({
        type: 'success',
        message: 'Cảm ơn bạn! Thông tin liên hệ đã được gửi thành công đến Ban Giám Hiệu.',
      })
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      className="glass-card" 
      style={{ 
        background: 'var(--glass-bg)', 
        backdropFilter: 'blur(20px)',
        padding: 'var(--space-8)', 
        borderRadius: 'var(--radius-xl)', 
        border: 'var(--glass-border)', 
        boxShadow: 'var(--shadow-lg)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-5)' 
      }}
    >
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-navy)', borderBottom: '2px solid var(--color-gold)', paddingBottom: 'var(--space-2)', margin: '0 0 var(--space-1) 0', fontFamily: 'var(--font-title)' }}>
        Gửi Tin Nhắn Liên Hệ
      </h3>

      {status.type && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-4)',
            borderRadius: '16px',
            fontSize: 'var(--font-size-sm)',
            background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: status.type === 'success' ? 'var(--color-success-dark)' : 'var(--color-danger-dark)',
            border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
            fontWeight: 500
          }}
        >
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{status.message}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-gray-700)', marginBottom: '6px' }}>
            Họ và tên *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="form-input"
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-input)', 
              border: '1.5px solid var(--color-gray-200)', 
              outline: 'none',
              background: 'var(--color-white)',
              transition: 'all var(--transition-fast)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)'
              e.target.style.boxShadow = '0 0 0 3px rgba(10, 75, 175, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-gray-200)'
              e.target.style.boxShadow = 'none'
            }}
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label htmlFor="phone" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-gray-700)', marginBottom: '6px' }}>
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="form-input"
            style={{ 
              width: '100%', 
              padding: '12px 16px', 
              borderRadius: 'var(--radius-input)', 
              border: '1.5px solid var(--color-gray-200)', 
              outline: 'none',
              background: 'var(--color-white)',
              transition: 'all var(--transition-fast)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary)'
              e.target.style.boxShadow = '0 0 0 3px rgba(10, 75, 175, 0.1)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-gray-200)'
              e.target.style.boxShadow = 'none'
            }}
            placeholder="0912345678"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-gray-700)', marginBottom: '6px' }}>
          Địa chỉ Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="form-input"
          style={{ 
            width: '100%', 
            padding: '12px 16px', 
            borderRadius: 'var(--radius-input)', 
            border: '1.5px solid var(--color-gray-200)', 
            outline: 'none',
            background: 'var(--color-white)',
            transition: 'all var(--transition-fast)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)'
            e.target.style.boxShadow = '0 0 0 3px rgba(10, 75, 175, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-gray-200)'
            e.target.style.boxShadow = 'none'
          }}
          placeholder="example@gmail.com"
        />
      </div>

      <div>
        <label htmlFor="subject" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-gray-700)', marginBottom: '6px' }}>
          Tiêu đề *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="form-input"
          style={{ 
            width: '100%', 
            padding: '12px 16px', 
            borderRadius: 'var(--radius-input)', 
            border: '1.5px solid var(--color-gray-200)', 
            outline: 'none',
            background: 'var(--color-white)',
            transition: 'all var(--transition-fast)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)'
            e.target.style.boxShadow = '0 0 0 3px rgba(10, 75, 175, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-gray-200)'
            e.target.style.boxShadow = 'none'
          }}
          placeholder="Hỏi về học phí, tuyển sinh lớp 10..."
        />
      </div>

      <div>
        <label htmlFor="message" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-gray-700)', marginBottom: '6px' }}>
          Nội dung liên hệ *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="form-textarea"
          style={{ 
            width: '100%', 
            padding: '12px 16px', 
            borderRadius: 'var(--radius-input)', 
            border: '1.5px solid var(--color-gray-200)', 
            outline: 'none', 
            resize: 'vertical',
            background: 'var(--color-white)',
            transition: 'all var(--transition-fast)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary)'
            e.target.style.boxShadow = '0 0 0 3px rgba(10, 75, 175, 0.1)'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-gray-200)'
            e.target.style.boxShadow = 'none'
          }}
          placeholder="Nhập nội dung tin nhắn của bạn ở đây..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary btn-lg"
        style={{ 
          width: '100%', 
          gap: 'var(--space-2)', 
          marginTop: 'var(--space-2)', 
          borderRadius: 'var(--radius-button)',
          padding: '14px 28px'
        }}
      >
        <Send size={16} />
        {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
      </button>
    </form>
  )
}
