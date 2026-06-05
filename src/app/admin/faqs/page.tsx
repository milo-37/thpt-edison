'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import ConfirmModal from '@/components/admin/ConfirmModal'

interface Faq { id: string; question: string; answer: string; category: string; order: number; isActive: boolean }

const categoryLabels: Record<string, string> = { general: 'Chung', admission: 'Tuyển sinh', tuition: 'Học phí', academic: 'Học tập' }

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<Faq[]>([])
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [question, setQuestion] = useState(''); const [answer, setAnswer] = useState(''); const [cat, setCat] = useState('general'); const [ord, setOrd] = useState(0)

  const fetchData = async () => { const r = await fetch('/api/faqs?all=true'); const d = await r.json(); if (d.faqs) setFaqs(d.faqs) }
  useEffect(() => { fetchData() }, [])

  const resetForm = () => { setQuestion(''); setAnswer(''); setCat('general'); setOrd(0); setEditing(null); setShowForm(false) }
  const openEdit = (f: Faq) => { setEditing(f); setQuestion(f.question); setAnswer(f.answer); setCat(f.category); setOrd(f.order); setShowForm(true) }

  const handleSave = async () => {
    if (!question || !answer) { setToast({ id: Date.now().toString(), type: 'warning', message: 'Câu hỏi và câu trả lời là bắt buộc' }); return }
    const body = { question, answer, category: cat, order: ord, isActive: true }
    const url = editing ? `/api/faqs/${editing.id}` : '/api/faqs'
    const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { setToast({ id: Date.now().toString(), type: 'success', message: 'Lưu thành công!' }); resetForm(); fetchData() }
  }

  const handleDelete = async () => { if (deleteId) { await fetch(`/api/faqs/${deleteId}`, { method: 'DELETE' }); setDeleteId(null); fetchData() } }

  const inputStyle: React.CSSProperties = { width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)' }}>Quản Lý Hỏi Đáp (FAQ)</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>Quản lý các câu hỏi thường gặp hiển thị trên trang Hỏi đáp và Chatbot.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn btn-primary" style={{ gap: '6px' }}><Plus size={16} /> Thêm FAQ</button>
      </div>

      {showForm && (
        <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>{editing ? 'Chỉnh Sửa' : 'Thêm Câu Hỏi Mới'}</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div><label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Câu hỏi *</label><input type="text" value={question} onChange={e => setQuestion(e.target.value)} style={inputStyle} placeholder="Ví dụ: Trường tuyển sinh như thế nào?" /></div>
            <div><label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Câu trả lời *</label><textarea value={answer} onChange={e => setAnswer(e.target.value)} rows={4} style={{ ...inputStyle, resize: 'vertical' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div><label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Danh mục</label><select value={cat} onChange={e => setCat(e.target.value)} style={inputStyle}>{Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select></div>
              <div><label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>Thứ tự</label><input type="number" value={ord} onChange={e => setOrd(parseInt(e.target.value) || 0)} style={inputStyle} /></div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <button onClick={resetForm} className="btn btn-ghost">Hủy</button>
            <button onClick={handleSave} className="btn btn-primary">Lưu</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {faqs.map(f => (
          <div key={f.id} style={{ background: 'var(--color-white)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
              <HelpCircle size={20} style={{ color: 'var(--color-primary)', flexShrink: 0, marginTop: '2px' }} />
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{f.question}</h4>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: '4px 0 0 0', lineHeight: 1.5 }}>{f.answer.substring(0, 150)}...</p>
                <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--color-gray-400)' }}>{categoryLabels[f.category]} • Thứ tự: {f.order}</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                <button onClick={() => openEdit(f)} className="btn btn-ghost btn-icon"><Edit2 size={16} /></button>
                <button onClick={() => setDeleteId(f.id)} className="btn btn-ghost btn-icon" style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Xóa FAQ?" message="Câu hỏi sẽ bị xóa khỏi trang Hỏi đáp." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
