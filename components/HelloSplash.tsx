"use client"

import { useEffect } from "react"

interface HelloSplashProps {
  onFinished: () => void
}

export function HelloSplash({ onFinished }: HelloSplashProps) {
  // Auto-transition after 1.5 seconds (reduced from 2.5 for faster flow)
  useEffect(() => {
    const timer = setTimeout(onFinished, 1500)
    return () => clearTimeout(timer)
  }, [onFinished])

  const colors = ["#FF5F5F", "#FFB84A", "#55D7FF", "#91F48F", "#B191F1"]
  
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen bg-black">
      <div className="relative flex flex-col items-center">
        {/* Colorful Hello text - simplified without animations */}
        <div className="flex items-center mb-4">
          {["H", "e", "l", "l", "o"].map((letter, i) => (
            <span
              key={i}
              className="text-8xl sm:text-9xl md:text-[10rem] font-bold"
              style={{ color: colors[i % colors.length] }}
            >
              {letter}
            </span>
          ))}
        </div>
        
        {/* Subtitle */}
        <p className="text-white text-xl md:text-2xl mt-4 px-4 text-center">
          Welcome to your iPod music experience
        </p>
      </div>
    </div>
  )
}