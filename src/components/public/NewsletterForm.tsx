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
          color: 'var(--color-success)', 
          background: 'rgba(16, 185, 129, 0.1)', 
          padding: '12px 16px', 
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--font-size-sm)',
          fontWeight: 600,
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
      <div 
        style={{ 
          display: 'flex', 
          background: 'rgba(255, 255, 255, 0.08)', 
          borderRadius: 'var(--radius-md)', 
          padding: '4px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'var(--color-gold)'
          e.currentTarget.style.boxShadow = '0 0 10px rgba(255, 109, 0, 0.2)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)'
          e.currentTarget.style.boxShadow = 'none'
        }}
      >
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
          style={{
            background: 'var(--color-gold)',
            color: 'var(--color-navy-dark)',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'background 0.2s',
            opacity: email ? 1 : 0.6
          }}
          onMouseEnter={(e) => {
            if (email) e.currentTarget.style.background = 'var(--color-gold-light)'
          }}
          onMouseLeave={(e) => {
            if (email) e.currentTarget.style.background = 'var(--color-gold)'
          }}
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
        </button>
      </div>
      {error && (
        <span style={{ fontSize: '11px', color: 'var(--color-danger)', paddingLeft: '4px' }}>
          {error}
        </span>
      )}
    </form>
  )
}
