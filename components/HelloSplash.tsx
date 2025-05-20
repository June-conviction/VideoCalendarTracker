"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface HelloSplashProps {
  onFinished: () => void
}

export function HelloSplash({ onFinished }: HelloSplashProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Start the animation sequence
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 2000) // 500ms fadeIn + 1500ms hold = 2000ms

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="flex items-center justify-center min-h-screen bg-black text-white">
      <AnimatePresence
        onExitComplete={() => {
          // Call onFinished when exit animation completes
          onFinished()
        }}
      >
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.5,
              ease: isVisible ? "easeIn" : "easeOut",
            }}
            className="w-full max-w-xl flex items-center justify-center"
          >
            <Image
              src="/images/hello.png"
              alt="Hello"
              width={1200}
              height={400}
              className="w-56 md:w-96 h-auto"
              priority
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
