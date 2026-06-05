import Link from 'next/link'
import { MapPin, Phone, Mail, GraduationCap, Globe } from 'lucide-react'
import NewsletterForm from '@/components/public/NewsletterForm'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="public-footer" style={{ background: 'var(--color-navy-dark)', color: 'var(--color-white)', padding: 'var(--space-16) 0 var(--space-8) 0', borderTop: '4px solid var(--color-gold)' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-8)' }}>

        {/* Cột 1: Thông tin trường */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--color-gold)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-navy-dark)' }}>
              <GraduationCap size={24} />
            </div>
            <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 800, color: 'var(--color-gold-light)' }}>THPT EDISON</h2>
          </div>
          <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>
            Trường THPT Edison cam kết xây dựng một môi trường giáo dục khai phóng, hiện đại và nhân văn, giúp học sinh phát triển toàn diện bản thân để sẵn sàng hội nhập toàn cầu.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-gray-400)' }} aria-label="Facebook">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: 'var(--color-gray-400)' }} aria-label="Youtube">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-youtube">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                <polygon points="10 15 15 12 10 9" fill="currentColor" />
              </svg>
            </a>
            <a href="/" style={{ color: 'var(--color-gray-400)' }} aria-label="Website">
              <Globe size={20} />
            </a>
          </div>
        </div>

        {/* Cột 2: Liên kết nhanh */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-white)', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-gold)', paddingBottom: 'var(--space-2)', display: 'inline-block' }}>
            Liên Kết Nhanh
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <li>
              <Link href="/gioi-thieu" style={{ color: 'var(--color-gray-400)', transition: 'color var(--transition-fast)' }}>
                Giới thiệu nhà trường
              </Link>
            </li>
            <li>
              <Link href="/tin-tuc" style={{ color: 'var(--color-gray-400)' }}>
                Tin tức & Sự kiện
              </Link>
            </li>
            <li>
              <Link href="/tuyen-sinh" style={{ color: 'var(--color-gray-400)' }}>
                Thông tin tuyển sinh
              </Link>
            </li>
            <li>
              <Link href="/tai-lieu" style={{ color: 'var(--color-gray-400)' }}>
                Kho tài nguyên học tập
              </Link>
            </li>
            <li>
              <Link href="/lien-he" style={{ color: 'var(--color-gray-400)' }}>
                Liên hệ & Phản hồi
              </Link>
            </li>
          </ul>
        </div>

        {/* Cột 3: Liên hệ chi tiết */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-white)', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-gold)', paddingBottom: 'var(--space-2)', display: 'inline-block' }}>
            Thông Tin Liên Hệ
          </h3>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', color: 'var(--color-gray-400)', fontSize: 'var(--font-size-sm)' }}>
            <li style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
              <MapPin size={18} style={{ flexShrink: 0, color: 'var(--color-gold)', marginTop: '3px' }} />
              <span>Số 937, đường Dương Tự Minh, phường Phan Đình Phùng, Tỉnh Thái Nguyên</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Phone size={18} style={{ flexShrink: 0, color: 'var(--color-gold)' }} />
              <span>024 7300 8896</span>
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Mail size={18} style={{ flexShrink: 0, color: 'var(--color-gold)' }} />
              <span>info@edisonschools.edu.vn</span>
            </li>
          </ul>
        </div>

        {/* Cột 4: Đăng ký nhận tin */}
        <div>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-white)', marginBottom: 'var(--space-4)', borderBottom: '2px solid var(--color-gold)', paddingBottom: 'var(--space-2)', display: 'inline-block' }}>
            Đăng Ký Nhận Tin
          </h3>
          <p style={{ color: 'var(--color-gray-400)', fontSize: 'var(--font-size-xs)', marginBottom: 'var(--space-4)', lineHeight: 1.5 }}>
            Đăng ký email để nhận các tin tức mới nhất, sự kiện giáo dục và thông báo tuyển sinh từ trường.
          </p>
          <NewsletterForm />
        </div>

      </div>

      {/* Dòng Copyright */}
      <div className="container" style={{ marginTop: 'var(--space-12)', paddingTop: 'var(--space-6)', borderTop: '1px solid rgba(255, 255, 255, 0.1)', textAlign: 'center', color: 'var(--color-gray-500)', fontSize: 'var(--font-size-xs)' }}>
        <p>&copy; {currentYear} Trường THPT Edison. Bảo lưu mọi quyền.</p>
        <p style={{ marginTop: 'var(--space-1)' }}>Phát triển trên nền tảng Next.js 16 & MySQL</p>
      </div>
    </footer>
  )
}
