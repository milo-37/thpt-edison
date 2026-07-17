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

      constructor(width: number, height: number) {
        this.x = Math.random() * width
        this.y = Math.random() * height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.8
        this.speedY = (Math.random() - 0.5) * 0.8
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update(width: number, height: number) {
        this.x += this.speedX
        this.y += this.speedY

        // Bounce off edges
        if (this.x > width) this.speedX *= -1
        else if (this.x < 0) this.speedX *= -1
        
        if (this.y > height) this.speedY *= -1
        else if (this.y < 0) this.speedY *= -1
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        // Thêm glow cho hạt
        ctx.shadowBlur = 10
        ctx.shadowColor = this.color
        ctx.fill()
        ctx.shadowBlur = 0 // Reset
      }
    }

    const init = () => {
      particles = []
      const numberOfParticles = Math.floor((canvas.width * canvas.height) / 15000)
      // Giới hạn số lượng hạt để đảm bảo hiệu năng (tối đa ~100 hạt)
      const clampedCount = Math.min(numberOfParticles, 120)
      
      for (let i = 0; i < clampedCount; i++) {
        particles.push(new Particle(canvas.width, canvas.height))
      }
    }

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.scale(dpr, dpr)
      init()
    }
    
    resize()
    window.addEventListener('resize', resize)

    const connect = () => {
      let opacityValue = 1
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x
          const dy = particles[a].y - particles[b].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 120) {
            opacityValue = 1 - (distance / 120)
            ctx.strokeStyle = `rgba(99, 102, 241, ${opacityValue * 0.15})`
            ctx.lineWidth = 1
            ctx.beginPath()
            ctx.moveTo(particles[a].x, particles[a].y)
            ctx.lineTo(particles[b].x, particles[b].y)
            ctx.stroke()
          }
        }
        
        // Connect with mouse
        const dxMouse = particles[a].x - mouse.x
        const dyMouse = particles[a].y - mouse.y
        const distanceMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse)
        
        if (distanceMouse < 150) {
          opacityValue = 1 - (distanceMouse / 150)
          ctx.strokeStyle = `rgba(10, 75, 175, ${opacityValue * 0.3})`
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.moveTo(particles[a].x, particles[a].y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      for (let i = 0; i < particles.length; i++) {
        particles[i].update(canvas.width / (window.devicePixelRatio || 1), canvas.height / (window.devicePixelRatio || 1))
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
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        opacity: 0.8
      }}
      className="global-animated-canvas"
    />
  )
}
