"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

interface TypingEffectProps {
  text: string
  delay?: number
  speed?: number
  className?: string
  onComplete?: () => void
}

export function TypingEffect({ text, delay = 0, speed = 40, className = "", onComplete }: TypingEffectProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [started, setStarted] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout

    // Initial delay before starting
    if (!started) {
      timeout = setTimeout(() => {
        setStarted(true)
      }, delay)
      return () => clearTimeout(timeout)
    }

    // Type out the text
    if (started && currentIndex < text.length) {
      timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)
    } else if (started && currentIndex === text.length && onComplete) {
      timeout = setTimeout(() => {
        onComplete()
      }, 300)
    }

    return () => clearTimeout(timeout)
  }, [text, delay, speed, currentIndex, started, onComplete])

  return (
    <div className={className}>
      {displayedText}
      {started && currentIndex < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Number.POSITIVE_INFINITY, duration: 0.5 }}
          className="inline-block ml-0.5 w-1 h-4 bg-current align-text-bottom"
        />
      )}
    </div>
  )
}
