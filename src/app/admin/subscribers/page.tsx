'use client'

import { useState, useEffect } from 'react'
import { Mail, Trash2, Download } from 'lucide-react'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import ConfirmModal from '@/components/admin/ConfirmModal'
import { formatDateVi } from '@/lib/validation'

interface Sub { id: string; email: string; name: string | null; isActive: boolean; createdAt: string }

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState<Sub[]>([])
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const fetchData = async () => { const r = await fetch('/api/subscribers'); const d = await r.json(); if (d.subscribers) setSubs(d.subscribers) }
  useEffect(() => { fetchData() }, [])

  const handleDelete = async () => {
    if (deleteId) {
      await fetch('/api/subscribers', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: deleteId }) })
      setToast({ id: Date.now().toString(), type: 'success', message: 'Xóa subscriber thành công!' })
      setDeleteId(null); fetchData()
    }
  }

  const exportCSV = () => {
    const csv = ['Email,Tên,Ngày đăng ký', ...subs.map(s => `${s.email},${s.name || ''},${s.createdAt}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'subscribers.csv'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)' }}>Đăng Ký Nhận Tin</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>Danh sách email đã đăng ký nhận tin tức từ nhà trường. Tổng: {subs.length}</p>
        </div>
        <button onClick={exportCSV} className="btn btn-outline" style={{ gap: '6px' }}><Download size={16} /> Xuất CSV</button>
      </div>

      <div style={{ background: 'var(--color-white)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--color-gray-50)' }}>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>#</th>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Email</th>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Tên</th>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'left', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Ngày đăng ký</th>
              <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-500)' }}></th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s, i) => (
              <tr key={s.id} style={{ borderTop: '1px solid var(--color-gray-100)' }}>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-400)' }}>{i + 1}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} style={{ color: 'var(--color-primary)' }} />
                    <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-navy)' }}>{s.email}</span>
                  </div>
                </td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>{s.name || '—'}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)' }}>{formatDateVi(new Date(s.createdAt))}</td>
                <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'right' }}>
                  <button onClick={() => setDeleteId(s.id)} className="btn btn-ghost btn-icon" style={{ color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {subs.length === 0 && <p style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-gray-400)' }}>Chưa có ai đăng ký.</p>}
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Xóa subscriber?" message="Email sẽ bị xóa khỏi danh sách." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
