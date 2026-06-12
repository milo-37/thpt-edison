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
  const [imageRatios, setImageRatios] = useState<Record<string, number>>({})
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    setCurrentIndex(0)
  }, [slides?.length])

  // State và Handler cho hiệu ứng 3D Card tương tác chuột
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1000px) rotateY(-8deg) rotateX(4deg)'
  })

  const handleImageLoad = (id: string, width: number, height: number) => {
    if (width && height) {
      const ratio = width / height
      setImageRatios((prev) => ({ ...prev, [id]: ratio }))
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - (box.width / 2)
    const y = e.clientY - box.top - (box.height / 2)
    
    // Góc nghiêng tối đa 8 độ
    const tiltX = (y / (box.height / 2)) * -8
    const tiltY = (x / (box.width / 2)) * 8
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`
    })
  }

  const handleMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1000px) rotateY(-8deg) rotateX(4deg) scale3d(1, 1, 1)'
    })
  }

  // Định dạng tiêu đề và áp dụng màu Gradient phát sáng cho từ khóa quan trọng ở cuối câu của MỌI slide
  const renderFormattedTitle = (title: string) => {
    if (!title) return null;
    
    const formatted = title
      .replace(/THPT\s+Edison/gi, 'THPT\u00A0Edison')
      .replace(/Lớp\s+10/gi, 'Lớp\u00A010')
      .replace(/Năm\s+Học/gi, 'Năm\u00A0Học')
      .replace(/\s+-\s+/g, '\u00A0-\u00A0');

    const words = formatted.split(/ +/);
    if (words.length <= 1) {
      return <span className="text-gradient-neon">{formatted}</span>;
    }

    const lastWord = words[words.length - 1];
    const firstPart = words.slice(0, words.length - 1).join(' ');

    // Kiểm tra xem phần cuối có chứa số năm học hoặc từ khóa tuyển sinh/hsg không
    const isGoldGradient = /202\d/g.test(lastWord) || /tuyển\s*sinh/gi.test(lastWord) || /hsg/gi.test(lastWord);
    const gradientClass = isGoldGradient ? "text-gradient-neon text-gradient-gold" : "text-gradient-neon";

    return (
      <>
        {firstPart}{' '}
        <span className={gradientClass}>
          {lastWord}
        </span>
      </>
    );
  }

  useEffect(() => {
    if (!slides || slides.length <= 1 || isPaused) return
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearTimeout(timer)
  }, [slides, isPaused, currentIndex])

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
    <section
      className="hero-section-2026"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', paddingTop: '80px', background: 'linear-gradient(135deg, rgba(10, 75, 175, 0.08) 0%, rgba(59, 130, 246, 0.05) 50%, var(--color-white) 100%)' }}
    >
      
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
        .text-gradient-neon {
          background: linear-gradient(135deg, var(--color-primary) 0%, #3b82f6 50%, var(--color-primary-light) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          position: relative;
          font-weight: 900;
        }
        .text-gradient-gold {
          background: linear-gradient(135deg, var(--color-gold) 0%, var(--color-gold-light) 50%, #f59e0b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-gradient-neon::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 2px;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--color-primary), var(--color-gold));
          opacity: 0.15;
          border-radius: 2px;
        }
        @keyframes rise {
          0% { transform: translateY(110vh) scale(0); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
        .hero-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: var(--space-12);
          align-items: center;
          width: 100%;
        }
        @media (min-width: 992px) {
          .hero-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        .hero-left-column {
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
          text-align: left;
          min-height: 450px;
          justify-content: flex-start;
          align-items: flex-start;
        }
        .hero-text-wrapper {
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
          min-height: 260px;
          justify-content: flex-start;
          align-items: flex-start;
        }
        @media (max-width: 991px) {
          .hero-left-column {
            min-height: auto;
          }
          .hero-text-wrapper {
            min-height: auto;
          }
        }
        .hero-buttons-container {
          flex-wrap: nowrap;
        }
        @media (max-width: 640px) {
          .hero-buttons-container {
            flex-wrap: wrap;
          }
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

      <div className="container" style={{ position: 'relative', zIndex: 2, paddingBottom: '120px', width: '100%' }}>
        <div className="hero-grid">
          
          {/* LEFT COLUMN: Text & Actions */}
          <div className="hero-left-column animate-fadeInLeft">
            
            {/* Stable Height Wrapper for Text to prevent layout shift */}
            <div className="hero-text-wrapper">
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
                  fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)',
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
                ) : renderFormattedTitle(currentSlide.title)}
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
            </div>

            {/* Buttons - Removed dynamic key to prevent unmount/remount animations on slide switch */}
            <div
              className="hero-buttons-container"
              style={{
                display: 'flex',
                gap: 'var(--space-4)',
                animation: 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1)',
                animationFillMode: 'backwards'
              }}
            >
              {(() => {
                const linkUrl = currentSlide.linkUrl || '/gioi-thieu';
                
                // Case 1: Slide about Admission (Tuyển sinh)
                if (linkUrl.includes('/tuyen-sinh')) {
                  return (
                    <>
                      <Link href="/tuyen-sinh" className="btn btn-gold btn-lg" style={{ padding: '12px 24px', minWidth: '170px' }}>
                        Khám Phá Ngay
                        <ArrowRight size={18} />
                      </Link>
                      <Link href="/tuyen-sinh" className="btn btn-outline btn-lg" style={{ padding: '12px 24px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', minWidth: '200px' }}>
                        <Calendar size={18} />
                        Lịch Tuyển Sinh
                      </Link>
                    </>
                  );
                }
                
                // Case 2: Slide about Achievements (Thành tích)
                if (linkUrl.includes('/thanh-tich')) {
                  return (
                    <>
                      <Link href="/thanh-tich" className="btn btn-gold btn-lg" style={{ padding: '12px 24px', minWidth: '170px' }}>
                        Xem Thành Tích
                        <ArrowRight size={18} />
                      </Link>
                      <Link href="/tuyen-sinh" className="btn btn-outline btn-lg" style={{ padding: '12px 24px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', minWidth: '200px' }}>
                        <Calendar size={18} />
                        Tuyển Sinh Lớp 10
                      </Link>
                    </>
                  );
                }
                
                // Case 3: Slide about Introduction (Giới thiệu)
                if (linkUrl.includes('/gioi-thieu')) {
                  return (
                    <>
                      <Link href="/gioi-thieu" className="btn btn-gold btn-lg" style={{ padding: '12px 24px', minWidth: '170px' }}>
                        Khám Phá Ngay
                        <ArrowRight size={18} />
                      </Link>
                      <Link href="/tuyen-sinh" className="btn btn-outline btn-lg" style={{ padding: '12px 24px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', minWidth: '200px' }}>
                        <Calendar size={18} />
                        Tuyển Sinh Lớp 10
                      </Link>
                    </>
                  );
                }
                
                // Default Case for any other slide (e.g. custom link or new slides)
                // Aligned to render the same button styles and labels to prevent shifting/shrinking
                return (
                  <>
                    <Link href={linkUrl} className="btn btn-gold btn-lg" style={{ padding: '12px 24px', minWidth: '170px' }}>
                      Khám Phá Ngay
                      <ArrowRight size={18} />
                    </Link>
                    <Link href="/tuyen-sinh" className="btn btn-outline btn-lg" style={{ padding: '12px 24px', border: '2px solid var(--color-primary)', color: 'var(--color-primary)', minWidth: '200px' }}>
                      <Calendar size={18} />
                      Tuyển Sinh Lớp 10
                    </Link>
                  </>
                );
              })()}
            </div>


          </div>

          {/* RIGHT COLUMN: 3D Floating Glass Frame Image */}
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }} className="animate-fadeInRight">
            
            {/* Background glowing circle behind image */}
            <div style={{ position: 'absolute', top: '10%', right: '10%', width: '300px', height: '300px', background: 'rgba(255, 109, 0, 0.15)', borderRadius: '50%', filter: 'blur(50px)', zIndex: 0 }} />
            
            {/* Image Glass Frame */}
            <div
              key={`img-frame-${currentSlide.id}`}
              className="hero-3d-image"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                width: '100%',
                maxWidth: '460px',
                aspectRatio: '4/3',
                borderRadius: '32px',
                padding: '12px',
                background: 'var(--glass-bg)',
                border: 'var(--glass-border)',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 30px 60px rgba(15, 23, 42, 0.15)',
                zIndex: 1,
                transformStyle: 'preserve-3d',
                ...tiltStyle
              }}
            >
              <div style={{ width: '100%', height: '100%', borderRadius: '24px', overflow: 'hidden', position: 'relative', boxShadow: 'inset 0 0 10px rgba(0,0,0,0.1)', background: 'rgba(15, 23, 42, 0.05)' }}>
                {(() => {
                  const currentRatio = imageRatios[currentSlide.id]
                  // Mặc định sử dụng 'cover' khi chưa tải xong để tránh giật khung hình
                  // Sử dụng 'cover' nếu tỷ lệ ảnh gần với tỷ lệ 4:3 (từ 1.15 đến 1.55)
                  const useCover = currentRatio === undefined || (currentRatio >= 1.15 && currentRatio <= 1.55)

                  return (
                    <>
                      {/* Ảnh nền mờ phía sau nếu dùng contain */}
                      {!useCover && (
                        <img
                          src={currentSlide.imageUrl}
                          alt=""
                          style={{
                            position: 'absolute',
                            inset: -20,
                            width: 'calc(100% + 40px)',
                            height: 'calc(100% + 40px)',
                            objectFit: 'cover',
                            filter: 'blur(24px) brightness(0.85)',
                            opacity: 0.5,
                            zIndex: 0,
                            pointerEvents: 'none'
                          }}
                        />
                      )}

                      {/* Ảnh chính phía trước */}
                      <img
                        src={currentSlide.imageUrl}
                        alt={currentSlide.title}
                        onLoad={(e) => {
                          const img = e.currentTarget
                          handleImageLoad(currentSlide.id, img.naturalWidth, img.naturalHeight)
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: useCover ? 'cover' : 'contain',
                          position: 'relative',
                          zIndex: 1,
                          transition: 'object-fit 0.3s ease'
                        }}
                      />
                    </>
                  )
                })()}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.25) 0%, transparent 40%)', zIndex: 2, pointerEvents: 'none' }} />
              </div>
            </div>
          </div>

        </div>

        {/* Carousel Controls (Absolutely positioned inside the container) */}
        {activeSlides.length > 1 && (
          <div 
            style={{ 
              position: 'absolute', 
              bottom: '80px', 
              left: 'var(--space-6)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px',
              zIndex: 10 
            }}
          >
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
    </section>
  )
}
