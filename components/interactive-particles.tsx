"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"
import { useMousePosition } from "@/lib/hooks/use-mouse-position"

interface ParticlesProps {
  className?: string
  quantity?: number
  staticity?: number
  ease?: number
  refresh?: boolean
  color?: string
  particleSize?: number
  particleColor?: string
  lightThemeColor?: string
  darkThemeColor?: string
}

export default function InteractiveParticles({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  refresh = false,
  color = "#8b5cf6",
  particleSize = 2,
  particleColor,
  lightThemeColor = "rgba(124, 58, 237, 0.8)", // Darker, more opaque purple for light theme
  darkThemeColor = "rgba(255, 255, 255, 0.3)", // Original color for dark theme
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useMousePosition()
  const mouse = useRef({ x: 0, y: 0 })
  const canvasSize = useRef({ w: 0, h: 0 })
  const dpr = typeof window !== "undefined" ? window.devicePixelRatio : 1
  const { resolvedTheme } = useTheme() // Use resolvedTheme instead of theme
  const [currentParticleColor, setCurrentParticleColor] = useState(darkThemeColor)

  // Debug the theme
  useEffect(() => {
    console.log("Current theme:", resolvedTheme)
  }, [resolvedTheme])

  // Update particle color based on theme
  useEffect(() => {
    if (particleColor) {
      setCurrentParticleColor(particleColor)
    } else {
      setCurrentParticleColor(resolvedTheme === "light" ? lightThemeColor : darkThemeColor)
    }
  }, [resolvedTheme, particleColor, lightThemeColor, darkThemeColor])

  useEffect(() => {
    if (mousePosition.x && mousePosition.y) {
      mouse.current.x = mousePosition.x
      mouse.current.y = mousePosition.y
    }
  }, [mousePosition])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    canvasSize.current.w = window.innerWidth
    canvasSize.current.h = window.innerHeight
    canvas.width = canvasSize.current.w * dpr
    canvas.height = canvasSize.current.h * dpr
    ctx.scale(dpr, dpr)

    class Particle {
      x: number
      y: number
      size: number
      originalX: number
      originalY: number
      vx: number
      vy: number
      dx: number
      dy: number
      color: string

      constructor() {
        this.x = Math.random() * canvasSize.current.w
        this.y = Math.random() * canvasSize.current.h
        this.size = Math.random() * particleSize + 1
        this.originalX = this.x
        this.originalY = this.y
        this.vx = 0
        this.vy = 0
        this.dx = 0
        this.dy = 0
        this.color = currentParticleColor
      }

      update() {
        // Distance between particle and mouse
        this.dx = mouse.current.x - this.x
        this.dy = mouse.current.y - this.y
        const distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy)

        // Mouse repel force
        if (distance < 100) {
          const angle = Math.atan2(this.dy, this.dx)
          const force = -100 / distance

          this.vx += force * Math.cos(angle)
          this.vy += force * Math.sin(angle)
        }

        // Staticity - tendency to return to original position
        this.vx += (this.originalX - this.x) / staticity
        this.vy += (this.originalY - this.y) / staticity

        // Ease - damping effect
        this.vx *= ease / 100
        this.vy *= ease / 100

        // Update position
        this.x += this.vx
        this.y += this.vy
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fillStyle = this.color
        ctx.fill()
      }
    }

    const init = () => {
      particles = []
      for (let i = 0; i < quantity; i++) {
        particles.push(new Particle())
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.update()
        particle.draw(ctx)
      })

      // Connect particles with lines if they're close enough
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            // Create a connection line with appropriate opacity
            const lineOpacity = 0.3 * (1 - distance / 100)
            let lineColor

            // Handle different color formats (rgba or hex)
            if (currentParticleColor.startsWith("rgba")) {
              // For rgba format, extract the color components and update opacity
              const colorParts = currentParticleColor.match(/rgba$$(\d+),\s*(\d+),\s*(\d+),\s*[\d.]+$$/)
              if (colorParts) {
                lineColor = `rgba(${colorParts[1]}, ${colorParts[2]}, ${colorParts[3]}, ${lineOpacity})`
              } else {
                lineColor = `rgba(124, 58, 237, ${lineOpacity})`
              }
            } else {
              // Default to purple with the calculated opacity
              lineColor = `rgba(124, 58, 237, ${lineOpacity})`
            }

            ctx.beginPath()
            ctx.strokeStyle = lineColor
            ctx.lineWidth = 0.5
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    init()
    animate()

    const handleResize = () => {
      canvasSize.current.w = window.innerWidth
      canvasSize.current.h = window.innerHeight
      canvas.width = canvasSize.current.w * dpr
      canvas.height = canvasSize.current.h * dpr
      ctx.scale(dpr, dpr)
      init()
    }

    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [quantity, staticity, ease, refresh, currentParticleColor, particleSize, dpr])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none ${className}`}
      style={{ background: "transparent" }}
    />
  )
}

