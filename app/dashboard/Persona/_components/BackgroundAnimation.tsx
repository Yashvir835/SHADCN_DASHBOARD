import React, { useEffect, useRef } from 'react'

const BackgroundAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return // Ensure canvas is not null
    const ctx = canvas.getContext('2d')
    if (!ctx) return // Ensure context is available

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()

    const particles: Particle[] = []
    const particleCount = 50
    const colors = ['#8B5CF6', '#6366F1', '#3B82F6', '#10B981', '#F59E0B']

    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor() {
        // Ensure canvas is not null when accessing its properties
        const canvasWidth = canvas?.width ?? 0
        const canvasHeight = canvas?.height ?? 0
        this.x = Math.random() * canvasWidth
        this.y = Math.random() * canvasHeight
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        const canvas = canvasRef.current
        if (!canvas) return // Ensure canvas is not null
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2) this.size -= 0.1

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1
      }

      draw() {
        const canvas = canvasRef.current
        if (!canvas) return // Ensure canvas is not null
        const ctx = canvas.getContext('2d')
        if (!ctx) return // Ensure context is available

        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    const init = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((particle, index) => {
        particle.update()
        particle.draw()
        if (particle.size <= 0.2) {
          particles.splice(index, 1)
          particles.push(new Particle())
        }
      })
      requestAnimationFrame(animate)
    }

    init()
    animate()

    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
    />
  )
}

export default BackgroundAnimation
