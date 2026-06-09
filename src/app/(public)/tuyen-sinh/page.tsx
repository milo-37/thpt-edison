'use client'

import { useState } from 'react'
import { CheckCircle2, Clock, Calendar, ShieldAlert, Award, FileText, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { isValidEmail, isValidPhone } from '@/lib/validation'

export default function AdmissionPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    studentClass: 'lop10',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus({ type: null, message: '' })

    try {
      if (!formData.name || !formData.email || !formData.phone) {
        throw new Error('Vui lòng nhập đầy đủ các trường thông tin bắt buộc')
      }

      if (!isValidEmail(formData.email)) {
        throw new Error('Địa chỉ email không đúng định dạng')
      }

      if (!isValidPhone(formData.phone)) {
        throw new Error('Số điện thoại không đúng định dạng Việt Nam')
      }

      // Gửi lên API Contacts chung
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: `Đăng ký Tư vấn Tuyển sinh Lớp 10 (Học sinh dự tuyển: ${formData.studentClass.toUpperCase()})`,
          message: formData.message || 'Phụ huynh đăng ký tư vấn tuyển sinh lớp 10 năm học mới.',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Gửi đăng ký tư vấn thất bại')
      }

      setStatus({
        type: 'success',
        message: 'Đăng ký tư vấn tuyển sinh thành công! Ban tư vấn sẽ liên hệ lại với phụ huynh trong 24 giờ tới.',
      })
      setFormData({
        name: '',
        email: '',
        phone: '',
        studentClass: 'lop10',
        message: '',
      })
    } catch (err: any) {
      setStatus({
        type: 'error',
        message: err.message || 'Có lỗi xảy ra. Vui lòng kiểm tra lại.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      
      {/* Banner đầu trang */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy-dark), var(--color-navy))', color: 'var(--color-white)', padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, margin: 0, color: 'var(--color-gold)' }}>
            Thông tin tuyển sinh
          </h1>
          <p style={{ opacity: 0.8, fontSize: 'var(--font-size-base)', marginTop: 'var(--space-2)' }}>
            Thông báo tuyển sinh lớp 10 Trường THPT Edison năm học 2026 - 2027
          </p>
        </div>
      </section>

      {/* Nội dung quy trình & form đăng ký */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: 'var(--space-12)' }}>
          
          {/* Cột trái: Thông tin chỉ tiêu, quy chế */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
            
            {/* Khối 1: Tổng quan chỉ tiêu */}
            <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <Award style={{ color: 'var(--color-gold)' }} />
                Chỉ tiêu & đối tượng tuyển sinh
              </h2>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', color: 'var(--color-gray-600)', fontSize: 'var(--font-size-sm)' }}>
                <li style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Chỉ tiêu tuyển sinh:</strong> 450 học sinh khối 10 (chia làm 10 lớp học cơ bản và 2 lớp chất lượng cao định hướng IELTS).</span>
                </li>
                <li style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Đối tượng dự tuyển:</strong> Học sinh Việt Nam đã tốt nghiệp Trung học Cơ sở (THCS) theo quy định của Bộ Giáo dục & Đào tạo.</span>
                </li>
                <li style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'flex-start' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--color-success)', flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Địa bàn tuyển sinh:</strong> Không giới hạn hộ khẩu thường trú (tuyển sinh học sinh toàn quốc).</span>
                </li>
              </ul>
            </div>

            {/* Khối 2: Phương thức xét tuyển */}
            <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <FileText style={{ color: 'var(--color-gold)' }} />
                Phương thức tuyển sinh
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ paddingLeft: 'var(--space-2)', borderLeft: '4px solid var(--color-primary)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, margin: '0 0 var(--space-1) 0', color: 'var(--color-gray-800)' }}>Phương thức 1: Thi tuyển</h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
                    Học sinh tham gia kỳ thi tuyển sinh lớp 10 THPT công lập chung do Sở GD&ĐT tổ chức (gồm 3 môn: Toán, Ngữ văn, Tiếng Anh). Nhà trường xét điểm trúng tuyển từ cao xuống thấp dựa trên điểm thi.
                  </p>
                </div>
                <div style={{ paddingLeft: 'var(--space-2)', borderLeft: '4px solid var(--color-gold)' }}>
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 700, margin: '0 0 var(--space-1) 0', color: 'var(--color-gray-800)' }}>Phương thức 2: Xét tuyển thẳng & Tuyển thẳng học bổng</h3>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-500)', margin: 0 }}>
                    Tuyển thẳng và cấp học bổng cho học sinh đạt giải Nhất, Nhì, Ba trong kỳ thi học sinh giỏi các môn văn hóa cấp Tỉnh/Thành phố trực thuộc Trung ương, hoặc học sinh có chứng chỉ tiếng Anh quốc tế IELTS đạt từ 6.5 trở lên.
                  </p>
                </div>
              </div>
            </div>

            {/* Khối 3: Lịch trình nộp hồ sơ */}
            <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <Calendar style={{ color: 'var(--color-gold)' }} />
                Mốc lịch trình quan trọng
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, background: 'rgba(59,130,246,0.1)', color: 'var(--color-primary)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', width: '120px', textAlign: 'center' }}>
                    01/05 - 15/06
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>
                    Phát hành và tiếp nhận hồ sơ đăng ký dự tuyển trực tuyến và trực tiếp.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, background: 'rgba(59,130,246,0.1)', color: 'var(--color-primary)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', width: '120px', textAlign: 'center' }}>
                    18/06 - 20/06
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>
                    Thông báo danh sách học sinh đủ điều kiện trúng tuyển thẳng và xét tuyển đợt 1.
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                  <div style={{ fontSize: 'var(--font-size-xs)', fontWeight: 700, background: 'rgba(59,130,246,0.1)', color: 'var(--color-primary)', padding: 'var(--space-2)', borderRadius: 'var(--radius-sm)', width: '120px', textAlign: 'center' }}>
                    25/06 - 05/07
                  </div>
                  <div style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-gray-600)' }}>
                    Nhận hồ sơ nhập học chính thức cho học sinh trúng tuyển vào lớp 10.
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Cột phải: Form đăng ký tư vấn tuyển sinh */}
          <div>
            <form onSubmit={handleSubmit} style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', position: 'sticky', top: '90px' }}>
              <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, color: 'var(--color-navy)', borderBottom: '2px solid var(--color-gold)', paddingBottom: 'var(--space-2)', margin: 0 }}>
                Đăng ký tư vấn học
              </h3>
              <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-400)', margin: 0 }}>
                Vui lòng điền thông tin dưới đây. Ban tư vấn tuyển sinh THPT Edison sẽ gọi lại tư vấn chi tiết cho phụ huynh.
              </p>

              {status.type && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-xs)', background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? 'var(--color-success-dark)' : 'var(--color-danger-dark)', border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}` }}>
                  {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                  <span>{status.message}</span>
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Họ và tên Phụ huynh *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', background: 'var(--color-white)', color: 'var(--color-gray-900)' }} placeholder="Nguyễn Văn A" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Số điện thoại liên hệ *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', background: 'var(--color-white)', color: 'var(--color-gray-900)' }} placeholder="0912345678" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Địa chỉ Email *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', background: 'var(--color-white)', color: 'var(--color-gray-900)' }} placeholder="example@gmail.com" />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Khối lớp dự tuyển *</label>
                <select name="studentClass" value={formData.studentClass} onChange={handleChange} style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', background: 'var(--color-white)', color: 'var(--color-gray-900)' }}>
                  <option value="lop10" style={{ background: 'var(--color-white)', color: 'var(--color-gray-900)' }}>Dự tuyển vào lớp 10</option>
                  <option value="lop11" style={{ background: 'var(--color-white)', color: 'var(--color-gray-900)' }}>Dự tuyển chuyển trường lớp 11</option>
                  <option value="lop12" style={{ background: 'var(--color-white)', color: 'var(--color-gray-900)' }}>Dự tuyển chuyển trường lớp 12</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-gray-600)', marginBottom: 'var(--space-1)' }}>Câu hỏi của phụ huynh (nếu có)</label>
                <textarea name="message" value={formData.message} onChange={handleChange} rows={3} style={{ width: '100%', padding: 'var(--space-3)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-gray-200)', outline: 'none', resize: 'vertical', background: 'var(--color-white)', color: 'var(--color-gray-900)' }} placeholder="Nhập câu hỏi của bạn tại đây..." />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                <Send size={16} />
                {loading ? 'Đang gửi đăng ký...' : 'Gửi đăng ký tư vấn'}
              </button>
            </form>
          </div>

        </div>
      </section>

    </div>
  )
}
