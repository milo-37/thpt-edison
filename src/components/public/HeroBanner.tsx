'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react'

interface Slide {
  id: string
  title: string
  subtitle: string | null
  imageUrl: string
  linkUrl: string | null
  order: number
}

interface HeroBannerProps {
  slides: Slide[]
}

export default function HeroBanner({ slides }: HeroBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (!slides || slides.length <= 1) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 16000)
    return () => clearInterval(interval)
  }, [slides])

  if (!slides || slides.length === 0) {
    // Default fallback banner if there are no slides in database
    return (
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge animate-fadeIn">
            <BookOpen size={16} />
            <span>Chào mừng bạn đến với THPT Edison</span>
          </div>

          <h1 className="hero-title animate-fadeInUp">
            Khơi Nguồn <span className="highlight">Tri Thức</span><br />
            Kiến Tạo <span className="highlight">Tương Lai</span>
          </h1>

          <p className="hero-subtitle animate-fadeInUp">
            Học tập trong môi trường sáng tạo, định hình năng lực toàn cầu và chinh phục những đỉnh cao mới cùng đội ngũ giáo viên tâm huyết hàng đầu.
          </p>

          <div className="hero-actions animate-fadeInUp">
            <Link href="/tuyen-sinh" className="btn btn-gold btn-lg">
              Thông tin Tuyển sinh
              <ArrowRight size={18} />
            </Link>
            <Link href="/tin-tuc" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
              <Calendar size={18} />
              Tin tức & Sự kiện
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const currentSlide = slides[currentIndex]

  return (
    <section className="hero-section" style={{ minHeight: '80vh', position: 'relative', overflow: 'hidden' }}>
      {/* Style tag inside component to ensure marquee keyframe is available */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translate3d(100%, 0, 0); }
          100% { transform: translate3d(-100%, 0, 0); }
        }
        .hero-marquee-text {
          display: inline-block;
          animation: marquee 16s linear infinite;
          will-change: transform;
          backface-visibility: hidden;
        }
        .hero-marquee-text:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Slides Background Images with Overlay */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: idx === currentIndex ? 1 : 0,
              transition: 'opacity 1.2s ease-in-out',
              background: `linear-gradient(rgba(9, 22, 46, 0.55), rgba(4, 10, 23, 0.85)), url(${slide.imageUrl}) no-repeat center center`,
              backgroundSize: 'cover',
            }}
          />
        ))}
      </div>

      <div className="hero-overlay" style={{ pointerEvents: 'none' }}></div>

      <div className="hero-content" style={{ position: 'relative', zIndex: 2, width: '100%', maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 'var(--space-8)' }}>
        <div className="hero-badge animate-fadeIn">
          <BookOpen size={16} />
          <span>Chào mừng bạn đến với THPT Edison</span>
        </div>

        {/* Scrolling/Marquee Title */}
        <div style={{ width: '100%', overflow: 'hidden', whiteSpace: 'nowrap', marginBottom: 'var(--space-4)' }}>
          <h1
            key={currentSlide.id}
            className="hero-marquee-text"
            style={{
              margin: 0,
              fontSize: 'clamp(2rem, 5vw, 3.5rem)',
              fontWeight: 800,
              color: 'var(--color-white)',
              textShadow: '0 2px 20px rgba(0, 0, 0, 0.6)',
              fontFamily: 'var(--font-title)'
            }}
          >
            {currentSlide.title}
          </h1>
        </div>

        {currentSlide.subtitle && (
          <p
            key={`sub-${currentSlide.id}`}
            className="hero-subtitle animate-fadeInUp"
            style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)', maxWidth: '700px', margin: '0 auto var(--space-8) auto', color: 'rgba(255,255,255,0.9)' }}
          >
            {currentSlide.subtitle}
          </p>
        )}

        <div
          key={`actions-${currentSlide.id}`}
          className="hero-actions animate-fadeInUp"
          style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', marginBottom: 'var(--space-8)' }}
        >
          <Link href={currentSlide.linkUrl || "/tuyen-sinh"} className="btn btn-gold btn-lg">
            Xem Chi Tiết
            <ArrowRight size={18} />
          </Link>
          <Link href="/tin-tuc" className="btn btn-outline btn-lg" style={{ borderColor: 'var(--color-white)', color: 'var(--color-white)' }}>
            <Calendar size={18} />
            Tin tức & Sự kiện
          </Link>
        </div>

        {/* Slide Indicators (dots) */}
        {slides.length > 1 && (
          <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center', marginTop: 'var(--space-4)' }}>
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: idx === currentIndex ? 'var(--color-gold)' : 'rgba(255, 255, 255, 0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'background 0.3s ease',
                }}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Navigation Arrows */}
      {slides.length > 1 && (
        <>
          <button
            onClick={() => setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)}
            style={{
              position: 'absolute',
              left: 'var(--space-4)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              background: 'rgba(9, 22, 46, 0.4)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
            aria-label="Previous Slide"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(9, 22, 46, 0.4)')}
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % slides.length)}
            style={{
              position: 'absolute',
              right: 'var(--space-4)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 3,
              background: 'rgba(9, 22, 46, 0.4)',
              color: 'var(--color-white)',
              border: 'none',
              borderRadius: '50%',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
            aria-label="Next Slide"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--color-gold)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(9, 22, 46, 0.4)')}
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}
    </section>
  )
}
