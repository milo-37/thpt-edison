'use client'

import { useState, useEffect } from 'react'
import { Save, Info, Phone, Mail, MapPin, Image as ImageIcon, Settings, Layout } from 'lucide-react'
import FileUpload from '@/components/admin/FileUpload'
import Toast, { ToastMessage } from '@/components/admin/Toast'

type TabType = 'general' | 'contact' | 'media'

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('general')

  // Settings state variables
  const [missionImageUrl, setMissionImageUrl] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [logoUrl, setLogoUrl] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [defaultPostThumbnailUrl, setDefaultPostThumbnailUrl] = useState('')

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
        setDefaultPostThumbnailUrl(data.settings.defaultPostThumbnailUrl || '')
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
            address,
            defaultPostThumbnailUrl
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Premium CSS styling rules */}
      <style jsx global>{`
        .settings-tab-nav {
          display: flex;
          gap: 8px;
          border-bottom: 2px solid var(--color-gray-200);
          padding-bottom: 12px;
          margin-bottom: 8px;
        }
        .settings-tab-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-gray-500);
          background: transparent;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
        }
        .settings-tab-btn:hover {
          color: var(--color-primary);
          background: rgba(10, 75, 175, 0.05);
        }
        .settings-tab-btn.active {
          color: var(--color-primary);
          background: rgba(10, 75, 175, 0.08);
          box-shadow: inset 0 -2px 0 var(--color-primary);
          border-radius: 12px 12px 0 0;
        }
        .settings-form-card {
          background: var(--color-white);
          padding: var(--space-8);
          border-radius: 24px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 10px 30px -5px rgba(15, 23, 42, 0.04);
          animation: scaleIn 0.3s ease-in-out;
        }
        .settings-input-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .settings-input {
          width: 100%;
          padding: 12px 16px;
          border-radius: 12px;
          border: 1.5px solid var(--color-gray-200);
          outline: none;
          font-size: var(--font-size-sm);
          transition: all 0.2s ease-in-out;
          background: var(--color-gray-50);
          color: var(--color-gray-800);
        }
        .settings-input:focus {
          border-color: var(--color-primary);
          background: var(--color-white);
          box-shadow: 0 0 0 4px rgba(10, 75, 175, 0.1);
        }
        .settings-label {
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-navy);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        .settings-btn-save {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 14px 28px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: var(--color-white) !important;
          font-weight: 700;
          font-size: var(--font-size-sm);
          border: none;
          box-shadow: 0 4px 14px rgba(10, 75, 175, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
        }
        .settings-btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(10, 75, 175, 0.45);
        }
        .settings-btn-save:active {
          transform: translateY(0);
        }
        .settings-btn-save:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
          box-shadow: none !important;
        }
        .settings-preview-img {
          margin-top: 12px;
          border-radius: 16px;
          overflow: hidden;
          border: 1px dashed var(--color-gray-300);
          padding: 6px;
          background: var(--color-gray-50);
          max-width: 400px;
        }
        .settings-preview-img img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 12px;
        }
      `}</style>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, color: 'var(--color-navy)', margin: '0 0 4px 0' }}>Cấu Hình Hệ Thống</h1>
        <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
          Quản lý thông tin chung, cấu hình giao diện ảnh và cổng thông tin liên hệ của trường.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="settings-tab-nav">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`settings-tab-btn ${activeTab === 'general' ? 'active' : ''}`}
        >
          <Info size={16} />
          Thông tin chung
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`settings-tab-btn ${activeTab === 'contact' ? 'active' : ''}`}
        >
          <Phone size={16} />
          Thông tin liên hệ
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('media')}
          className={`settings-tab-btn ${activeTab === 'media' ? 'active' : ''}`}
        >
          <Layout size={16} />
          Hình ảnh & Giao diện
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="settings-form-card">
        {/* Tab 1: General Info */}
        {activeTab === 'general' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className="settings-input-group">
              <label className="settings-label">Tên trường học</label>
              <input
                type="text"
                className="settings-input"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                placeholder="Ví dụ: EDISON HIGH SCHOOL"
                required
              />
            </div>

            <div className="settings-input-group">
              <label className="settings-label">Logo trường học</label>
              <FileUpload
                type="image"
                subDir="images"
                value={logoUrl}
                onUploadSuccess={(f) => setLogoUrl(f.filePath)}
                label="Chọn hoặc kéo thả logo vào đây"
              />
              <div style={{ marginTop: '4px' }}>
                <span style={{ fontSize: '11px', color: 'var(--color-gray-400)', display: 'block', marginBottom: '4px' }}>Hoặc dán URL Logo trực tuyến:</span>
                <input
                  type="text"
                  className="settings-input"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/school-logo.jpg hoặc https://..."
                />
              </div>

              {logoUrl && (
                <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', fontWeight: 600 }}>Xem trước Logo:</span>
                  <div style={{ width: '64px', height: '64px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--color-gray-200)', background: 'var(--color-gray-50)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6px' }}>
                    <img src={logoUrl} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Contact Info */}
        {activeTab === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="settings-input-group">
                <label className="settings-label">Số điện thoại liên hệ</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center' }}>
                    <Phone size={16} />
                  </span>
                  <input
                    type="text"
                    className="settings-input"
                    style={{ paddingLeft: '40px' }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Số điện thoại của trường"
                  />
                </div>
              </div>

              <div className="settings-input-group">
                <label className="settings-label">Địa chỉ Email</label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center' }}>
                    <Mail size={16} />
                  </span>
                  <input
                    type="email"
                    className="settings-input"
                    style={{ paddingLeft: '40px' }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email công khai của trường"
                  />
                </div>
              </div>
            </div>

            <div className="settings-input-group">
              <label className="settings-label">Địa chỉ chi tiết</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '14px', top: '16px', color: 'var(--color-gray-400)', display: 'flex', alignItems: 'center' }}>
                  <MapPin size={16} />
                </span>
                <textarea
                  className="settings-input"
                  style={{ paddingLeft: '40px', minHeight: '100px', resize: 'vertical', fontFamily: 'inherit' }}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Nhập địa chỉ trụ sở trường học..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Media & Images */}
        {activeTab === 'media' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {/* Mission Image */}
            <div style={{ borderBottom: '1px solid var(--color-gray-100)', paddingBottom: 'var(--space-6)' }}>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
                <ImageIcon size={16} /> Ảnh Sứ Mệnh - Tầm Nhìn (Trang chủ)
              </h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <FileUpload
                    type="image"
                    subDir="images"
                    value={missionImageUrl}
                    onUploadSuccess={(f) => setMissionImageUrl(f.filePath)}
                    label="Tải ảnh sứ mệnh mới"
                  />
                  <input
                    type="text"
                    className="settings-input"
                    value={missionImageUrl}
                    onChange={(e) => setMissionImageUrl(e.target.value)}
                    placeholder="Nhập hoặc dán link ảnh..."
                  />
                </div>
                <div>
                  {missionImageUrl ? (
                    <div className="settings-preview-img" style={{ margin: 0 }}>
                      <img src={missionImageUrl} alt="Mission Preview" />
                    </div>
                  ) : (
                    <div style={{ height: '180px', border: '2px dashed var(--color-gray-200)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-400)', fontSize: 'var(--font-size-xs)' }}>
                      Chưa có hình ảnh
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Default Post Thumbnail */}
            <div>
              <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 16px 0' }}>
                <ImageIcon size={16} /> Ảnh đại diện bài viết mặc định
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <FileUpload
                    type="image"
                    subDir="thumbnails"
                    value={defaultPostThumbnailUrl}
                    onUploadSuccess={(f) => setDefaultPostThumbnailUrl(f.filePath)}
                    label="Tải ảnh đại diện mặc định mới"
                  />
                  <input
                    type="text"
                    className="settings-input"
                    value={defaultPostThumbnailUrl}
                    onChange={(e) => setDefaultPostThumbnailUrl(e.target.value)}
                    placeholder="Nhập hoặc dán link ảnh đại diện..."
                  />
                </div>
                <div>
                  {defaultPostThumbnailUrl ? (
                    <div className="settings-preview-img" style={{ margin: 0 }}>
                      <img src={defaultPostThumbnailUrl} alt="Default Thumbnail Preview" />
                    </div>
                  ) : (
                    <div style={{ height: '180px', border: '2px dashed var(--color-gray-200)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-400)', fontSize: 'var(--font-size-xs)' }}>
                      Chưa có hình ảnh
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Footer Action */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)', borderTop: '1px solid var(--color-gray-100)', paddingTop: 'var(--space-6)' }}>
          <button
            type="submit"
            className="settings-btn-save"
            disabled={saving}
          >
            <Save size={18} />
            {saving ? 'Đang lưu cấu hình...' : 'Lưu cấu hình hệ thống'}
          </button>
        </div>
      </form>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}
