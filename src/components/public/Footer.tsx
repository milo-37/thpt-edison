import Link from 'next/link'
import { MapPin, Phone, Mail, GraduationCap, Globe, Shield } from 'lucide-react'
import NewsletterForm from '@/components/public/NewsletterForm'

interface FooterProps {
  settings?: {
    schoolName?: string
    logoUrl?: string
    phone?: string
    email?: string
    address?: string
  }
}

function splitSchoolName(name: string): { title: string; subtitle: string } {
  const delimiters = ['-', '|', '/', ',']
  for (const delimiter of delimiters) {
    if (name.includes(delimiter)) {
      const parts = name.split(delimiter)
      return {
        title: parts[0].trim(),
        subtitle: parts.slice(1).join(delimiter).trim()
      }
    }
  }
  
  const lowercaseName = name.toLowerCase()
  const suffixIndex = lowercaseName.indexOf('minh đức') !== -1 ? lowercaseName.indexOf('minh đức') : lowercaseName.indexOf('minh duc')
  if (suffixIndex > 0) {
    return {
      title: name.substring(0, suffixIndex).trim(),
      subtitle: name.substring(suffixIndex).trim()
    }
  }

  const schoolIndex = lowercaseName.lastIndexOf('school')
  if (schoolIndex > 0 && schoolIndex + 6 < name.length) {
    return {
      title: name.substring(0, schoolIndex + 6).trim(),
      subtitle: name.substring(schoolIndex + 6).trim()
    }
  }

  return {
    title: name,
    subtitle: ''
  }
}

export default function Footer({ settings }: FooterProps) {
  const schoolName = settings?.schoolName || 'EDISON SCHOOL MINH DUC'
  const phone = settings?.phone || '024 1234 5678'
  const email = settings?.email || 'contact@edison.edu.vn'
  const address = settings?.address || 'Minh Đức, Mỹ Hào, Hưng Yên'
  
  const { title, subtitle } = splitSchoolName(schoolName)

  return (
    <footer className="public-footer" style={{ background: '#0F172A', color: 'var(--color-white)', padding: 'var(--space-16) 0 var(--space-8) 0', borderTop: '4px solid var(--color-gold)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-10)' }}>

        {/* Cột 1: Thông tin trường */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--color-gold)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A' }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 800, color: 'var(--color-white)', margin: 0, lineHeight: 1.1, fontFamily: 'var(--font-title)' }}>{title}</h2>
              {subtitle && <span style={{ fontSize: '11px', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>{subtitle}</span>}
            </div>
          </div>
          <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
            {schoolName} kiến tạo tương lai bằng giáo dục hiện đại, khai phóng trí tuệ và chuẩn bị cho học sinh vững bước trở thành những công dân toàn cầu ưu tú.
          </p>
          <div className="footer-social" style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" aria-label="Youtube">
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <polygon points="10 15 15 12 10 9" fill="currentColor" />
              </svg>
            </a>
            <a href="/" aria-label="Website">
              <Globe size={18} />
            </a>
          </div>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-white)', marginBottom: 'var(--space-6)', position: 'relative', paddingBottom: 'var(--space-2)', fontFamily: 'var(--font-title)' }}>
            Liên kết nhanh
            <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '3px', background: 'var(--color-gold)', borderRadius: 'var(--radius-full)' }} />
          </h3>
          <ul className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <li>
              <Link href="/">Trang chủ</Link>
            </li>
            <li>
              <Link href="/gioi-thieu">Giới thiệu nhà trường</Link>
            </li>
            <li>
              <Link href="/tin-tuc">Tin tức tuyển sinh</Link>
            </li>
            <li>
              <Link href="/hoat-dong">Hoạt động ngoại khóa</Link>
            </li>
            <li>
              <Link href="/thanh-tich">Bảng vàng thành tích</Link>
            </li>
            <li>
              <Link href="/hoi-dap">Giải đáp thắc mắc (FAQ)</Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Tuyển sinh */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-white)', marginBottom: 'var(--space-6)', position: 'relative', paddingBottom: 'var(--space-2)', fontFamily: 'var(--font-title)' }}>
            Tuyển sinh & học vụ
            <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '3px', background: 'var(--color-gold)', borderRadius: 'var(--radius-full)' }} />
          </h3>
          <ul className="footer-links" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <li>
              <Link href="/tuyen-sinh">Chương trình đào tạo</Link>
            </li>
            <li>
              <Link href="/tuyen-sinh#hoc-phi">Chính sách học phí</Link>
            </li>
            <li>
              <Link href="/tuyen-sinh#quy-trinh">Quy trình nhập học</Link>
            </li>
            <li>
              <Link href="/tuyen-sinh#ho-so">Hồ sơ tuyển sinh lớp 10</Link>
            </li>
            <li>
              <Link href="/tai-lieu">Tài liệu học tập</Link>
            </li>
            <li>
              <Link href="/admin/login" style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-xs)', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: 'var(--space-1)' }}>
                <Shield size={12} /> Cổng thông tin CMS
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 4: Liên hệ & Đăng ký nhận tin */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 800, color: 'var(--color-white)', position: 'relative', paddingBottom: 'var(--space-2)', fontFamily: 'var(--font-title)', margin: 0 }}>
            Liên hệ với chúng tôi
            <span style={{ position: 'absolute', bottom: 0, left: 0, width: '40px', height: '3px', background: 'var(--color-gold)', borderRadius: 'var(--radius-full)' }} />
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)', padding: 0 }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <MapPin size={16} style={{ flexShrink: 0, color: 'var(--color-gold)', marginTop: '4px' }} />
              <span style={{ lineHeight: 1.4 }}>{address}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Phone size={16} style={{ flexShrink: 0, color: 'var(--color-gold)' }} />
              <span>{phone}</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Mail size={16} style={{ flexShrink: 0, color: 'var(--color-gold)' }} />
              <span>{email}</span>
            </li>
          </ul>
          
          <div style={{ marginTop: 'var(--space-2)' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-gray-300)', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Đăng ký nhận thông báo mới:
            </span>
            <NewsletterForm />
          </div>
        </div>

      </div>

      {/* Dòng Copyright */}
      <div className="container" style={{ marginTop: 'var(--space-12)', paddingTop: 'var(--space-6)', borderTop: '1px solid rgba(255, 255, 255, 0.08)', textAlign: 'center', color: 'var(--color-gray-500)', fontSize: 'var(--font-size-xs)' }}>
        <p style={{ margin: 0 }}>&copy; 2026 {schoolName}. All rights reserved.</p>
        <p style={{ marginTop: 'var(--space-1)', opacity: 0.7 }}>Powered by Next.js 16 & Premium Design Tokens</p>
      </div>
    </footer>
  )
}
