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
    <form onSubmit={handleSubmit} className="contact-form" style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-100)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-navy)', borderBottom: '2px solid var(--color-gold)', paddingBottom: 'var(--space-2)', margin: '0 0 var(--space-2) 0' }}>
        Gửi Tin Nhắn Liên Hệ
      </h3>

      {status.type && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-sm)',
            background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            color: status.type === 'success' ? 'var(--color-success-dark)' : 'var(--color-danger-dark)',
            border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
          }}
        >
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{status.message}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
            Họ và tên *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none' }}
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label htmlFor="phone" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none' }}
            placeholder="0912345678"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
          Địa chỉ Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none' }}
          placeholder="example@gmail.com"
        />
      </div>

      <div>
        <label htmlFor="subject" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
          Tiêu đề *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none' }}
          placeholder="Hỏi về học phí, tuyển sinh..."
        />
      </div>

      <div>
        <label htmlFor="message" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
          Nội dung liên hệ *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', resize: 'vertical' }}
          placeholder="Nhập nội dung tin nhắn của bạn ở đây..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{ width: '100%', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}
      >
        <Send size={16} />
        {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
      </button>
    </form>
  )
}
