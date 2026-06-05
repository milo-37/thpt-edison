'use client'

import { AlertTriangle, X } from 'lucide-react'

interface ConfirmModalProps {
  isOpen: boolean
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  type?: 'danger' | 'warning' | 'info'
}

export default function ConfirmModal({
  isOpen,
  title = 'Xác nhận hành động',
  message = 'Bạn có chắc chắn muốn thực hiện hành động này không? Thao tác này không thể hoàn tác.',
  confirmText = 'Xác nhận',
  cancelText = 'Hủy bỏ',
  onConfirm,
  onCancel,
  type = 'danger',
}: ConfirmModalProps) {
  if (!isOpen) return null

  const getThemeColor = () => {
    switch (type) {
      case 'warning':
        return { main: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)', btn: 'btn-gold' }
      case 'info':
        return { main: 'var(--color-primary)', bg: 'rgba(59,130,246,0.1)', btn: 'btn-primary' }
      default:
        return { main: 'var(--color-danger)', bg: 'rgba(239,68,68,0.1)', btn: 'btn-danger' }
    }
  }

  const theme = getThemeColor()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.6)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        animation: 'fadeIn 0.2s ease'
      }}
    >
      <div
        style={{
          background: 'var(--color-white)',
          width: '100%',
          maxWidth: '440px',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-2xl)',
          overflow: 'hidden',
          animation: 'scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
        }}
      >
        {/* Header Modal */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--color-gray-100)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: theme.bg, color: theme.main, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <AlertTriangle size={18} />
            </div>
            <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-gray-800)', margin: 0 }}>
              {title}
            </h4>
          </div>
          <button onClick={onCancel} style={{ background: 'transparent', color: 'var(--color-gray-400)' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body Modal */}
        <div style={{ padding: 'var(--space-6) var(--space-8)' }}>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0, lineHeight: 1.6 }}>
            {message}
          </p>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: 'var(--space-4) var(--space-6)',
            background: 'var(--color-gray-50)',
            borderTop: '1px solid var(--color-gray-100)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--space-3)'
          }}
        >
          <button onClick={onCancel} className="btn btn-ghost btn-sm" style={{ fontWeight: 600 }}>
            {cancelText}
          </button>
          <button onClick={onConfirm} className={`btn ${theme.btn} btn-sm`} style={{ fontWeight: 600 }}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
