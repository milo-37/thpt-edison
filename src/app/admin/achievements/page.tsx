'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Trophy, Filter } from 'lucide-react'
import FileUpload from '@/components/admin/FileUpload'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import ConfirmModal from '@/components/admin/ConfirmModal'

interface Achievement { id: string; title: string; description: string | null; imageUrl: string | null; year: string | null; studentName: string | null; category: string; order: number; isActive: boolean }

const categoryLabels: Record<string, string> = { academic: 'Học thuật', sports: 'Thể thao', arts: 'Nghệ thuật', other: 'Khác' }
const categoryColors: Record<string, string> = { academic: '#2563eb', sports: '#16a34a', arts: '#9333ea', other: '#6b7280' }

export default function AdminAchievementsPage() {
  const [items, setItems] = useState<Achievement[]>([])
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [editing, setEditing] = useState<Achievement | null>(null)
  const [title, setTitle] = useState(''); const [desc, setDesc] = useState(''); const [img, setImg] = useState(''); const [year, setYear] = useState('')
  const [student, setStudent] = useState(''); const [cat, setCat] = useState('academic'); const [ord, setOrd] = useState(0)

  const fetchData = async () => { const r = await fetch('/api/achievements?all=true'); const d = await r.json(); if (d.achievements) setItems(d.achievements) }
  useEffect(() => { fetchData() }, [])
  const resetForm = () => { setTitle(''); setDesc(''); setImg(''); setYear(''); setStudent(''); setCat('academic'); setOrd(0); setEditing(null); setShowForm(false) }
  const openEdit = (a: Achievement) => { setEditing(a); setTitle(a.title); setDesc(a.description || ''); setImg(a.imageUrl || ''); setYear(a.year || ''); setStudent(a.studentName || ''); setCat(a.category); setOrd(a.order); setShowForm(true) }

  const handleSave = async () => {
    if (!title) { setToast({ id: Date.now().toString(), type: 'warning', message: 'Tiêu đề là bắt buộc' }); return }
    const body = { title, description: desc, imageUrl: img, year, studentName: student, category: cat, order: ord, isActive: true }
    const url = editing ? `/api/achievements/${editing.id}` : '/api/achievements'
    const res = await fetch(url, { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { setToast({ id: Date.now().toString(), type: 'success', message: 'Lưu thành công!' }); resetForm(); fetchData() }
  }

  const handleDelete = async () => { if (deleteId) { await fetch(`/api/achievements/${deleteId}`, { method: 'DELETE' }); setDeleteId(null); fetchData() } }
  const filtered = filter ? items.filter(i => i.category === filter) : items

  const inputStyle: React.CSSProperties = { width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)' }}>Quản Lý Thành Tích</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>Quản lý giải thưởng, thành tích học sinh hiển thị trên trang công khai.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn btn-primary" style={{ gap: '6px' }}><Plus size={16} /> Thêm Thành Tích</button>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
        <Filter size={16} style={{ color: 'var(--color-gray-400)' }} />
        <button onClick={() => setFilter('')} className={`btn btn-sm ${!filter ? 'btn-primary' : 'btn-ghost'}`}>Tất cả</button>
        {Object.entries(categoryLabels).map(([k, v]) => <button key={k} onClick={() => setFilter(k)} className={`btn btn-sm ${filter === k ? 'btn-primary' : 'btn-ghost'}`}>{v}</button>)}
      </div>

      {showForm && (
        <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>{editing ? 'Chỉnh Sửa' : 'Thêm Mới'}</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
            <div><label style={labelStyle}>Tiêu đề thành tích *</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Tên học sinh / Nhóm</label><input type="text" value={student} onChange={e => setStudent(e.target.value)} style={inputStyle} /></div>
            <div><label style={labelStyle}>Năm</label><input type="text" value={year} onChange={e => setYear(e.target.value)} style={inputStyle} placeholder="2026" /></div>
            <div>
              <label style={labelStyle}>Danh mục</label>
              <select value={cat} onChange={e => setCat(e.target.value)} style={inputStyle}>{Object.entries(categoryLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
            </div>
            <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Mô tả</label><textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} /></div>
            <div><label style={labelStyle}>Ảnh</label><FileUpload type="image" subDir="images" value={img} onUploadSuccess={f => setImg(f.filePath)} label="Upload ảnh" /></div>
            <div><label style={labelStyle}>Thứ tự</label><input type="number" value={ord} onChange={e => setOrd(parseInt(e.target.value) || 0)} style={inputStyle} /></div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <button onClick={resetForm} className="btn btn-ghost">Hủy</button>
            <button onClick={handleSave} className="btn btn-primary">Lưu</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {filtered.map(a => (
          <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', background: 'var(--color-white)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: `${categoryColors[a.category]}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Trophy size={22} style={{ color: categoryColors[a.category] }} />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{a.title}</h4>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)' }}>{a.studentName || ''} {a.year ? `• ${a.year}` : ''}</span>
            </div>
            <span style={{ fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: 'var(--radius-full)', background: `${categoryColors[a.category]}15`, color: categoryColors[a.category] }}>{categoryLabels[a.category]}</span>
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              <button onClick={() => openEdit(a)} className="btn btn-ghost btn-icon"><Edit2 size={16} /></button>
              <button onClick={() => setDeleteId(a.id)} className="btn btn-ghost btn-icon" style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal isOpen={!!deleteId} title="Xóa thành tích?" message="Thành tích sẽ bị xóa vĩnh viễn." onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
