'use client'

import { useEffect, useRef } from 'react'

export default function GlobalAnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let particles: Particle[] = []
    // DPR ở outer scope để init() có thể truy cập
    let dpr = window.devicePixelRatio || 1

    // Mouse interaction state
    let mouse = { x: -1000, y: -1000 }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
    }

    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseout', handleMouseLeave)

    const colors = [
      '#0A4BAF', // Navy Blue
      '#FF6B00', // Orange
      '#06b6d4', // Cyan
      '#6366f1'  // Indigo
    ]

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor(cssWidth: number, cssHeight: number) {
        // Khởi tạo bằng CSS pixels (không nhân DPR)
        this.x = Math.random() * cssWidth
        this.y = Math.random() * cssHeight
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.8
        this.speedY = (Math.random() - 0.5) * 0.8
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update(cssWidth: number, cssHeight: number) {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges (CSS pixel bounds)
        if (this.x > cssWidth) { this.x = cssWidth; this.speedX *= -1 }
        else if (this.x < 0)   { this.x = 0;        this.speedX *= -1 }

        if (this.y > cssHeight) { this.y = cssHeight; this.speedY *= -1 }
        else if (this.y < 0)    { this.y = 0;         this.speedY *= -1 }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        // Glow effect
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color
        ctx.fill()
        ctx.shadowBlur = 0 // Reset
      }
    }

    // Trả về CSS dimensions (logical pixels) của canvas
    const getCssDimensions = () => ({
      w: canvas.width / dpr,
      h: canvas.height / dpr,
    })

    const init = () => {
      particles = []
      const { w, h } = getCssDimensions()
      const numberOfParticles = Math.floor((w * h) / 15000)
      // Giới hạn số lượng hạt để đảm bảo hiệu năng (tối đa ~120 hạt)
      const clampedCount = Math.min(numberOfParticles, 120)

      for (let i = 0; i < clampedCount; i++) {
        particles.push(new Particle(w, h))
      }
    }

    const resize = () => {
      // Cập nhật DPR mỗi khi resize (có thể thay đổi khi drag window sang màn khác)
      dpr = window.devicePixelRatio || 1
      // Đặt kích thước vật lý (physical pixels) cho canvas
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      // Scale context về CSS pixels — setting canvas.width/height reset transform tự động
      ctx.scale(dpr, dpr)
      init()
    }

    resize()
    window.addEventListener('resize', resize)

    const connect = () => {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            const opacity = (1 - distance / 120) * 0.15
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }

        // Kết nối với chuột
        const dxMouse = particles[a].x - mouse.x
        const dyMouse = particles[a].y - mouse.y
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)

        if (distanceMouse < 150) {
          const opacity = (1 - distanceMouse / 150) * 0.3
          ctx.strokeStyle = `rgba(10, 75, 175, ${opacity})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(particles[a].x, particles[a].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
    }

    const animate = () => {
      const { w, h } = getCssDimensions()
      // Clear bằng CSS dimensions (không dùng canvas.width vật lý)
      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        particles[i].update(w, h)
        particles[i].draw(ctx)
      }

      connect()
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseout', handleMouseLeave)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      role="presentation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.6,
      }}
      className="global-animated-canvas"
    />
  )
}
