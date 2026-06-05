'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight, GraduationCap } from 'lucide-react'

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

  const defaultSlide = {
    id: 'default',
    title: 'Kiến Tạo Tương Lai Bằng Giáo Dục Hiện Đại',
    subtitle: 'Môi trường học tập quốc tế giúp học sinh phát triển toàn diện về tri thức, kỹ năng và nhân cách trong thời đại số.',
    imageUrl: '/school-logo.jpg',
    linkUrl: '/tuyen-sinh'
  }

  const activeSlides = slides && slides.length > 0 ? slides : [defaultSlide]
  const currentSlide = activeSlides[currentIndex]

  return (
    <section className="hero-section-2026" style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', paddingTop: '80px', background: 'linear-gradient(135deg, rgba(10, 75, 175, 0.08) 0%, rgba(59, 130, 246, 0.05) 50%, #FFFFFF 100%)' }}>
      
      {/* Dynamic styles for floating animations and 3D effects */}
      <style jsx global>{`
        @keyframes floatHeroImg {
          0%, 100% { transform: perspective(1000px) rotateY(-8deg) rotateX(4deg) translateY(0); }
          50% { transform: perspective(1000px) rotateY(-6deg) rotateX(2deg) translateY(-15px); }
        }
        .hero-3d-image {
          animation: floatHeroImg 8s ease-in-out infinite;
          will-change: transform;
        }
        .particle {
          position: absolute;
          background: rgba(10, 75, 175, 0.2);
          border-radius: 50%;
          pointer-events: none;
          animation: rise 15s linear infinite;
        }
        @keyframes rise {
          0% { transform: translateY(110vh) scale(0); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
      `}</style>

      {/* Floating Gradient Blobs */}
      <div className="gradient-blob" style={{ top: '10%', left: '-5%', width: '400px', height: '400px', background: 'var(--color-primary)', opacity: 0.12 }} />
      <div className="gradient-blob" style={{ bottom: '5%', right: '10%', width: '500px', height: '500px', background: 'var(--color-primary-light)', opacity: 0.1 }} />
      
      {/* Light Particles */}
      <div className="particle" style={{ left: '10%', width: '8px', height: '8px', animationDuration: '18s', animationDelay: '0s' }} />
      <div className="particle" style={{ left: '30%', width: '12px', height: '12px', animationDuration: '22s', animationDelay: '4s' }} />
      <div className="particle" style={{ left: '50%', width: '6px', height: '6px', animationDuration: '14s', animationDelay: '2s' }} />
      <div className="particle" style={{ left: '75%', width: '10px', height: '10px', animationDuration: '20s', animationDelay: '7s' }} />
      <div className="particle" style={{ left: '90%', width: '8px', height: '8px', animationDuration: '16s', animationDelay: '1s' }} />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-12)', alignItems: 'center' }}>
          
          {/* LEFT COLUMN: Text & Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)', textAlign: 'left' }} className="animate-fadeInLeft">
            
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(10, 75, 175, 0.08)', color: 'var(--color-primary)', padding: '8px 16px', borderRadius: '9999px', width: 'fit-content', border: '1px solid rgba(10, 75, 175, 0.15)', fontSize: 'var(--font-size-xs)', fontWeight: 700 }}>
              <BookOpen size={14} style={{ color: 'var(--color-gold)' }} />
              <span>TRƯỜNG HỌC CHUẨN QUỐC TẾ</span>
            </div>

            {/* Title with Mount-Restarting key */}
            <h1
              key={`title-${currentSlide.id}`}
              style={{
                margin: 0,
                fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                color: 'var(--color-gray-800)',
                fontFamily: 'var(--font-title)',
                letterSpacing: '-0.03em',
                animation: 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              {currentSlide.id === 'default' ? (
                <>
                  Kiến Tạo <span style={{ color: 'var(--color-primary)' }}>Tương Lai</span><br />
                  Bằng <span style={{ color: 'var(--color-gold)' }}>Giáo Dục</span> Hiện Đại
                </>
              ) : currentSlide.title}
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${currentSlide.id}`}
              style={{
                color: 'var(--color-gray-600)',
                fontSize: 'var(--font-size-base)',
                lineHeight: 1.6,
                margin: 0,
                maxWidth: '540px',
                animation: 'fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                animationFillMode: 'backwards'
              }}
            >
              {currentSlide.subtitle || 'Môi trường giáo dục khai phóng giúp học sinh phát triển năng lực học thuật toàn diện, rèn luyện kỹ năng thời đại số và xây dựng nền tảng nhân cách vững vàng.'}
            </p>

            {/* Buttons */}
            <div
              key={`actions-${currentSlide.id}`}
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                flexWrap: 'wrap',
                animation: 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1)',
                animationFillMode: 'backwards'
              }}
            >
              <Link href="/tuyen-sinh" className="btn btn-gold btn-lg" style={{ padding: '14px 28px' }}>
                Khám Phá Ngay
                <ArrowRight size={18} />
              </Link>
              <Link href={currentSlide.linkUrl || "/tin-tuc"} className="btn btn-outline btn-lg" style={{ padding: '14px 28px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)' }}>
                <Calendar size={18} />
                Lịch Tuyển Sinh
              </Link>
            </div>

            {/* Carousel Controls */}
            {activeSlides.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: 'var(--space-4)' }}>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-600)', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-gray-200)'}
                  aria-label="Previous Slide"
                >
                  <ChevronLeft size={18} />
                </button>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {activeSlides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        width: idx === currentIndex ? '24px' : '8px',
                        height: '8px',
                        borderRadius: 'var(--radius-full)',
                        background: idx === currentIndex ? 'var(--color-primary)' : 'var(--color-gray-300)',
                        border: 'none',
                        padding: 0,
                        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                      }}
                      aria-label={`Slide ${idx + 1}`}
                    />
                  ))}
                </div>
                <button
                  onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
                  style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--color-white)', border: '1px solid var(--color-gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gray-600)', transition: 'all 0.3s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--color-primary)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--color-gray-200)'}
                  aria-label="Next Slide"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: 3D Floating Glass Frame Image */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }} className="animate-fadeInRight">
            
            {/* Background glowing circle behind image */}
            <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', background: 'rgba(255, 109, 0, 0.15)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 0 }} />
            
            {/* Image Glass Frame */}
            <div
              key={`img-frame-${currentSlide.id}`}
              className="hero-3d-image"
              style={{
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '4/3',
                borderRadius: '32px',
                padding: '12px',
                background: 'rgba(255, 255, 255, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.6)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 30px 60px rgba(15, 23, 42, 0.15)',
                zIndex: 1,
                transformStyle: 'preserve-3d',
                transform: 'perspective(1000px) rotateY(-8deg) rotateX(4deg)'
              }}
            >
              <div style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)' }}>
                <img
                  src={currentSlide.imageUrl}
                  alt={currentSlide.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.4) 0%, transparent 40%)' }} />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
