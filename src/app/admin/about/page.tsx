'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, Eye, EyeOff, UserCircle } from 'lucide-react'
import FileUpload from '@/components/admin/FileUpload'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import ConfirmModal from '@/components/admin/ConfirmModal'

interface Leader { id: string; name: string; role: string; description: string | null; avatar: string | null; order: number; isActive: boolean }
interface Teacher { id: string; name: string; subject: string; degree: string | null; description: string | null; avatar: string | null; order: number; isActive: boolean }

export default function AdminAboutPage() {
  const [leaders, setLeaders] = useState<Leader[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [tab, setTab] = useState<'general' | 'leaders' | 'teachers'>('general')
  const [showForm, setShowForm] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: string } | null>(null)

  // General settings state
  const [aboutHistoryText, setAboutHistoryText] = useState('')
  const [aboutHistoryImage, setAboutHistoryImage] = useState('')
  const [aboutVisionText, setAboutVisionText] = useState('')
  const [aboutMissionText, setAboutMissionText] = useState('')
  const [aboutCoreValuesText, setAboutCoreValuesText] = useState('')

  // Leader form
  const [lName, setLName] = useState(''); const [lRole, setLRole] = useState(''); const [lDesc, setLDesc] = useState('')
  const [lAvatar, setLAvatar] = useState(''); const [lOrder, setLOrder] = useState(0); const [lActive, setLActive] = useState(true)
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null)

  // Teacher form
  const [tName, setTName] = useState(''); const [tSubject, setTSubject] = useState(''); const [tDegree, setTDegree] = useState('')
  const [tDesc, setTDesc] = useState(''); const [tAvatar, setTAvatar] = useState(''); const [tOrder, setTOrder] = useState(0)
  const [tActive, setTActive] = useState(true); const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null)

  const fetchData = async () => {
    const [lRes, tRes, sRes] = await Promise.all([fetch('/api/leaders?all=true'), fetch('/api/teachers?all=true'), fetch('/api/settings')])
    const [lData, tData, sData] = await Promise.all([lRes.json(), tRes.json(), sRes.json()])
    if (lData.leaders) setLeaders(lData.leaders)
    if (tData.teachers) setTeachers(tData.teachers)
    if (sData.settings) {
      setAboutHistoryText(sData.settings.aboutHistoryText || '')
      setAboutHistoryImage(sData.settings.aboutHistoryImage || '')
      setAboutVisionText(sData.settings.aboutVisionText || '')
      setAboutMissionText(sData.settings.aboutMissionText || '')
      setAboutCoreValuesText(sData.settings.aboutCoreValuesText || '')
    }
  }

  useEffect(() => { fetchData() }, [])

  const resetForm = () => {
    setLName(''); setLRole(''); setLDesc(''); setLAvatar(''); setLOrder(0); setLActive(true); setEditingLeader(null)
    setTName(''); setTSubject(''); setTDegree(''); setTDesc(''); setTAvatar(''); setTOrder(0); setTActive(true); setEditingTeacher(null)
    setShowForm(false)
  }

  const handleSaveGeneral = async () => {
    const res = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        settings: {
          aboutHistoryText,
          aboutHistoryImage,
          aboutVisionText,
          aboutMissionText,
          aboutCoreValuesText
        }
      })
    })
    if (res.ok) { setToast({ id: Date.now().toString(), type: 'success', message: 'Lưu cấu hình chung thành công!' }); fetchData() }
    else { const d = await res.json(); setToast({ id: Date.now().toString(), type: 'error', message: d.error }) }
  }

  const handleSaveLeader = async () => {
    if (!lName || !lRole) { setToast({ id: Date.now().toString(), type: 'warning', message: 'Tên và chức vụ là bắt buộc' }); return }
    const body = { name: lName, role: lRole, description: lDesc, avatar: lAvatar, order: lOrder, isActive: lActive }
    const url = editingLeader ? `/api/leaders/${editingLeader.id}` : '/api/leaders'
    const res = await fetch(url, { method: editingLeader ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { setToast({ id: Date.now().toString(), type: 'success', message: 'Lưu thành công!' }); resetForm(); fetchData() }
    else { const d = await res.json(); setToast({ id: Date.now().toString(), type: 'error', message: d.error }) }
  }

  const handleSaveTeacher = async () => {
    if (!tName || !tSubject) { setToast({ id: Date.now().toString(), type: 'warning', message: 'Tên và bộ môn là bắt buộc' }); return }
    const body = { name: tName, subject: tSubject, degree: tDegree, description: tDesc, avatar: tAvatar, order: tOrder, isActive: tActive }
    const url = editingTeacher ? `/api/teachers/${editingTeacher.id}` : '/api/teachers'
    const res = await fetch(url, { method: editingTeacher ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    if (res.ok) { setToast({ id: Date.now().toString(), type: 'success', message: 'Lưu thành công!' }); resetForm(); fetchData() }
    else { const d = await res.json(); setToast({ id: Date.now().toString(), type: 'error', message: d.error }) }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const url = deleteTarget.type === 'leader' ? `/api/leaders/${deleteTarget.id}` : `/api/teachers/${deleteTarget.id}`
    await fetch(url, { method: 'DELETE' })
    setToast({ id: Date.now().toString(), type: 'success', message: 'Xóa thành công!' })
    setDeleteTarget(null); fetchData()
  }

  const openEditLeader = (l: Leader) => {
    setEditingLeader(l); setLName(l.name); setLRole(l.role); setLDesc(l.description || '')
    setLAvatar(l.avatar || ''); setLOrder(l.order); setLActive(l.isActive); setTab('leaders'); setShowForm(true)
  }

  const openEditTeacher = (t: Teacher) => {
    setEditingTeacher(t); setTName(t.name); setTSubject(t.subject); setTDegree(t.degree || '')
    setTDesc(t.description || ''); setTAvatar(t.avatar || ''); setTOrder(t.order); setTActive(t.isActive); setTab('teachers'); setShowForm(true)
  }

  const cardStyle: React.CSSProperties = { background: 'var(--color-white)', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }
  const inputStyle: React.CSSProperties = { width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }
  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)' }}>Quản Lý Giới Thiệu</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>Quản lý Ban Giám Hiệu và Đội ngũ Giáo viên hiển thị trên trang Giới thiệu.</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn btn-primary" style={{ gap: '6px' }}><Plus size={16} /> Thêm mới</button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'var(--color-gray-100)', padding: '4px', borderRadius: 'var(--radius-md)', width: 'fit-content' }}>
        <button onClick={() => setTab('general')} style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-sm)', fontWeight: 600, background: tab === 'general' ? 'var(--color-white)' : 'transparent', color: tab === 'general' ? 'var(--color-navy)' : 'var(--color-gray-500)', border: 'none', cursor: 'pointer', boxShadow: tab === 'general' ? 'var(--shadow-sm)' : 'none' }}>Nội dung chung</button>
        <button onClick={() => setTab('leaders')} style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-sm)', fontWeight: 600, background: tab === 'leaders' ? 'var(--color-white)' : 'transparent', color: tab === 'leaders' ? 'var(--color-navy)' : 'var(--color-gray-500)', border: 'none', cursor: 'pointer', boxShadow: tab === 'leaders' ? 'var(--shadow-sm)' : 'none' }}>Ban Giám Hiệu ({leaders.length})</button>
        <button onClick={() => setTab('teachers')} style={{ padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-sm)', fontSize: 'var(--font-size-sm)', fontWeight: 600, background: tab === 'teachers' ? 'var(--color-white)' : 'transparent', color: tab === 'teachers' ? 'var(--color-navy)' : 'var(--color-gray-500)', border: 'none', cursor: 'pointer', boxShadow: tab === 'teachers' ? 'var(--shadow-sm)' : 'none' }}>Đội ngũ Giáo viên ({teachers.length})</button>
      </div>

      {/* General Settings */}
      {tab === 'general' && (
        <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>Thông tin Lịch sử, Tầm nhìn & Sứ mệnh</h3>
          
          <div>
            <label style={labelStyle}>Lịch sử hình thành (Có thể xuống dòng)</label>
            <textarea value={aboutHistoryText} onChange={e => setAboutHistoryText(e.target.value)} rows={5} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelStyle}>Ảnh Lịch sử hình thành</label>
            <FileUpload type="image" subDir="images" value={aboutHistoryImage} onUploadSuccess={f => setAboutHistoryImage(f.filePath)} label="Upload ảnh" />
            {aboutHistoryImage && <img src={aboutHistoryImage} style={{ marginTop: '10px', height: '120px', borderRadius: '8px', objectFit: 'cover' }} alt="Preview" />}
          </div>

          <div>
            <label style={labelStyle}>Tầm nhìn</label>
            <textarea value={aboutVisionText} onChange={e => setAboutVisionText(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelStyle}>Sứ mệnh</label>
            <textarea value={aboutMissionText} onChange={e => setAboutMissionText(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div>
            <label style={labelStyle}>Giá trị cốt lõi</label>
            <textarea value={aboutCoreValuesText} onChange={e => setAboutCoreValuesText(e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>

          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <button onClick={handleSaveGeneral} className="btn btn-primary">Lưu thay đổi</button>
          </div>
        </div>
      )}

      {/* Form */}
      {showForm && tab !== 'general' && (
        <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)' }}>{tab === 'leaders' ? (editingLeader ? 'Sửa Thành Viên BGH' : 'Thêm Thành Viên BGH') : (editingTeacher ? 'Sửa Giáo Viên' : 'Thêm Giáo Viên')}</h3>
          {tab === 'leaders' ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div><label style={labelStyle}>Họ tên *</label><input type="text" value={lName} onChange={e => setLName(e.target.value)} style={inputStyle} placeholder="ThS. Nguyễn Văn A" /></div>
              <div><label style={labelStyle}>Chức vụ *</label><input type="text" value={lRole} onChange={e => setLRole(e.target.value)} style={inputStyle} placeholder="Hiệu trưởng" /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Mô tả</label><textarea value={lDesc} onChange={e => setLDesc(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Giới thiệu ngắn..." /></div>
              <div><label style={labelStyle}>Thứ tự</label><input type="number" value={lOrder} onChange={e => setLOrder(parseInt(e.target.value) || 0)} style={inputStyle} /></div>
              <div><label style={labelStyle}>Ảnh đại diện</label><FileUpload type="image" subDir="images" value={lAvatar} onUploadSuccess={f => setLAvatar(f.filePath)} label="Upload ảnh" /></div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div><label style={labelStyle}>Họ tên *</label><input type="text" value={tName} onChange={e => setTName(e.target.value)} style={inputStyle} placeholder="ThS. Nguyễn Văn A" /></div>
              <div><label style={labelStyle}>Bộ môn *</label><input type="text" value={tSubject} onChange={e => setTSubject(e.target.value)} style={inputStyle} placeholder="Toán học" /></div>
              <div><label style={labelStyle}>Trình độ</label><input type="text" value={tDegree} onChange={e => setTDegree(e.target.value)} style={inputStyle} placeholder="Thạc sĩ" /></div>
              <div><label style={labelStyle}>Thứ tự</label><input type="number" value={tOrder} onChange={e => setTOrder(parseInt(e.target.value) || 0)} style={inputStyle} /></div>
              <div style={{ gridColumn: '1 / -1' }}><label style={labelStyle}>Mô tả</label><textarea value={tDesc} onChange={e => setTDesc(e.target.value)} rows={2} style={{ ...inputStyle, resize: 'vertical' }} /></div>
              <div><label style={labelStyle}>Ảnh đại diện</label><FileUpload type="image" subDir="images" value={tAvatar} onUploadSuccess={f => setTAvatar(f.filePath)} label="Upload ảnh" /></div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end', marginTop: 'var(--space-4)' }}>
            <button onClick={resetForm} className="btn btn-ghost">Hủy</button>
            <button onClick={tab === 'leaders' ? handleSaveLeader : handleSaveTeacher} className="btn btn-primary">Lưu</button>
          </div>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        {tab === 'leaders' ? leaders.map(l => (
          <div key={l.id} style={{ ...cardStyle, opacity: l.isActive ? 1 : 0.5 }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-gray-100)', border: '2px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {l.avatar ? <img src={l.avatar} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserCircle size={28} style={{ color: 'var(--color-gray-400)' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{l.name}</h4>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gold-dark)', fontWeight: 600 }}>{l.role}</span>
              {l.description && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: '2px 0 0 0' }}>{l.description}</p>}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              <button onClick={() => openEditLeader(l)} className="btn btn-ghost btn-icon"><Edit2 size={16} /></button>
              <button onClick={() => setDeleteTarget({ id: l.id, type: 'leader' })} className="btn btn-ghost btn-icon" style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
            </div>
          </div>
        )) : tab === 'teachers' ? teachers.map(t => (
          <div key={t.id} style={{ ...cardStyle, opacity: t.isActive ? 1 : 0.5 }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-gray-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              {t.avatar ? <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <UserCircle size={28} style={{ color: 'var(--color-gray-400)' }} />}
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: 0 }}>{t.name}</h4>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-primary)', fontWeight: 600 }}>{t.subject} {t.degree ? `• ${t.degree}` : ''}</span>
              {t.description && <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: '2px 0 0 0' }}>{t.description}</p>}
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              <button onClick={() => openEditTeacher(t)} className="btn btn-ghost btn-icon"><Edit2 size={16} /></button>
              <button onClick={() => setDeleteTarget({ id: t.id, type: 'teacher' })} className="btn btn-ghost btn-icon" style={{ color: 'var(--color-danger)' }}><Trash2 size={16} /></button>
            </div>
          </div>
        )) : null}
      </div>

      <ConfirmModal isOpen={!!deleteTarget} title="Xác nhận xóa?" message="Thông tin sẽ bị xóa khỏi trang Giới thiệu." onConfirm={handleDelete} onCancel={() => setDeleteTarget(null)} />
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
