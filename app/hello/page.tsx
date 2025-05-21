"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import BeamsBackground from "@/components/BeamsBackground"

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
    <div className="min-h-screen text-white flex items-center justify-center relative">
      <BeamsBackground />
    
      <div className="text-center z-10 relative">
        <h1 
          className="text-8xl font-bold mb-8"
          style={{
            backgroundImage: "linear-gradient(45deg, #ff6b6b, #5e60ce, #64dfdf, #ffbe0b)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          hello
        </h1>
        
        <button
          onClick={handleContinue}
          className="mt-8 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}