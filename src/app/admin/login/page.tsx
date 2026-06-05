'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { GraduationCap, Mail, Lock, ShieldAlert, CheckCircle2 } from 'lucide-react'

// Wrap trong component con để dùng useSearchParams an toàn trong Next.js App Router (tránh lỗi deopt build static)
function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/admin/dashboard'

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Đăng nhập thất bại')
      }

      // Đăng nhập thành công, chuyển hướng đến trang dashboard hoặc callbackUrl
      router.push(callbackUrl)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Đã xảy ra lỗi hệ thống.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {error && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--font-size-xs)',
            background: 'rgba(239, 68, 68, 0.1)',
            color: 'var(--color-danger-dark)',
            border: '1px solid rgba(239, 68, 68, 0.2)'
          }}
        >
          <ShieldAlert size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Email input */}
      <div>
        <label htmlFor="email" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
          Địa chỉ Email
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 'var(--space-3) var(--space-4) var(--space-3) var(--space-10)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none' }}
            placeholder="example@thpt.edu.vn"
          />
          <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
        </div>
      </div>

      {/* Password input */}
      <div>
        <label htmlFor="password" style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>
          Mật khẩu
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 'var(--space-3) var(--space-4) var(--space-3) var(--space-10)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none' }}
            placeholder="••••••••"
          />
          <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)' }} />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
        style={{ width: '100%', padding: 'var(--space-3)', fontSize: 'var(--font-size-sm)', fontWeight: 600, height: '44px', marginTop: 'var(--space-2)' }}
      >
        {loading ? 'Đang xác thực...' : 'Đăng nhập hệ thống'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--color-navy-dark) 0%, var(--color-navy) 100%)',
        padding: 'var(--space-6)'
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '400px',
          background: 'var(--color-white)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-2xl)',
          padding: 'var(--space-8) var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-6)'
        }}
      >
        {/* Logo block */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              background: 'var(--color-gold)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-navy-dark)',
              boxShadow: '0 4px 12px rgba(212, 168, 67, 0.4)'
            }}
          >
            <GraduationCap size={32} />
          </div>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-navy)', margin: 'var(--space-2) 0 0 0' }}>
            EDISON CMS
          </h2>
          <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>
            Hệ thống Quản trị Nội dung trường THPT
          </span>
        </div>

        {/* Login Form Wrapper */}
        <Suspense fallback={<div>Đang tải form...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
