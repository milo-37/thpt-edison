'use client'

import { useState, useEffect } from 'react'
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  content: string
  rating: number
}

const testimonialsData: Testimonial[] = [
  {
    id: '1',
    name: 'Nguyễn Minh Thu',
    role: 'Phụ huynh học sinh Lớp 10A2',
    avatar: '/uploads/images/0589d8f2-cea4-4ec0-b33d-db34faf111af.jpg', // Reusing existing sample images in the project
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
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonialsData.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <section className="section section-alt" style={{ overflow: 'hidden', position: 'relative', background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(10, 75, 175, 0.03) 100%)' }}>
      
      {/* Background shapes */}
      <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '300px', height: '300px', background: 'rgba(59, 130, 246, 0.06)', borderRadius: '50%', filter: 'blur(60px)' }} />
      
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
          <span className="section-label">Đánh giá từ cộng đồng</span>
          <h2 className="section-title">Phụ Huynh & Học Sinh Nói Về Edison</h2>
          <p className="section-desc">Những chia sẻ chân thực về hành trình nuôi dưỡng tri thức và trưởng thành tại Edison School Minh Đức.</p>
        </div>

        <div style={{ position: 'relative', maxWidth: '800px', margin: '0 auto', padding: '0 40px' }}>
          
          {/* Testimonial Cards Wrapper */}
          <div style={{ position: 'relative', minHeight: '260px' }}>
            {testimonialsData.map((t, idx) => {
              const isActive = idx === activeIndex
              return (
                <div
                  key={t.id}
                  style={{
                    position: isActive ? 'relative' : 'absolute',
                    inset: 0,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
                    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                    pointerEvents: isActive ? 'auto' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: 'rgba(255, 255, 255, 0.8)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.5)',
                    borderRadius: '24px',
                    padding: 'var(--space-8) var(--space-10)',
                    boxShadow: 'var(--shadow-card)',
                    textAlign: 'center',
                    gap: '16px'
                  }}
                >
                  {/* Quote Icon */}
                  <div style={{ color: 'rgba(255, 109, 0, 0.15)', display: 'flex', justifyContent: 'center' }}>
                    <Quote size={40} fill="currentColor" />
                  </div>

                  {/* Review text */}
                  <p style={{ fontSize: 'var(--font-size-base)', fontStyle: 'italic', color: 'var(--color-gray-700)', lineHeight: 1.7, margin: 0 }}>
                    "{t.content}"
                  </p>

                  {/* Stars Rating */}
                  <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', justifyContent: 'center' }}>
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>

                  {/* User info */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--color-gold)', background: 'var(--color-gray-100)' }}>
                      <img src={t.avatar} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ textAlign: 'left' }}>
                      <h4 style={{ margin: 0, fontSize: 'var(--font-size-sm)', fontWeight: 700, color: 'var(--color-navy)' }}>{t.name}</h4>
                      <span style={{ fontSize: '11px', color: 'var(--color-gray-500)', fontWeight: 500 }}>{t.role}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Nav Controls */}
          <button
            onClick={() => setActiveIndex((prev) => (prev - 1 + testimonialsData.length) % testimonialsData.length)}
            style={{ position: 'absolute', left: '-10px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-600)', transition: 'all 0.3s', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', zIndex: 10 }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-gray-200)'}
            aria-label="Previous review"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setActiveIndex((prev) => (prev + 1) % testimonialsData.length)}
            style={{ position: 'absolute', right: '-10px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-600)', transition: 'all 0.3s', cursor: 'pointer', boxShadow: 'var(--shadow-sm)', zIndex: 10 }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-gray-200)'}
            aria-label="Next review"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots Indicator */}
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginTop: '24px' }}>
            {testimonialsData.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveIndex(idx)}
                style={{
                  width: idx === activeIndex ? '20px' : '8px',
                  height: '8px',
                  borderRadius: 'var(--radius-full)',
                  background: idx === activeIndex ? 'var(--color-primary)' : 'var(--color-gray-300)',
                  border: 'none',
                  padding: 0,
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
