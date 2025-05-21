"use client"

import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

// Beam type definition
interface Beam {
  x: number
  y: number
  width: number
  height: number
  speed: number
  hue: number
}

export default function BeamsBackground({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Get canvas context
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()
    window.addEventListener('resize', updateSize)
    
    // Create beams
    const beams: Beam[] = []
    for (let i = 0; i < 15; i++) {
      beams.push({
        x: Math.random() * canvas.width,
        y: canvas.height + 100,
        width: 50 + Math.random() * 100,
        height: canvas.height * 1.5,
        speed: 0.4 + Math.random() * 0.8,
        hue: 190 + Math.random() * 70
      })
    }
    
    // Animation
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Update and draw beams
      beams.forEach((beam) => {
        beam.y -= beam.speed
        
        // Reset beam when it goes off screen
        if (beam.y + beam.height < 0) {
          beam.y = canvas.height + 100
          beam.x = Math.random() * canvas.width
        }
        
        // Draw beam
        const gradient = ctx.createLinearGradient(0, beam.y, 0, beam.y + beam.height)
        gradient.addColorStop(0, `hsla(${beam.hue}, 85%, 65%, 0)`)
        gradient.addColorStop(0.2, `hsla(${beam.hue}, 85%, 65%, 0.2)`)
        gradient.addColorStop(0.5, `hsla(${beam.hue}, 85%, 65%, 0.3)`)
        gradient.addColorStop(0.8, `hsla(${beam.hue}, 85%, 65%, 0.2)`)
        gradient.addColorStop(1, `hsla(${beam.hue}, 85%, 65%, 0)`)
        
        ctx.fillStyle = gradient
        ctx.fillRect(beam.x - beam.width / 2, beam.y, beam.width, beam.height)
      })
      
      animationId = requestAnimationFrame(animate)
    }
    
    animate()
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', updateSize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <div className={cn("fixed inset-0 z-[-1]", className)}>
      <canvas 
        ref={canvasRef} 
        className="w-full h-full bg-black" 
        style={{ filter: 'blur(40px)' }}
      />
      <div 
        className="absolute inset-0 bg-gradient-to-tr from-black/50 to-gray-950/30"
      />
    </div>
  )
}