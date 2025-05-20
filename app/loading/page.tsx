"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function LoadingPage() {
  const router = useRouter()

  useEffect(() => {
    // Simulate loading and extraction process
    const timer = setTimeout(() => {
      // After data is "extracted", redirect to user profile
      router.push("/user-profile")
    }, 3000)

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div 
          animate={{ 
            rotate: 360,
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
          className="w-20 h-20 border-t-4 border-blue-500 border-solid rounded-full mx-auto mb-8"
        />
        
        <h2 className="text-2xl font-semibold mb-4">Creating your iPod experience</h2>
        
        <p className="text-gray-400 mb-2">
          Your taste deserves more audience.
        </p>
        
        <div className="mt-8">
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <motion.div 
              className="bg-blue-600 h-2.5 rounded-full" 
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5 }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}