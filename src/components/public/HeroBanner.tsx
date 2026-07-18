'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight, Sparkles, Zap } from 'lucide-react'

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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    setCurrentIndex(0)
  }, [slides?.length])

  // Interactive tilt for image card
  const [tiltStyle, setTiltStyle] = useState({
    transform: 'perspective(1200px) rotateY(-6deg) rotateX(3deg)'
  })

  const handleImageLoad = (id: string, width: number, height: number) => {
    if (width && height) {
      const ratio = width / height
      setImageRatios((prev) => ({ ...prev, [id]: ratio }))
    }
  }

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget
    const box = card.getBoundingClientRect()
    const x = e.clientX - box.left - (box.width / 2)
    const y = e.clientY - box.top - (box.height / 2)
    const tiltX = (y / (box.height / 2)) * -6
    const tiltY = (x / (box.width / 2)) * 6
    setTiltStyle({
      transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03, 1.03, 1.03)`
    })
  }

  const handleCardMouseLeave = () => {
    setTiltStyle({
      transform: 'perspective(1200px) rotateY(-6deg) rotateX(3deg) scale3d(1, 1, 1)'
    })
  }

  // Parallax mouse tracking for background aurora
  const handleSectionMouseMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    if (!sectionRef.current) return
    const rect = sectionRef.current.getBoundingClientRect()
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    })
  }, [])

  // Animated Grid Canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
      ctx.scale(dpr, dpr)
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      time += 0.003
      const w = canvas.offsetWidth
      const h = canvas.offsetHeight
      ctx.clearRect(0, 0, w, h)

      const gridSize = 60
      const cols = Math.ceil(w / gridSize) + 1
      const rows = Math.ceil(h / gridSize) + 1

      // Draw grid lines with pulsing opacity
      for (let i = 0; i < cols; i++) {
        const x = i * gridSize
        const pulse = Math.sin(time + i * 0.3) * 0.5 + 0.5
        ctx.beginPath()
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.04 + pulse * 0.05})`
        ctx.lineWidth = 0.5
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()
      }
      for (let j = 0; j < rows; j++) {
        const y = j * gridSize
        const pulse = Math.sin(time + j * 0.3) * 0.5 + 0.5
        ctx.beginPath()
        ctx.strokeStyle = `rgba(99, 102, 241, ${0.04 + pulse * 0.05})`
        ctx.lineWidth = 0.5
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()
      }

      // Draw glowing intersection dots
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * gridSize
          const y = j * gridSize
          const dist = Math.sqrt(
            Math.pow(x - (mousePos.x / 100) * w, 2) +
            Math.pow(y - (mousePos.y / 100) * h, 2)
          )
          const maxDist = 200
          const glow = Math.max(0, 1 - dist / maxDist)
          const basePulse = Math.sin(time * 2 + i * 0.5 + j * 0.5) * 0.5 + 0.5

          if (glow > 0.05 || basePulse > 0.7) {
            const size = 1.5 + glow * 3
            const alpha = 0.1 + glow * 0.6 + basePulse * 0.1
            ctx.beginPath()
            ctx.arc(x, y, size, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(99, 102, 241, ${alpha})`
            ctx.fill()
            if (glow > 0.3) {
              ctx.beginPath()
              ctx.arc(x, y, size + 4, 0, Math.PI * 2)
              ctx.fillStyle = `rgba(139, 92, 246, ${glow * 0.2})`
              ctx.fill()
            }
          }
        }
      }

      animationId = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [mousePos])

  // Format title with gradient keywords
  const renderFormattedTitle = (title: string) => {
    if (!title) return null;
    const formatted = title
      .replace(/THPT\s+Edison/gi, 'THPT\u00A0Edison')
      .replace(/Lớp\s+10/gi, 'Lớp\u00A010')
      .replace(/Năm\s+Học/gi, 'Năm\u00A0Học')
      .replace(/\s+-\s+/g, '\u00A0-\u00A0');

    const words = formatted.split(/ +/);
    if (words.length <= 1) {
      return <span className="hero-futuristic-gradient">{formatted}</span>;
    }

    const lastWord = words[words.length - 1];
    const firstPart = words.slice(0, words.length - 1).join(' ');
    const isGoldGradient = /202\d/g.test(lastWord) || /tuyển\s*sinh/gi.test(lastWord) || /hsg/gi.test(lastWord);
    const gradientClass = isGoldGradient ? "hero-futuristic-gradient hero-futuristic-gradient--gold" : "hero-futuristic-gradient";

    return (
      <>
        {firstPart}{' '}
        <span className={gradientClass}>{lastWord}</span>
      </>
    );
  }

  // Auto-play slides
  useEffect(() => {
    if (!slides || slides.length <= 1 || isPaused) return
    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
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
      ref={sectionRef}
      className="hero-futuristic"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => { setIsPaused(false) }}
      onMouseMove={handleSectionMouseMove}
    >

      <style>{`
        /* ============================================
           FUTURISTIC HERO BANNER 2026
           ============================================ */

        .hero-futuristic {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          padding-top: 80px;
          overflow: hidden;
          background: linear-gradient(
            160deg,
            #f0f4ff 0%,
            #e8eeff 20%,
            #f5f0ff 40%,
            #eef2ff 60%,
            #f8faff 80%,
            #ffffff 100%
          );
        }

        [data-theme="dark"] .hero-futuristic {
          background: linear-gradient(
            160deg,
            #020617 0%,
            #0a1628 25%,
            #0c1e3d 50%,
            #091a33 75%,
            #020617 100%
          );
        }

        /* Animated Interactive Canvas Grid */
        .hero-futuristic__canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
          opacity: 0.6;
        }

        [data-theme="dark"] .hero-futuristic__canvas {
          opacity: 0.8;
        }

        /* Aurora Blobs that follow mouse */
        .hero-futuristic__aurora {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          pointer-events: none;
          z-index: 1;
          transition: transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          will-change: transform;
        }

        .hero-futuristic__aurora--1 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.1), transparent);
          animation: hero-aurora-float-1 20s ease-in-out infinite alternate;
        }
        .hero-futuristic__aurora--2 {
          width: 450px;
          height: 450px;
          background: radial-gradient(circle, rgba(168, 85, 247, 0.15), rgba(139, 92, 246, 0.08), transparent);
          animation: hero-aurora-float-2 25s ease-in-out infinite alternate;
        }
        .hero-futuristic__aurora--3 {
          width: 350px;
          height: 350px;
          background: radial-gradient(circle, rgba(255, 107, 0, 0.12), rgba(251, 191, 36, 0.06), transparent);
          animation: hero-aurora-float-3 18s ease-in-out infinite alternate;
        }

        [data-theme="dark"] .hero-futuristic__aurora--1 {
          background: radial-gradient(circle, rgba(59, 130, 246, 0.35), rgba(6, 182, 212, 0.15), transparent);
        }
        [data-theme="dark"] .hero-futuristic__aurora--2 {
          background: radial-gradient(circle, rgba(139, 92, 246, 0.25), rgba(59, 130, 246, 0.1), transparent);
        }
        [data-theme="dark"] .hero-futuristic__aurora--3 {
          background: radial-gradient(circle, rgba(255, 107, 0, 0.2), rgba(245, 158, 11, 0.08), transparent);
        }

        @keyframes hero-aurora-float-1 {
          0% { transform: translate(-20%, -10%); }
          50% { transform: translate(5%, 15%); }
          100% { transform: translate(-10%, -5%); }
        }
        @keyframes hero-aurora-float-2 {
          0% { transform: translate(10%, 10%); }
          50% { transform: translate(-15%, -20%); }
          100% { transform: translate(5%, 5%); }
        }
        @keyframes hero-aurora-float-3 {
          0% { transform: translate(0, 0); }
          50% { transform: translate(10%, -15%); }
          100% { transform: translate(-5%, 10%); }
        }

        /* Scan line effect */
        .hero-futuristic__scanline {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(99, 102, 241, 0.012) 2px,
            rgba(99, 102, 241, 0.012) 4px
          );
          pointer-events: none;
          z-index: 2;
        }

        [data-theme="dark"] .hero-futuristic__scanline {
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(59, 130, 246, 0.02) 2px,
            rgba(59, 130, 246, 0.02) 4px
          );
        }

        /* Noise texture overlay */
        .hero-futuristic__noise {
          position: absolute;
          inset: 0;
          opacity: 0.03;
          pointer-events: none;
          z-index: 2;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }

        /* Top gradient border (glowing edge) */
        .hero-futuristic::before {
          content: '';
          position: absolute;
          top: 80px;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(99, 102, 241, 0.25) 20%,
            rgba(168, 85, 247, 0.4) 50%,
            rgba(99, 102, 241, 0.25) 80%,
            transparent 100%
          );
          z-index: 5;
        }

        /* Bottom gradient fade */
        .hero-futuristic::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 200px;
          background: linear-gradient(to top, var(--color-white), transparent);
          z-index: 4;
          pointer-events: none;
        }

        [data-theme="dark"] .hero-futuristic::after {
          background: linear-gradient(to top, #030712, transparent);
        }

        /* Main Grid Layout */
        .hero-futuristic__grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 3rem;
          align-items: center;
          width: 100%;
          position: relative;
          z-index: 5;
        }

        @media (min-width: 992px) {
          .hero-futuristic__grid {
            grid-template-columns: 1.1fr 0.9fr;
            gap: 4rem;
          }
        }

        /* Left Column */
        .hero-futuristic__left {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          text-align: left;
          min-height: 420px;
          justify-content: flex-start;
          align-items: flex-start;
        }

        .hero-futuristic__text-wrapper {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          min-height: 260px;
          justify-content: flex-start;
          align-items: flex-start;
        }

        @media (max-width: 991px) {
          .hero-futuristic__left { min-height: auto; text-align: center; align-items: center; }
          .hero-futuristic__text-wrapper { min-height: auto; align-items: center; }
        }

        /* Glowing Badge */
        .hero-futuristic__badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 8px 20px;
          border-radius: 9999px;
          background: rgba(99, 102, 241, 0.08);
          border: 1px solid rgba(99, 102, 241, 0.2);
          color: var(--color-primary, #4f46e5);
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          animation: fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-theme="dark"] .hero-futuristic__badge {
          background: rgba(59, 130, 246, 0.1);
          border-color: rgba(59, 130, 246, 0.25);
          color: #7dd3fc;
        }

        .hero-futuristic__badge::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.12), transparent);
          animation: hero-badge-shimmer 3s ease-in-out infinite;
        }

        @keyframes hero-badge-shimmer {
          0% { left: -100%; }
          100% { left: 100%; }
        }

        /* Futuristic Title */
        .hero-futuristic__title {
          margin: 0;
          font-size: clamp(2.2rem, 4.8vw, 3.8rem);
          font-weight: 900;
          line-height: 1.1;
          color: #0f172a;
          font-family: var(--font-title);
          letter-spacing: -0.04em;
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        [data-theme="dark"] .hero-futuristic__title {
          color: #f1f5f9;
        }

        .hero-futuristic-gradient {
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 35%, #6366f1 65%, #2563eb 100%);
          background-size: 200% auto;
          animation: hero-gradient-flow 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          display: inline-block;
          position: relative;
          font-weight: 900;
        }

        [data-theme="dark"] .hero-futuristic-gradient {
          background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 40%, #818cf8 70%, #38bdf8 100%);
          background-size: 200% auto;
          animation: hero-gradient-flow 4s ease infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-futuristic-gradient--gold {
          background: linear-gradient(135deg, #ea580c 0%, #f97316 40%, #fb923c 70%, #f59e0b 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        [data-theme="dark"] .hero-futuristic-gradient--gold {
          background: linear-gradient(135deg, #fbbf24 0%, #f97316 40%, #fb923c 70%, #fcd34d 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @keyframes hero-gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        /* Subtitle */
        .hero-futuristic__subtitle {
          color: #475569;
          font-size: 1.1rem;
          line-height: 1.7;
          margin: 0;
          max-width: 520px;
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: backwards;
        }

        [data-theme="dark"] .hero-futuristic__subtitle {
          color: #94a3b8;
        }

        @media (max-width: 991px) {
          .hero-futuristic__subtitle { text-align: center; }
        }

        /* Futuristic Buttons */
        .hero-futuristic__buttons {
          display: flex;
          gap: 1rem;
          flex-wrap: nowrap;
          animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1);
          animation-fill-mode: backwards;
        }
        @media (max-width: 640px) {
          .hero-futuristic__buttons { flex-wrap: wrap; justify-content: center; }
        }
        @media (max-width: 991px) {
          .hero-futuristic__buttons { justify-content: center; }
        }

        .hero-futuristic__btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          min-width: 180px;
          border-radius: 16px;
          background: linear-gradient(135deg, #4f46e5, #6366f1, #7c3aed);
          background-size: 200% auto;
          color: #ffffff;
          font-weight: 700;
          font-size: 1rem;
          border: none;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(79, 70, 229, 0.3), 0 0 40px rgba(99, 102, 241, 0.08);
          text-decoration: none;
        }

        .hero-futuristic__btn-primary::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, transparent, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .hero-futuristic__btn-primary:hover::before { opacity: 1; }

        .hero-futuristic__btn-primary:hover {
          transform: translateY(-3px) scale(1.02);
          box-shadow: 0 8px 30px rgba(79, 70, 229, 0.45), 0 0 60px rgba(99, 102, 241, 0.12);
          background-position: right center;
        }
        .hero-futuristic__btn-primary:active {
          transform: translateY(1px) scale(0.98);
        }

        .hero-futuristic__btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px 28px;
          min-width: 200px;
          border-radius: 16px;
          background: var(--glass-bg);
          color: #334155;
          font-weight: 600;
          font-size: 1rem;
          border: 1px solid rgba(99, 102, 241, 0.15);
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          backdrop-filter: blur(12px);
          text-decoration: none;
        }

        .hero-futuristic__btn-secondary:hover {
          transform: translateY(-3px);
          background: var(--glass-bg);
          border-color: rgba(99, 102, 241, 0.35);
          color: #1e293b;
          box-shadow: 0 8px 25px rgba(99, 102, 241, 0.12);
        }
        .hero-futuristic__btn-secondary:active {
          transform: translateY(1px) scale(0.98);
        }

        [data-theme="dark"] .hero-futuristic__btn-secondary {
          background: var(--glass-bg);
          color: #cbd5e1;
          border-color: rgba(148, 163, 184, 0.2);
        }
        [data-theme="dark"] .hero-futuristic__btn-secondary:hover {
          background: var(--glass-bg);
          border-color: rgba(148, 163, 184, 0.4);
          color: #f1f5f9;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
        }

        /* RIGHT COLUMN - Holographic Frame */
        .hero-futuristic__right {
          display: flex;
          justify-content: center;
          position: relative;
        }

        /* Orbit ring around the image */
        .hero-futuristic__orbit {
          position: absolute;
          inset: -30px;
          border-radius: 50%;
          border: 1px dashed rgba(99, 102, 241, 0.2);
          animation: hero-orbit-spin 30s linear infinite;
          z-index: 0;
        }
        .hero-futuristic__orbit::before {
          content: '';
          position: absolute;
          top: -4px;
          left: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #6366f1;
          box-shadow: 0 0 12px 4px rgba(99, 102, 241, 0.4);
        }

        @keyframes hero-orbit-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Holographic Image Frame - Premium Glass Design */
        .hero-futuristic__frame {
          width: 100%;
          max-width: 580px;
          aspect-ratio: 16/10;
          border-radius: 28px;
          padding: 10px;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.7);
          animation: hero-float-frame 8s ease-in-out infinite;
          z-index: 1;
          transform-style: preserve-3d;
          position: relative;
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.04),
            0 0 80px rgba(99, 102, 241, 0.15);
        }
        [data-theme="dark"] .hero-futuristic__frame {
          background: rgba(15, 23, 42, 0.4);
          border: 1px solid rgba(148, 163, 184, 0.2);
          box-shadow:
            0 20px 40px rgba(0, 0, 0, 0.2),
            0 0 80px rgba(99, 102, 241, 0.1);
        }

        @keyframes hero-float-frame {
          0%, 100% { transform: perspective(1200px) rotateY(-6deg) rotateX(3deg) translateY(0); }
          50% { transform: perspective(1200px) rotateY(-4deg) rotateX(1.5deg) translateY(-12px); }
        }

        .hero-futuristic__frame-inner {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          position: relative;
          background: #f8fafc;
          box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
        }

        /* Glowing light reflection on top edge */
        .hero-futuristic__frame-inner::before {
          content: '';
          position: absolute;
          top: 0;
          left: 10%;
          right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
          z-index: 10;
        }

        .hero-futuristic__frame-inner img {
          width: 100%;
          height: 100%;
          position: relative;
          z-index: 1;
          transition: object-fit 0.3s ease;
          filter: brightness(1.05) contrast(1.02) saturate(1.1);
        }

        .hero-futuristic__frame-blur-bg {
          position: absolute;
          inset: -20px;
          width: calc(100% + 40px);
          height: calc(100% + 40px);
          object-fit: cover;
          filter: blur(20px) brightness(0.85) saturate(1.2);
          opacity: 0.7;
          z-index: 0;
          pointer-events: none;
        }

        /* HUD corner overlay */
        .hero-futuristic__hud-corner {
          position: absolute;
          width: 18px;
          height: 18px;
          z-index: 5;
          pointer-events: none;
          transition: all 0.3s ease;
        }
        .hero-futuristic__frame:hover .hero-futuristic__hud-corner {
          border-color: #4f46e5 !important;
          filter: drop-shadow(0 0 6px rgba(79, 70, 229, 0.5));
          width: 22px;
          height: 22px;
        }
        .hero-futuristic__hud-corner--tl {
          top: 16px; left: 16px;
          border-top: 1.5px solid rgba(99, 102, 241, 0.7);
          border-left: 1.5px solid rgba(99, 102, 241, 0.7);
        }
        .hero-futuristic__hud-corner--tr {
          top: 16px; right: 16px;
          border-top: 1.5px solid rgba(99, 102, 241, 0.7);
          border-right: 1.5px solid rgba(99, 102, 241, 0.7);
        }
        .hero-futuristic__hud-corner--bl {
          bottom: 16px; left: 16px;
          border-bottom: 1.5px solid rgba(99, 102, 241, 0.7);
          border-left: 1.5px solid rgba(99, 102, 241, 0.7);
        }
        .hero-futuristic__hud-corner--br {
          bottom: 16px; right: 16px;
          border-bottom: 1.5px solid rgba(99, 102, 241, 0.7);
          border-right: 1.5px solid rgba(99, 102, 241, 0.7);
        }

        /* Subtle bottom vignette - much lighter */
        .hero-futuristic__frame-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.08) 0%, transparent 30%);
          z-index: 2;
          pointer-events: none;
          border-radius: 24px;
        }

        /* Floating tech stats badges - Futuristic Dark Glass */
        .hero-futuristic__float-badge {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 20px 10px 12px;
          border-radius: 16px;
          background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #f8fafc;
          font-size: 0.85rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          z-index: 10;
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.3),
            inset 0 0 0 1px rgba(255, 255, 255, 0.05);
          animation: hero-float-badge 6s ease-in-out infinite;
          white-space: nowrap;
          overflow: hidden;
        }

        /* Sweeping Light Animation */
        .hero-futuristic__float-badge::after {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 50%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transform: skewX(-25deg);
          animation: badge-sweep 4s infinite;
        }

        @keyframes badge-sweep {
          0% { left: -100%; }
          20% { left: 200%; }
          100% { left: 200%; }
        }

        [data-theme="dark"] .hero-futuristic__float-badge {
          background: rgba(2, 6, 23, 0.75);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow:
            0 8px 32px rgba(0, 0, 0, 0.5),
            inset 0 0 0 1px rgba(99, 102, 241, 0.2);
        }

        .hero-futuristic__float-badge--1 {
          top: 15%;
          right: -20px;
          animation-delay: 0s;
        }
        .hero-futuristic__float-badge--2 {
          bottom: 20%;
          left: -30px;
          animation-delay: 2s;
        }

        @keyframes hero-float-badge {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        .hero-futuristic__float-badge-icon {
          width: 32px;
          height: 32px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          position: relative;
        }
        .hero-futuristic__float-badge-icon--blue {
          background: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
          box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
        }
        [data-theme="dark"] .hero-futuristic__float-badge-icon--blue {
          background: rgba(59, 130, 246, 0.2);
          color: #93c5fd;
        }
        .hero-futuristic__float-badge-icon--gold {
          background: rgba(251, 191, 36, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(251, 191, 36, 0.3);
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.4);
        }
        [data-theme="dark"] .hero-futuristic__float-badge-icon--gold {
          background: rgba(251, 191, 36, 0.2);
          color: #fcd34d;
        }

        /* Carousel Controls */
        .hero-futuristic__controls {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 14px;
          z-index: 10;
          padding: 10px 20px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
        }

        @media (max-width: 991px) {
          .hero-futuristic__controls {
            bottom: 20px;
          }
        }

        .hero-futuristic__control-btn {
          width: 42px;
          height: 42px;
          border-radius: 12px;
          background: var(--glass-bg);
          border: 1px solid rgba(99, 102, 241, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #64748b;
          transition: all 0.3s ease;
          cursor: pointer;
          backdrop-filter: blur(8px);
        }
        .hero-futuristic__control-btn:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.3);
          color: #4f46e5;
          box-shadow: 0 0 20px rgba(99, 102, 241, 0.08);
        }

        [data-theme="dark"] .hero-futuristic__control-btn {
          background: var(--glass-bg);
          border-color: rgba(148, 163, 184, 0.15);
          color: #94a3b8;
        }
        [data-theme="dark"] .hero-futuristic__control-btn:hover {
          background: rgba(59, 130, 246, 0.15);
          border-color: rgba(59, 130, 246, 0.4);
          color: #60a5fa;
        }

        .hero-futuristic__dots {
          display: flex;
          gap: 8px;
        }

        .hero-futuristic__dot {
          height: 4px;
          border-radius: 9999px;
          border: none;
          padding: 0;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .hero-futuristic__dot--active {
          width: 28px;
          background: linear-gradient(90deg, #4f46e5, #7c3aed);
          box-shadow: 0 0 12px rgba(79, 70, 229, 0.35);
        }
        .hero-futuristic__dot--inactive {
          width: 8px;
          background: rgba(99, 102, 241, 0.2);
        }
        .hero-futuristic__dot--inactive:hover {
          background: rgba(99, 102, 241, 0.45);
        }

        /* Slide Transition */
        @keyframes heroSlideEnter {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hero-slide-enter {
          animation: heroSlideEnter 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        /* Floating particles */
        .hero-futuristic__particle {
          position: absolute;
          background: rgba(99, 102, 241, 0.25);
          border-radius: 50%;
          pointer-events: none;
          z-index: 3;
          animation: hero-particle-rise 15s linear infinite;
        }

        [data-theme="dark"] .hero-futuristic__particle {
          background: rgba(59, 130, 246, 0.4);
        }

        @keyframes hero-particle-rise {
          0% { transform: translateY(110vh) scale(0); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.2; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }

        /* Responsive adjustments */
        @media (max-width: 991px) {
          .hero-futuristic__orbit { display: none; }
          .hero-futuristic__float-badge { display: none; }
          .hero-futuristic__frame { max-width: 380px; }
        }

        @media (max-width: 640px) {
          .hero-futuristic__frame { max-width: 320px; }
          .hero-futuristic__title { font-size: clamp(1.8rem, 7vw, 2.5rem); }
        }
      `}</style>

      {/* Interactive Canvas Grid */}
      <canvas ref={canvasRef} className="hero-futuristic__canvas" />

      {/* Aurora Blobs */}
      <div
        className="hero-futuristic__aurora hero-futuristic__aurora--1"
        style={{
          top: `${mousePos.y * 0.3}%`,
          left: `${mousePos.x * 0.2}%`,
        }}
      />
      <div
        className="hero-futuristic__aurora hero-futuristic__aurora--2"
        style={{
          top: `${40 + mousePos.y * 0.1}%`,
          right: `${mousePos.x * 0.15}%`,
        }}
      />
      <div
        className="hero-futuristic__aurora hero-futuristic__aurora--3"
        style={{
          bottom: `${20 + mousePos.y * 0.1}%`,
          left: `${30 + mousePos.x * 0.1}%`,
        }}
      />

      {/* Scan Lines */}
      <div className="hero-futuristic__scanline" />

      {/* Noise Texture */}
      <div className="hero-futuristic__noise" />

      {/* Floating Particles */}
      {[
        { left: '8%', size: 3, dur: 18, delay: 0 },
        { left: '22%', size: 5, dur: 22, delay: 4 },
        { left: '45%', size: 2, dur: 14, delay: 2 },
        { left: '68%', size: 4, dur: 20, delay: 7 },
        { left: '85%', size: 3, dur: 16, delay: 1 },
        { left: '35%', size: 2, dur: 24, delay: 10 },
        { left: '55%', size: 3, dur: 19, delay: 5 },
        { left: '92%', size: 2, dur: 17, delay: 8 },
      ].map((p, i) => (
        <div
          key={i}
          className="hero-futuristic__particle"
          style={{
            left: p.left,
            width: `${p.size}px`,
            height: `${p.size}px`,
            animationDuration: `${p.dur}s`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}

      {/* Main Content */}
      <div className="container" style={{ position: 'relative', zIndex: 5, paddingBottom: '120px', width: '100%' }}>
        <div className="hero-futuristic__grid">

          {/* LEFT COLUMN */}
          <div className="hero-futuristic__left animate-fadeInLeft">
            <div className="hero-futuristic__text-wrapper">

              {/* Badge */}
              <div className="hero-futuristic__badge">
                <Sparkles size={14} style={{ color: '#fbbf24' }} />
                <span>TRƯỜNG HỌC CHUẨN QUỐC TẾ</span>
              </div>

              {/* Title */}
              <h1
                key={`title-${currentSlide.id}`}
                className="hero-futuristic__title hero-slide-enter"
              >
                {currentSlide.id === 'default' ? (
                  <>
                    Kiến Tạo{' '}
                    <span className="hero-futuristic-gradient">Tương Lai</span>
                    <br />
                    Bằng{' '}
                    <span className="hero-futuristic-gradient--gold hero-futuristic-gradient">Giáo Dục</span>
                    {' '}Hiện Đại
                  </>
                ) : renderFormattedTitle(currentSlide.title)}
              </h1>

              {/* Subtitle */}
              <p
                key={`sub-${currentSlide.id}`}
                className="hero-futuristic__subtitle hero-slide-enter"
              >
                {currentSlide.subtitle || 'Môi trường giáo dục khai phóng giúp học sinh phát triển năng lực học thuật toàn diện, rèn luyện kỹ năng thời đại số và xây dựng nền tảng nhân cách vững vàng.'}
              </p>
            </div>

            {/* Buttons */}
            <div className="hero-futuristic__buttons hero-slide-enter" key={`btns-${currentSlide.id}`}>
              {(() => {
                const linkUrl = currentSlide.linkUrl || '/gioi-thieu';

                if (linkUrl.includes('/tuyen-sinh')) {
                  return (
                    <>
                      <Link href="/tuyen-sinh" className="hero-futuristic__btn-primary">
                        Khám Phá Ngay
                        <ArrowRight size={18} />
                      </Link>
                      <Link href="/tuyen-sinh" className="hero-futuristic__btn-secondary">
                        <Calendar size={18} />
                        Lịch Tuyển Sinh
                      </Link>
                    </>
                  );
                }

                if (linkUrl.includes('/thanh-tich')) {
                  return (
                    <>
                      <Link href="/thanh-tich" className="hero-futuristic__btn-primary">
                        Xem Thành Tích
                        <ArrowRight size={18} />
                      </Link>
                      <Link href="/tuyen-sinh" className="hero-futuristic__btn-secondary">
                        <Calendar size={18} />
                        Tuyển Sinh Lớp 10
                      </Link>
                    </>
                  );
                }

                if (linkUrl.includes('/gioi-thieu')) {
                  return (
                    <>
                      <Link href="/gioi-thieu" className="hero-futuristic__btn-primary">
                        Khám Phá Ngay
                        <ArrowRight size={18} />
                      </Link>
                      <Link href="/tuyen-sinh" className="hero-futuristic__btn-secondary">
                        <Calendar size={18} />
                        Tuyển Sinh Lớp 10
                      </Link>
                    </>
                  );
                }

                return (
                  <>
                    <Link href={linkUrl} className="hero-futuristic__btn-primary">
                      Khám Phá Ngay
                      <ArrowRight size={18} />
                    </Link>
                    <Link href="/tuyen-sinh" className="hero-futuristic__btn-secondary">
                      <Calendar size={18} />
                      Tuyển Sinh Lớp 10
                    </Link>
                  </>
                );
              })()}
            </div>
          </div>

          {/* RIGHT COLUMN - Holographic Image */}
          <div className="hero-futuristic__right animate-fadeInRight">

            {/* Orbit ring */}
            <div className="hero-futuristic__orbit" />

            {/* Image Frame */}
            <div
              key={`img-frame-${currentSlide.id}`}
              className="hero-futuristic__frame"
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={tiltStyle}
            >
              <div className="hero-futuristic__frame-inner">
                {/* HUD Corners */}
                <div className="hero-futuristic__hud-corner hero-futuristic__hud-corner--tl" />
                <div className="hero-futuristic__hud-corner hero-futuristic__hud-corner--tr" />
                <div className="hero-futuristic__hud-corner hero-futuristic__hud-corner--bl" />
                <div className="hero-futuristic__hud-corner hero-futuristic__hud-corner--br" />

                {(() => {
                  const currentRatio = imageRatios[currentSlide.id]
                  const useCover = currentRatio === undefined || (currentRatio >= 1.15 && currentRatio <= 1.55)
                  return (
                    <>
                      {!useCover && (
                        <img
                          key={`blur-${currentSlide.id}`}
                          src={currentSlide.imageUrl}
                          alt=""
                          className="hero-futuristic__frame-blur-bg hero-slide-enter"
                        />
                      )}
                      <img
                        key={`img-${currentSlide.id}`}
                        src={currentSlide.imageUrl}
                        alt={currentSlide.title}
                        className="hero-slide-enter"
                        onLoad={(e) => {
                          const img = e.currentTarget
                          handleImageLoad(currentSlide.id, img.naturalWidth, img.naturalHeight)
                        }}
                        style={{
                          objectFit: useCover ? 'cover' : 'contain',
                        }}
                      />
                    </>
                  )
                })()}
                <div className="hero-futuristic__frame-overlay" />
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        {activeSlides.length > 1 && (
          <div className="hero-futuristic__controls">
            <button
              className="hero-futuristic__control-btn"
              onClick={() => setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)}
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="hero-futuristic__dots">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  className={`hero-futuristic__dot ${idx === currentIndex ? 'hero-futuristic__dot--active' : 'hero-futuristic__dot--inactive'}`}
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Slide ${idx + 1}`}
                />
              ))}
            </div>
            <button
              className="hero-futuristic__control-btn"
              onClick={() => setCurrentIndex((prev) => (prev + 1) % activeSlides.length)}
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
