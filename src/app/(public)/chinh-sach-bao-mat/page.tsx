import { Metadata } from 'next'
import { ShieldCheck, Lock, Cookie, UserCheck, FileText, RefreshCw, CheckCircle2 } from 'lucide-react'
import PageBanner from '@/components/public/PageBanner'

export const metadata: Metadata = {
  title: 'Chính sách Bảo mật - Trường THPT Edison',
  description: 'Chính sách bảo mật và xử lý dữ liệu cá nhân của Trường THPT Edison.',
}

const commitments = [
  'Không bán, chia sẻ thông tin cá nhân cho bên thứ ba',
  'Mã hóa dữ liệu truyền tải bằng HTTPS/SSL',
  'Không sử dụng cookie quảng cáo hoặc theo dõi',
  'Người dùng có toàn quyền yêu cầu xóa dữ liệu',
]

/* ── Nhóm chính sách theo từng section ──────────── */
const sectionGroups = [
  {
    label: 'Dữ liệu của bạn',
    title: 'Thu thập & sử dụng thông tin',
    bg: 'transparent',
    cards: [
      {
        icon: FileText,
        title: 'Mục đích thu thập',
        accentColor: '#4f46e5',
        bgColor: 'rgba(99, 102, 241, 0.08)',
        items: [
          'Họ tên, email, SĐT qua form liên hệ',
          'Email qua đăng ký nhận tin tức',
          'Hồ sơ tuyển sinh trực tuyến (nếu có)',
        ],
        footer: 'Chỉ dùng cho mục đích phản hồi yêu cầu và thông báo hoạt động nhà trường.',
      },
      {
        icon: ShieldCheck,
        title: 'Phạm vi sử dụng',
        accentColor: '#7c3aed',
        bgColor: 'rgba(168, 85, 247, 0.08)',
        items: [
          'Không chia sẻ, bán thông tin cho bên thứ ba',
          'Không công khai thông tin mà chưa có sự đồng ý',
          'Chỉ liên hệ theo mục đích đã thông báo',
        ],
      },
    ],
  },
  {
    label: 'An toàn kỹ thuật',
    title: 'Biện pháp bảo vệ dữ liệu',
    bg: 'transparent',
    cards: [
      {
        icon: Lock,
        title: 'Bảo mật hệ thống',
        accentColor: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.08)',
        items: [
          'Kết nối HTTPS/SSL toàn website',
          'Mật khẩu quản trị mã hóa bcrypt',
          'Phân quyền hệ thống quản trị nội dung',
          'Nhật ký hoạt động quản trị',
        ],
      },
      {
        icon: Cookie,
        title: 'Cookie & lưu trữ',
        accentColor: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.08)',
        items: [
          'Cookie xác thực quản trị (httpOnly, Secure)',
          'Tùy chọn sáng/tối lưu localStorage',
          'Không dùng cookie quảng cáo hoặc theo dõi',
        ],
      },
    ],
  },
  {
    label: 'Quyền & cập nhật',
    title: 'Quyền người dùng & thay đổi',
    bg: 'transparent',
    cards: [
      {
        icon: UserCheck,
        title: 'Quyền của bạn',
        accentColor: '#3b82f6',
        bgColor: 'rgba(59, 130, 246, 0.08)',
        items: [
          'Yêu cầu xóa thông tin đã cung cấp',
          'Hủy đăng ký nhận tin bất kỳ lúc nào',
          'Xem hoặc chỉnh sửa thông tin cá nhân',
        ],
        footer: 'Gửi yêu cầu về: contact@edison.edu.vn',
      },
      {
        icon: RefreshCw,
        title: 'Cập nhật chính sách',
        accentColor: '#ec4899',
        bgColor: 'rgba(236, 72, 153, 0.08)',
        items: [
          'Nhà trường có quyền cập nhật khi cần thiết',
          'Thay đổi sẽ công bố tại trang này',
          'Ngày cập nhật mới sẽ được ghi rõ',
        ],
      },
    ],
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>

      <style>{`
        .policy-pair {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: var(--space-8);
        }
        @media (max-width: 768px) {
          .policy-pair { grid-template-columns: 1fr; }
        }

        .policy-card {
          background: var(--glass-bg);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          padding: var(--space-7);
          border-radius: 24px;
          border: 1px solid rgba(99, 102, 241, 0.1);
          box-shadow: 0 10px 30px rgba(99, 102, 241, 0.03);
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
        }
        .policy-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--accent-color, #6366f1), transparent);
          opacity: 0;
          transition: opacity 0.35s ease;
          border-radius: 24px 24px 0 0;
        }
        .policy-card:hover {
          transform: translateY(-6px);
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 20px 50px rgba(99, 102, 241, 0.08);
        }
        .policy-card:hover::before { opacity: 1; }
        .policy-card:hover .policy-icon-box { transform: scale(1.08); }

        [data-theme="dark"] .policy-card {
          background: rgba(15, 23, 42, 0.7);
          border-color: rgba(99, 102, 241, 0.08);
        }
        [data-theme="dark"] .policy-card:hover {
          border-color: rgba(99, 102, 241, 0.2);
        }

        .policy-icon-box {
          width: 48px; height: 48px;
          border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform 0.35s ease;
        }

        .policy-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 14px;
          line-height: 1.7;
          color: var(--color-gray-600);
        }
        .policy-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
          margin-top: 7px;
        }
        .policy-footer {
          font-size: 12.5px;
          color: var(--color-gray-400);
          padding-top: var(--space-3);
          border-top: 1px dashed rgba(99, 102, 241, 0.12);
          font-style: italic;
        }

        /* Commitment strip */
        .commitment-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--space-4);
        }
        @media (max-width: 900px) {
          .commitment-strip { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 500px) {
          .commitment-strip { grid-template-columns: 1fr; }
        }
        .commitment-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: var(--space-4) var(--space-5);
          background: var(--glass-bg);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(99, 102, 241, 0.1);
          border-radius: 16px;
          font-size: 13px;
          font-weight: 600;
          color: var(--color-gray-700);
          line-height: 1.4;
          transition: all 0.3s ease;
        }
        .commitment-item:hover {
          border-color: rgba(99, 102, 241, 0.25);
          box-shadow: 0 8px 20px rgba(99, 102, 241, 0.06);
        }
        [data-theme="dark"] .commitment-item {
          background: rgba(15, 23, 42, 0.6);
          border-color: rgba(99, 102, 241, 0.08);
          color: var(--color-gray-300);
        }

        /* Contact row */
        .privacy-contact {
          display: flex;
          justify-content: center;
          gap: var(--space-10);
          flex-wrap: wrap;
        }
        .privacy-contact-item {
          display: flex; align-items: center; gap: 8px;
          font-size: var(--font-size-sm);
          color: var(--color-gray-600);
          font-weight: 500;
        }
        .privacy-contact-item a {
          color: #4f46e5; font-weight: 600;
          text-decoration: none; transition: color 0.2s;
        }
        .privacy-contact-item a:hover { color: #7c3aed; }
      `}</style>

      {/* ── Banner ─────────────────────────────── */}
      <PageBanner
        label="Cam kết bảo mật"
        title="Chính sách bảo mật"
        description="Cam kết bảo vệ thông tin cá nhân của học sinh, phụ huynh và toàn thể cộng đồng THPT Edison."
      />

      <div className="gradient-divider" />

      {/* ── Cam kết nổi bật ────────────────────── */}
      <section className="section" style={{ background: 'transparent' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Tóm tắt cam kết</span>
            <h2 className="section-title section-title--underlined">Chúng tôi cam kết</h2>
          </div>
          <div className="commitment-strip">
            {commitments.map((text, i) => (
              <div key={i} className="commitment-item">
                <CheckCircle2 size={18} style={{ color: '#10b981', flexShrink: 0 }} />
                <span>{text}</span>
              </div>
            ))}
          </div>
          <p style={{
            textAlign: 'center',
            marginTop: 'var(--space-5)',
            fontSize: 'var(--font-size-xs)',
            color: 'var(--color-gray-400)',
            fontWeight: 600,
            letterSpacing: '0.5px',
          }}>
            Cập nhật lần cuối: Tháng 7 / 2026
          </p>
        </div>
      </section>

      {/* ── Các nhóm chính sách — mỗi nhóm 1 section riêng ── */}
      {sectionGroups.map((group, gIdx) => (
        <div key={gIdx}>
          <div className="gradient-divider" />

          <section className="section" style={{ background: group.bg }}>
            <div className="container">
              <div className="section-header">
                <span className="section-label">{group.label}</span>
                <h2 className="section-title section-title--underlined">{group.title}</h2>
              </div>

              <div className="policy-pair">
                {group.cards.map((card, cIdx) => {
                  const Icon = card.icon
                  return (
                    <div
                      key={cIdx}
                      className="policy-card"
                      style={{ '--accent-color': card.accentColor } as React.CSSProperties}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                        <div
                          className="policy-icon-box"
                          style={{ background: card.bgColor, color: card.accentColor }}
                        >
                          <Icon size={22} />
                        </div>
                        <h3 style={{
                          fontSize: 'var(--font-size-base)',
                          fontWeight: 700,
                          color: 'var(--color-navy)',
                          margin: 0,
                        }}>
                          {card.title}
                        </h3>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {card.items.map((item, i) => (
                          <div key={i} className="policy-item">
                            <div className="policy-dot" style={{ background: card.accentColor }} />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {card.footer && <p className="policy-footer">{card.footer}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        </div>
      ))}

      <div className="gradient-divider" />

      {/* ── Liên hệ ────────────────────────────── */}
      <section className="section" style={{ background: 'transparent' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-label">Hỗ trợ</span>
            <h2 className="section-title section-title--underlined">Liên hệ về bảo mật</h2>
            <p style={{
              color: 'var(--color-gray-500)',
              fontSize: 'var(--font-size-sm)',
              maxWidth: '500px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}>
              Mọi câu hỏi hoặc yêu cầu liên quan đến dữ liệu cá nhân, xin vui lòng liên hệ:
            </p>
          </div>
          <div className="privacy-contact">
            <div className="privacy-contact-item">
              <span>📧</span>
              <a href="mailto:contact@edison.edu.vn">contact@edison.edu.vn</a>
            </div>
            <div className="privacy-contact-item">
              <span>📞</span>
              <span>024 1234 5678</span>
            </div>
            <div className="privacy-contact-item">
              <span>📍</span>
              <span>Minh Đức, Mỹ Hào, Hưng Yên</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
