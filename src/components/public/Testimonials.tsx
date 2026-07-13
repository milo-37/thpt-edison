'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string | null
  content: string
  rating: number
}

const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Nguyễn Minh Thu',
    role: 'Phụ huynh học sinh Lớp 10A2',
    avatar: '/uploads/images/0589d8f2-cea4-4ec0-b33d-db34faf111af.jpg',
    content: 'Chúng tôi rất yên tâm khi gửi gắm con tại Edison School. Không chỉ cơ sở vật chất khang trang, hiện đại mà phương pháp dạy học đổi mới của các thầy cô giúp con học tập vô cùng hứng khởi và tự lập.',
    rating: 5
  },
  {
    id: '2',
    name: 'Trần Hoàng Long',
    role: 'Học sinh Cựu học khóa 2023 - Đạt học bổng NUS',
    avatar: '/uploads/images/2719cbb3-3fc4-40ef-8134-be77b5b9f35d.jpg',
    content: 'Những năm tháng học tập dưới mái trường Edison đã giúp em khai phá tối đa tư duy học thuật và năng lực công nghệ. Sự dìu dắt tận tình của thầy cô là bệ phóng lớn giúp em chinh phục học bổng quốc tế.',
    rating: 5
  },
  {
    id: '3',
    name: 'Phạm Minh Đức',
    role: 'Phụ huynh học sinh Lớp 11 chuyên Anh',
    avatar: '/uploads/images/31aaeadd-50b6-4821-b138-f841c019f772.jpg',
    content: 'Trường hướng tới giáo dục toàn diện thực chất. Con tôi được tham gia rất nhiều câu lạc bộ ngoại khóa bổ ích, phát triển kỹ năng mềm vượt trội bên cạnh việc tích lũy kiến thức văn hóa.',
    rating: 5
  }
]

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(testimonialsData)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => {
        if (data.testimonials && data.testimonials.length > 0) {
          setTestimonials(data.testimonials)
        }
      })
      .catch(err => console.error('Failed to fetch testimonials:', err))
  }, [])

  useEffect(() => {
    if (testimonials.length === 0) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [testimonials])

  if (testimonials.length === 0) return null

  return (
    <section className="section" style={{ overflow: 'hidden', position: 'relative', background: 'linear-gradient(180deg, var(--color-white) 0%, var(--color-gray-50) 100%)' }}>
      <style>{`
        .testimonial-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(99, 102, 241, 0.1);
          border-radius: 28px;
          padding: var(--space-8) var(--space-10);
          text-align: center;
          gap: 18px;
          position: relative;
          overflow: hidden;
        }
        .testimonial-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #6366f1, #8b5cf6, transparent);
          border-radius: 28px 28px 0 0;
        }
        [data-theme="dark"] .testimonial-card {
          background: rgba(15, 23, 42, 0.65);
          border-color: rgba(99, 102, 241, 0.08);
        }
        .testimonial-quote-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(168, 85, 247, 0.04));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #6366f1;
        }
        [data-theme="dark"] .testimonial-quote-icon {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.12), rgba(139, 92, 246, 0.06));
          color: #818cf8;
        }
        .testimonial-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 42px;
          height: 42px;
          border-radius: 14px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(99, 102, 241, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-gray-500);
          transition: all 0.3s ease;
          cursor: pointer;
          z-index: 10;
        }
        .testimonial-nav-btn:hover {
          background: rgba(99, 102, 241, 0.08);
          border-color: rgba(99, 102, 241, 0.3);
          color: #4f46e5;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.1);
        }
        [data-theme="dark"] .testimonial-nav-btn {
          background: rgba(15, 23, 42, 0.85);
          border-color: rgba(99, 102, 241, 0.1);
          color: var(--color-gray-400);
        }
        [data-theme="dark"] .testimonial-nav-btn:hover {
          background: rgba(99, 102, 241, 0.12);
          border-color: rgba(99, 102, 241, 0.3);
          color: #818cf8;
        }
      `}</style>
      
      {/* Background decoration */}
      <div aria-hidden="true" role="presentation" style={{ position: 'absolute', top: '15%', left: '-8%', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.06) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div aria-hidden="true" role="presentation" style={{ position: 'absolute', bottom: '10%', right: '-5%', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)', borderRadius: '50%', filter: 'blur(50px)', pointerEvents: 'none' }} />
      
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <span className="section-label">Đánh giá từ cộng đồng</span>
          <h2 className="section-title section-title--underlined" style={{ display: 'block' }}>Phụ huynh & học sinh nói về Edison</h2>
          <p className="section-desc">Những chia sẻ chân thực về hành trình nuôi dưỡng tri thức và trưởng thành tại Edison School Minh Đức.</p>
        </div>

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '0 50px' }}>
          
          {/* Testimonial Cards Wrapper */}
          <div style={{ position: 'relative', minHeight: '280px' }}>
            {testimonials.map((t, idx) => {
              const isActive = idx === activeIndex
              return (
                <figure
                  key={t.id}
                  className="testimonial-card"
                  style={{
                    position: isActive ? 'relative' : 'absolute',
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    visibility: isActive ? 'visible' : 'hidden',
                    transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.96) translateY(12px)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: isActive ? 'auto' : 'none',
                    margin: 0,
                  }}
                  aria-hidden={!isActive}
                >
                  {/* Quote Icon */}
                  <span className="testimonial-quote-icon" aria-hidden="true">
                    <Quote size={20} />
                  </span>

                  {/* Review text */}
                  <blockquote style={{ fontSize: 'var(--font-size-base)', fontStyle: 'italic', color: 'var(--color-gray-700)', lineHeight: 1.7, margin: 0 }}>
                    &ldquo;{t.content}&rdquo;
                  </blockquote>

                  {/* Stars Rating */}
                  <div
                    role="img"
                    aria-label={`Đánh giá ${t.rating} sao`}
                    style={{ display: 'flex', gap: '4px', color: '#fbbf24', justifyContent: 'center' }}
                  >
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" aria-hidden="true" />
                    ))}
                  </div>

                  {/* User info */}
                  <figcaption style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '8px', justifyContent: 'center' }}>
                    <span style={{ width: '50px', height: '50px', borderRadius: '50%', overflow: 'hidden', border: '2.5px solid #6366f1', background: 'var(--color-gray-100)', boxShadow: '0 0 12px rgba(99, 102, 241, 0.15)', display: 'block', flexShrink: 0 }}>
                      <img src={t.avatar || '/uploads/images/31aaeadd-50b6-4821-b138-f841c019f772.jpg'} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </span>
                    <div style={{ textAlign: 'left' }}>
                      <strong style={{ display: 'block', fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)' }}>{t.name}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--color-gray-500)', fontWeight: 500 }}>{t.role}</span>
                    </div>
                  </figcaption>
                </figure>
              )
            })}
          </div>

          {/* Nav Controls */}
          <button
            className="testimonial-nav-btn"
            onClick={() => setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
            style={{ left: '-5px' }}
            aria-label="Đánh giá trước"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>
          <button
            className="testimonial-nav-btn"
            onClick={() => setActiveIndex((prev) => (prev + 1) % testimonials.length)}
            style={{ right: '-5px' }}
            aria-label="Đánh giá tiếp theo"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>

          {/* Dots Indicator — synced with hero banner style */}
          <div role="tablist" aria-label="Danh sách đánh giá" style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginTop: '28px' }}>
            {testimonials.map((t, idx) => (
              <button
                key={idx}
                role="tab"
                onClick={() => setActiveIndex(idx)}
                aria-selected={idx === activeIndex}
                aria-label={`Đánh giá của ${t.name}`}
                style={{
                  width: idx === activeIndex ? '28px' : '8px',
                  height: '4px',
                  borderRadius: '9999px',
                  background: idx === activeIndex ? 'linear-gradient(90deg, #4f46e5, #7c3aed)' : 'rgba(99, 102, 241, 0.2)',
                  border: 'none',
                  padding: 0,
                  transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  cursor: 'pointer',
                  boxShadow: idx === activeIndex ? '0 0 12px rgba(79, 70, 229, 0.35)' : 'none',
                }}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
