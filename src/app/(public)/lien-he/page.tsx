import ContactForm from '@/components/public/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import PageBanner from '@/components/public/PageBanner'

export const metadata = {
  title: 'Liên Hệ - Trường THPT Edison',
  description: 'Liên hệ với Trường THPT Edison qua biểu mẫu trực tuyến hoặc thông tin số điện thoại, địa chỉ, email và bản đồ hướng dẫn đường đi.',
}

export default function ContactPage() {
  const contacts = [
    {
      title: 'Địa chỉ nhà trường',
      value: 'Số 937 Dương Tự Minh, Phan Đình Phùng, Thái Nguyên',
      icon: MapPin,
      accentColor: '#6366f1',
      bgColor: 'rgba(99, 102, 241, 0.08)',
    },
    {
      title: 'Điện thoại liên hệ',
      value: '024 7300 8896 (Tổng đài tuyển sinh & hành chính)',
      icon: Phone,
      accentColor: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
    },
    {
      title: 'Hộp thư điện tử',
      value: 'info@edisonschools.edu.vn / tuyensinh@edison.edu.vn',
      icon: Mail,
      accentColor: '#8b5cf6',
      bgColor: 'rgba(168, 85, 247, 0.08)',
    },
    {
      title: 'Thời gian làm việc',
      value: 'Thứ Hai - Thứ Sáu: 07:30 - 17:00 | Thứ Bảy: 08:00 - 12:00',
      icon: Clock,
      accentColor: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.08)',
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <style>{`
        .contact-card-item {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          padding: var(--space-5);
          border-radius: 20px;
          border: 1px solid rgba(99, 102, 241, 0.1);
          display: flex;
          align-items: center;
          gap: var(--space-4);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .contact-card-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 0;
          background: linear-gradient(to bottom, var(--accent-color, #6366f1), transparent);
          border-radius: 3px;
          transition: height 0.35s ease;
        }
        .contact-card-item:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 16px 40px rgba(99, 102, 241, 0.06);
        }
        .contact-card-item:hover::before {
          height: 50%;
        }
        .contact-card-item:hover .contact-icon {
          transform: scale(1.1) rotate(3deg);
        }
        [data-theme="dark"] .contact-card-item {
          background: rgba(15, 23, 42, 0.7);
          border-color: rgba(99, 102, 241, 0.08);
        }
        @media (max-width: 768px) {
          .contact-grid-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Banner — Unified PageBanner */}
      <PageBanner
        label="Liên kết nhanh"
        title="Liên hệ với chúng tôi"
        description="Giải đáp mọi câu hỏi, ý kiến đóng góp của phụ huynh và học sinh nhanh chóng nhất"
      />

      {/* Gradient Divider */}
      <div className="gradient-divider" />

      {/* Decorative Blur Blobs */}
      <div style={{ position: 'absolute', top: '40%', left: '3%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.04) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '25%', right: '3%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.03) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      {/* Thông tin và Form liên hệ */}
      <section className="section" style={{ position: 'relative', zIndex: 1, background: 'linear-gradient(180deg, var(--color-white) 0%, var(--color-gray-50) 100%)' }}>
        <div className="container contact-grid-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>

          {/* Cột trái: Các thẻ liên hệ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <span className="section-label">Thông tin liên lạc</span>
              <h2 className="section-title section-title--underlined" style={{ marginTop: 'var(--space-2)' }}>
                Thông tin chi tiết
              </h2>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', margin: 'var(--space-4) 0 0 0' }}>
                Bạn có thể liên hệ trực tiếp với chúng tôi qua các kênh bên dưới hoặc điền vào biểu mẫu bên phải để chúng tôi liên hệ lại.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
              {contacts.map((c, idx) => {
                const Icon = c.icon
                return (
                  <div
                    key={idx}
                    className="contact-card-item"
                    style={{ '--accent-color': c.accentColor } as React.CSSProperties}
                  >
                    <div
                      className="contact-icon"
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: c.bgColor,
                        color: c.accentColor,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                      }}
                    >
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)', margin: '0 0 2px 0' }}>
                        {c.title}
                      </h4>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-gray-500)', margin: 0 }}>
                        {c.value}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Cột phải: Form gửi liên hệ */}
          <ContactForm />

        </div>
      </section>

      {/* Google Maps nhúng */}
      <section style={{ width: '100%', height: '450px', background: 'var(--color-gray-100)', position: 'relative', borderTop: '1px solid rgba(99, 102, 241, 0.1)' }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3711.0253457187903!2d105.82064454378775!3d21.6017712856515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135274e9b4a8d45%3A0x6b116cadc452b4c0!2zVHLGsOG7nW5nIFRIUFQgRWRpc29uIC0gVGjDoWkgTmd1ecOqbg!5e0!3m2!1svi!2s!4v1717915200000!5m2!1svi!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Bản đồ Trường THPT Edison - Thái Nguyên"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </section>

    </div>
  )
}
