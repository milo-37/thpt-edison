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
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      {/* Banner đầu trang */}
      <section style={{ background: 'linear-gradient(135deg, var(--color-navy-dark), var(--color-navy))', color: 'var(--color-white)', padding: 'var(--space-12) 0', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 800, margin: 0, color: 'var(--color-gold)' }}>
            Liên hệ với chúng tôi
          </h1>
          <p style={{ opacity: 0.8, fontSize: 'var(--font-size-base)', marginTop: 'var(--space-2)' }}>
            Giải đáp mọi câu hỏi, ý kiến đóng góp của phụ huynh và học sinh nhanh chóng nhất
          </p>
        </div>
      </section>

      {/* Thông tin và Form liên hệ */}
      <section className="section">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-12)' }}>

          {/* Cột trái: Các thẻ liên hệ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div>
              <span className="section-label">Liên kết nhanh</span>
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
                    style={{
                      background: 'var(--color-white)',
                      padding: 'var(--space-5)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-gray-200)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-4)'
                    }}
                  >
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(26,54,93,0.06)', color: 'var(--color-navy)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-gray-800)', margin: '0 0 2px 0' }}>
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
      <section style={{ width: '100%', height: '450px', background: 'var(--color-gray-100)', position: 'relative' }}>
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
