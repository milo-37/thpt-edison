'use client'

import { useState, useEffect } from 'react'
import { Save, Settings, Info, Phone, Mail, MapPin, Image as ImageIcon } from 'lucide-react'
import FileUpload from '@/components/admin/FileUpload'
import Toast, { ToastMessage } from '@/components/admin/Toast'
import PostEditor from '@/components/admin/PostEditor'


export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Settings state variables
  const [missionImageUrl, setMissionImageUrl] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/settings')
      const data = await res.json()
      if (data.settings) {
        setMissionImageUrl(data.settings.missionImageUrl || '')
        setSchoolName(data.settings.schoolName || '')
        setLogoUrl(data.settings.logoUrl || '')
        setPhone(data.settings.phone || '')
        setEmail(data.settings.email || '')
        setAddress(data.settings.address || '')
      }
    } catch (error) {
      console.error('Fetch settings error:', error)
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: 'Lỗi tải cấu hình hệ thống'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          settings: {
            missionImageUrl,
            schoolName,
            logoUrl,
            phone,
            email,
            address
          }
        })
      })

      if (res.ok) {
        setToast({
          id: Date.now().toString(),
          type: 'success',
          message: 'Cập nhật cấu hình hệ thống thành công!'
        })
      } else {
        const d = await res.json()
        setToast({
          id: Date.now().toString(),
          type: 'error',
          message: d.error || 'Lỗi lưu cấu hình'
        })
      }
    } catch (error) {
      console.error('Save settings error:', error)
      setToast({
        id: Date.now().toString(),
        type: 'error',
        message: 'Lỗi hệ thống khi lưu cấu hình'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <p style={{ color: 'var(--color-gray-400)' }}>Đang tải cấu hình hệ thống...</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)' }}>Cấu Hình Hệ Thống</h1>
          <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
            Quản lý thông tin chung, ảnh đại diện và thông tin liên hệ của trường.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--space-6)' }}>
        {/* Cột trái: Thông tin trường học & Liên hệ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Thông tin chung */}
          <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={18} /> Thông tin chung trường học
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>
                  Tên trường (Hiển thị trên Header / Footer)
                </label>
                <input
                  type="text"
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  placeholder="Ví dụ: EDISON SCHOOL MINH DUC"
                  style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>
                  Logo trường học
                </label>
                <FileUpload
                  type="image"
                  subDir="images"
                  value={logoUrl}
                  onUploadSuccess={(f) => setLogoUrl(f.filePath)}
                  label="Tải lên ảnh logo"
                />
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="Đường dẫn Logo"
                    style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ...Thông tin liên hệ */}
          <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={18} /> Thông tin liên hệ công khai
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>
                  Số điện thoại
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Hotline liên hệ"
                  style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email liên hệ"
                  style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }}
                />
              </div>

              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-1)' }}>
                  Địa chỉ chi tiết
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Số nhà, Tên đường, Quận/Huyện, Tỉnh/Thành phố"
                  style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Cấu hình ảnh giao diện & nút lưu */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, color: 'var(--color-navy)', marginBottom: 'var(--space-4)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <ImageIcon size={18} /> Ảnh Sứ Mệnh - Tầm Nhìn
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 600, color: 'var(--color-gray-700)', marginBottom: 'var(--space-2)' }}>
                  Tải lên ảnh mới (Phần giới thiệu trang chủ)
                </label>
                <FileUpload
                  type="image"
                  subDir="images"
                  value={missionImageUrl}
                  onUploadSuccess={(f) => setMissionImageUrl(f.filePath)}
                  label="Upload ảnh sứ mệnh"
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: '4px' }}>
                  Hoặc nhập URL ảnh trực tuyến:
                </label>
                <input
                  type="text"
                  value={missionImageUrl}
                  onChange={(e) => setMissionImageUrl(e.target.value)}
                  placeholder="https://..."
                  style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-300)', outline: 'none', fontSize: 'var(--font-size-sm)' }}
                />
              </div>

              {missionImageUrl && (
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', marginBottom: 'var(--space-1)' }}>
                    Xem trước ảnh hiện tại:
                  </label>
                  <div style={{ width: '100%', height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--color-gray-200)' }}>
                    <img src={missionImageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={saving}
              style={{ width: '100%', gap: '8px', padding: '14px 24px', borderRadius: '16px' }}
            >
              <Save size={18} /> {saving ? 'Đang lưu...' : 'Lưu cấu hình hệ thống'}
            </button>
          </div>
        </div>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
