'use client'

import { useState } from 'react'
import { Send, CheckCircle2, Loader2 } from 'lucide-react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.trim()) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Đăng ký nhận tin thất bại')
      }

      setSuccess(true)
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Đã có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: '#10b981', 
          background: 'rgba(16, 185, 129, 0.08)', 
          padding: '12px 16px', 
          borderRadius: '12px',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 700,
          border: '1px solid rgba(16, 185, 129, 0.15)',
          animation: 'scaleIn 0.3s ease-out'
        }}
      >
        <CheckCircle2 size={18} />
        <span>Đăng ký nhận tin thành công!</span>
      </div>
    )
  }

  return (
    <form 
      onSubmit={handleSubmit} 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px',
        width: '100%'
      }}
    >
      <style>{`
        .newsletter-container {
          display: flex;
          background: var(--glass-bg);
          border-radius: 10px;
          padding: 4px;
          border: 1px solid rgba(255, 255, 255, 0.15);
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .newsletter-container:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 10px rgba(99, 102, 241, 0.3);
        }
        .newsletter-btn {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          color: white;
          border: none;
          border-radius: 6px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .newsletter-btn:hover {
          opacity: 0.9;
          transform: scale(1.05);
        }
        .newsletter-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
      <div className="newsletter-container">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Nhập email của bạn..."
          required
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            padding: '8px 12px',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-white)'
          }}
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !email}
          className="newsletter-btn"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
      {error && (
        <span style={{ fontSize: '11px', color: '#ef4444', paddingLeft: '4px' }}>
          {error}
        </span>
      )}
    </form>
  )
}
