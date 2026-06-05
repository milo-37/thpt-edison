'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Globe, Calendar as CalendarIcon } from 'lucide-react'

interface UserSession {
  name: string
  email: string
  role: string
}

export default function AdminHeader() {
  const [user, setUser] = useState<UserSession | null>(null)
  const [currentDate, setCurrentDate] = useState('')

  useEffect(() => {
    // Lấy user info
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user)
        }
      })
      .catch(() => {})

    // Format ngày giờ Việt Nam
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    setCurrentDate(new Date().toLocaleDateString('vi-VN', options))
  }, [])

  const translateRole = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Quản trị viên'
      case 'editor':
        return 'Biên tập viên'
      case 'reviewer':
        return 'Người duyệt bài'
      default:
        return role
    }
  }

  return (
    <header
      style={{
        height: '70px',
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-gray-200)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-8)',
        position: 'sticky',
        top: 0,
        zIndex: 90,
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      {/* Cột trái: Ngày giờ */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)' }}>
        <CalendarIcon size={16} />
        <span>Hôm nay: <strong>{currentDate}</strong></span>
      </div>

      {/* Cột phải: Xem website & User Profile info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
        {/* Nút quay lại trang chủ public */}
        <Link
          href="/"
          target="_blank"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-2)',
            fontSize: 'var(--font-size-xs)',
            fontWeight: 600,
            color: 'var(--color-primary)',
            padding: 'var(--space-2) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(59, 130, 246, 0.08)',
            transition: 'all var(--transition-fast)'
          }}
        >
          <Globe size={14} />
          Xem Website Công Khai
        </Link>

        {/* User profile dropdown đơn giản */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-800)', lineHeight: 1.2 }}>
              {user ? user.name : 'Đang tải...'}
            </span>
            <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-gold-dark)' }}>
              {user ? translateRole(user.role) : ''}
            </span>
          </div>

          <div
            style={{
              width: '40px',
              height: '40px',
              background: 'var(--color-gray-100)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-navy)',
              border: '2px solid var(--color-gray-200)'
            }}
          >
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  )
}
