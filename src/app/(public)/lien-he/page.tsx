import ContactForm from '@/components/public/ContactForm'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

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
    },
    {
      title: 'Điện thoại liên hệ',
      value: '024 7300 8896 (Tổng đài tuyển sinh & hành chính)',
      icon: Phone,
    },
    {
      title: 'Hộp thư điện tử',
      value: 'info@edisonschools.edu.vn / tuyensinh@edison.edu.vn',
      icon: Mail,
    },
    {
      title: 'Thời gian làm việc',
      value: 'Thứ Hai - Thứ Sáu: 07:30 - 17:00 | Thứ Bảy: 08:00 - 12:00',
      icon: Clock,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #ffffff 0%, #f4f6ff 100%)', position: 'relative' }}>
      <style>{`
        .contact-card-item {
          transition: all 0.3s ease;
        }
        .contact-card-item:hover {
          transform: translateY(-2px);
          border-color: rgba(99, 102, 241, 0.3) !important;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.06);
          background: rgba(255, 255, 255, 0.95) !important;
        }
      `}</style>

      {/* Decorative Blur Blobs */}
      <div style={{ position: 'absolute', top: '15%', left: '5%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)', filter: 'blur(50px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '25%', right: '5%', width: '250px', height: '250px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />

      {/* Banner đầu trang */}
      <section style={{ background: 'linear-gradient(135deg, #f5f3ff 0%, #e0e7ff 100%)', padding: 'var(--space-12) 0', textAlign: 'center', position: 'relative', overflow: 'hidden', borderBottom: '1px solid rgba(99, 102, 241, 0.1)' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '10%', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)', filter: 'blur(45px)', pointerEvents: 'none' }} />
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, margin: 0, background: 'linear-gradient(135deg, #4f46e5, #9333ea)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Liên hệ với chúng tôi
          </h1>
          <p style={{ color: 'var(--color-gray-600)', fontSize: 'var(--font-size-base)', marginTop: 'var(--space-2)' }}>
            Giải đáp mọi câu hỏi, ý kiến đóng góp của phụ huynh và học sinh nhanh chóng nhất
          </p>
        </div>
      </section>

      {/* Thông tin và Form liên hệ */}
      <section className="section" style={{ position: 'relative', zIndex: 1, padding: 'var(--space-12) 0' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>

          {/* Cột trái: Các thẻ liên hệ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <span className="section-label" style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: 'var(--font-size-xs)', fontWeight: 700, display: 'inline-block', marginBottom: 'var(--space-3)' }}>
                Liên kết nhanh
              </span>
              <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, color: 'var(--color-navy)', marginBottom: 'var(--space-2)' }}>
                Thông tin chi tiết
              </h2>
              <p style={{ color: 'var(--color-gray-500)', fontSize: 'var(--font-size-sm)', margin: 0 }}>
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
                    style={{
                      background: 'rgba(255, 255, 255, 0.75)',
                      backdropFilter: 'blur(10px)',
                      padding: 'var(--space-5)',
                      borderRadius: '20px',
                      border: '1px solid rgba(99, 102, 241, 0.12)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(99,102,241,0.08)', color: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
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
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3711.0253457187903!2d105.82064454378775!3d21.6017712856515!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135274e9b4a8d45%3A0x6b116cadc452b4c0!2zVHLGsOG7nW5nIFRIUFQgRWRpc29uIC0gVGjDoGkgTmd1ecOqbg!5e0!3m2!1svi!2s!4v1717915200000!5m2!1svi!2s"
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
