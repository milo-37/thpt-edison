'use client'

import { useEffect } from 'react'
import { CheckCircle, AlertCircle, AlertTriangle, X } from 'lucide-react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning'
  message: string
}

interface ToastProps {
  toast: ToastMessage | null
  onClose: () => void
  duration?: number
}

export default function Toast({ toast, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!toast) return

    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [toast, duration, onClose])

  if (!toast) return null

  const getStyle = () => {
    switch (toast.type) {
      case 'success':
        return {
          bg: '#ecfdf5',
          border: '#a7f3d0',
          color: '#065f46',
          icon: CheckCircle,
        }
      case 'error':
        return {
          bg: '#fef2f2',
          border: '#fca5a5',
          color: '#991b1b',
          icon: AlertCircle,
        }
      case 'warning':
        return {
          bg: '#fffbeb',
          border: '#fde68a',
          color: '#92400e',
          icon: AlertTriangle,
        }
    }
  }

  const style = getStyle()
  const Icon = style.icon

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-4) var(--space-6)',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-3)',
        color: style.color,
        minWidth: '300px',
        maxWidth: '450px',
        animation: 'slideInRight 0.3s ease'
      }}
    >
      <Icon size={20} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, flex: 1, lineHeight: 1.4 }}>
        {toast.message}
      </span>
      <button
        onClick={onClose}
        style={{
          background: 'transparent',
          border: 'none',
          color: style.color,
          opacity: 0.6,
          cursor: 'pointer',
          padding: '2px',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <X size={16} />
      </button>
    </div>
  )
}
