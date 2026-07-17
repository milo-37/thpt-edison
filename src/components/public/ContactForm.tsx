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
        borderRadius: '24px', 
        border: '1px solid rgba(99, 102, 241, 0.15)', 
        boxShadow: '0 20px 40px rgba(99, 102, 241, 0.04)', 
        display: 'flex', 
        flexDirection: 'column', 
        gap: 'var(--space-5)',
        position: 'relative'
      }}
    >
      <style>{`
        .futuristic-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(99, 102, 241, 0.15);
          outline: none;
          background: var(--glass-bg);
          color: var(--color-navy);
          font-size: var(--font-size-sm);
          transition: all 0.25s ease;
        }
        .futuristic-input:focus {
          border-color: #6366f1;
          background: var(--glass-bg);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.12);
        }
        .submit-btn {
          width: 100%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: var(--space-2);
          border-radius: 12px;
          padding: 14px 28px;
          font-weight: 700;
          font-size: var(--font-size-base);
          color: white;
          background: linear-gradient(135deg, #6366f1, #a855f7);
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.2);
        }
        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3);
          opacity: 0.95;
        }
        .submit-btn:active {
          transform: translateY(0);
        }
        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-navy)', paddingBottom: 'var(--space-2)', margin: '0 0 var(--space-1) 0', fontFamily: 'var(--font-title)', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
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
            background: status.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            color: status.type === 'success' ? '#10b981' : '#ef4444',
            border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)'}`,
            fontWeight: 500
          }}
        >
          {status.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          <span>{status.message}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        <div>
          <label htmlFor="name" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
            Họ và tên *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="futuristic-input"
            placeholder="Nguyễn Văn A"
          />
        </div>

        <div>
          <label htmlFor="phone" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
            Số điện thoại
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="futuristic-input"
            placeholder="0912345678"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
          Địa chỉ Email *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="futuristic-input"
          placeholder="example@gmail.com"
        />
      </div>

      <div>
        <label htmlFor="subject" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
          Tiêu đề *
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          required
          className="futuristic-input"
          placeholder="Hỏi về học phí, tuyển sinh lớp 10..."
        />
      </div>

      <div>
        <label htmlFor="message" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: '6px' }}>
          Nội dung liên hệ *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className="futuristic-input"
          style={{ resize: 'vertical' }}
          placeholder="Nhập nội dung tin nhắn của bạn ở đây..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="submit-btn"
      >
        <Send size={16} />
        {loading ? 'Đang gửi...' : 'Gửi liên hệ'}
      </button>
    </form>
  )
}
