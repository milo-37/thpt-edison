import prisma from '@/lib/prisma'
import { Award, FileText, Calendar } from 'lucide-react'
import AdmissionForm from '@/components/public/AdmissionForm'

export const revalidate = 60

const DEFAULT_SETTINGS = {
  admissionQuotaHtml: `<ul style="display: flex; flex-direction: column; gap: var(--space-3); color: var(--color-gray-600); font-size: var(--font-size-sm); list-style: none; padding: 0; margin: 0;">
  <li style="display: flex; gap: var(--space-2); align-items: flex-start;">
    <span style="color: var(--color-success); font-weight: bold; margin-right: 4px;">✓</span>
    <span><strong>Chỉ tiêu tuyển sinh:</strong> 450 học sinh khối 10 (chia làm 10 lớp học cơ bản và 2 lớp chất lượng cao định hướng IELTS).</span>
  </li>
  <li style="display: flex; gap: var(--space-2); align-items: flex-start;">
    <span style="color: var(--color-success); font-weight: bold; margin-right: 4px;">✓</span>
    <span><strong>Đối tượng dự tuyển:</strong> Học sinh Việt Nam đã tốt nghiệp Trung học Cơ sở (THCS) theo quy định của Bộ Giáo dục & Đào tạo.</span>
  </li>
  <li style="display: flex; gap: var(--space-2); align-items: flex-start;">
    <span style="color: var(--color-success); font-weight: bold; margin-right: 4px;">✓</span>
    <span><strong>Địa bàn tuyển sinh:</strong> Không giới hạn hộ khẩu thường trú (tuyển sinh học sinh toàn quốc).</span>
  </li>
</ul>`,
  admissionMethodsHtml: `<div style="display: flex; flex-direction: column; gap: var(--space-4);">
  <div style="padding-left: var(--space-2); border-left: 4px solid var(--color-primary);">
    <h3 style="font-size: var(--font-size-base); font-weight: 700; margin: 0 0 var(--space-1) 0; color: var(--color-gray-800);">Phương thức 1: Thi tuyển</h3>
    <p style="font-size: var(--font-size-sm); color: var(--color-gray-500); margin: 0;">
      Học sinh tham gia kỳ thi tuyển sinh lớp 10 THPT công lập chung do Sở GD&ĐT tổ chức (gồm 3 môn: Toán, Ngữ văn, Tiếng Anh). Nhà trường xét điểm trúng tuyển từ cao xuống thấp dựa trên điểm thi.
    </p>
  </div>
  <div style="padding-left: var(--space-2); border-left: 4px solid var(--color-gold);">
    <h3 style="font-size: var(--font-size-base); font-weight: 700; margin: 0 0 var(--space-1) 0; color: var(--color-gray-800);">Phương thức 2: Xét tuyển thẳng & Tuyển thẳng học bổng</h3>
    <p style="font-size: var(--font-size-sm); color: var(--color-gray-500); margin: 0;">
      Tuyển thẳng và cấp học bổng cho học sinh đạt giải Nhất, Nhì, Ba trong kỳ thi học sinh giỏi các môn văn hóa cấp Tỉnh/Thành phố trực thuộc Trung ương, hoặc học sinh có chứng chỉ tiếng Anh quốc tế IELTS đạt từ 6.5 trở lên.
    </p>
  </div>
</div>`,
  admissionTimelineHtml: `<div style="display: flex; flex-direction: column; gap: var(--space-4);">
  <div style="display: flex; gap: var(--space-4); align-items: center;">
    <div style="font-size: var(--font-size-xs); font-weight: 700; background: rgba(59,130,246,0.1); color: var(--color-primary); padding: var(--space-2); border-radius: 4px; width: 120px; text-align: center; flex-shrink: 0;">
      01/05 - 15/06
    </div>
    <div style="font-size: var(--font-size-sm); color: var(--color-gray-600);">
      Phát hành và tiếp nhận hồ sơ đăng ký dự tuyển trực tuyến và trực tiếp.
    </div>
  </div>
  <div style="display: flex; gap: var(--space-4); align-items: center;">
    <div style="font-size: var(--font-size-xs); font-weight: 700; background: rgba(59,130,246,0.1); color: var(--color-primary); padding: var(--space-2); border-radius: 4px; width: 120px; text-align: center; flex-shrink: 0;">
      18/06 - 20/06
    </div>
    <div style="font-size: var(--font-size-sm); color: var(--color-gray-600);">
      Thông báo danh sách học sinh đủ điều kiện trúng tuyển thẳng và xét tuyển đợt 1.
    </div>
  </div>
  <div style="display: flex; gap: var(--space-4); align-items: center;">
    <div style="font-size: var(--font-size-xs); font-weight: 700; background: rgba(59,130,246,0.1); color: var(--color-primary); padding: var(--space-2); border-radius: 4px; width: 120px; text-align: center; flex-shrink: 0;">
      25/06 - 05/07
    </div>
    <div style="font-size: var(--font-size-sm); color: var(--color-gray-600);">
      Nhận hồ sơ nhập học chính thức cho học sinh trúng tuyển vào lớp 10.
    </div>
  </div>
</div>`,
}

export default async function AdmissionPage() {
  const settingsList = await (prisma as any).setting.findMany({
    where: {
      key: {
        in: ['admissionQuotaHtml', 'admissionMethodsHtml', 'admissionTimelineHtml']
      }
    }
  })

  const settings: Record<string, string> = { ...DEFAULT_SETTINGS }
  settingsList.forEach((s: any) => {
    settings[s.key] = s.value
  })

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
              <div 
                dangerouslySetInnerHTML={{ __html: settings.admissionQuotaHtml }}
                style={{ fontSize: 'var(--font-size-sm)' }}
              />
            </div>

            {/* Khối 2: Phương thức xét tuyển */}
            <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <FileText style={{ color: 'var(--color-gold)' }} />
                Phương thức tuyển sinh
              </h2>
              <div 
                dangerouslySetInnerHTML={{ __html: settings.admissionMethodsHtml }}
              />
            </div>

            {/* Khối 3: Lịch trình nộp hồ sơ */}
            <div style={{ background: 'var(--color-white)', padding: 'var(--space-6)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-gray-200)', boxShadow: 'var(--shadow-sm)' }}>
              <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-navy)', display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
                <Calendar style={{ color: 'var(--color-gold)' }} />
                Mốc lịch trình quan trọng
              </h2>
              <div 
                dangerouslySetInnerHTML={{ __html: settings.admissionTimelineHtml }}
              />
            </div>

          </div>

          {/* Cột phải: Form đăng ký tư vấn tuyển sinh */}
          <div>
            <AdmissionForm />
          </div>

        </div>
      </section>

    </div>
  )
}
