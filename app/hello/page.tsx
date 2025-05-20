"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function HelloPage() {
  const router = useRouter()

  useEffect(() => {
    // Auto-redirect after animation completes (optional)
    const timer = setTimeout(() => {
      handleContinue()
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    router.push("/select-ipod")
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <motion.h1 
          className="text-8xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          style={{
            backgroundImage: "linear-gradient(45deg, #ff6b6b, #5e60ce, #64dfdf, #ffbe0b)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent"
          }}
        >
          hello
        </motion.h1>
        
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          onClick={handleContinue}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </motion.button>
      </div>
    </div>
  )
}