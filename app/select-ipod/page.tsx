"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"

// iPod color options
const ipodColors = [
  { id: "black", name: "Black", path: "/images/ipod-black.png" },
  { id: "silver", name: "Silver", path: "/images/ipod-silver.png" },
  { id: "blue", name: "Blue", path: "/images/ipod-blue.png" },
  { id: "red", name: "Red", path: "/images/ipod-red.png" },
  { id: "yellow", name: "Yellow", path: "/images/ipod-yellow.png" }
]

export default function SelectIpodPage() {
  const router = useRouter()
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  
  const handleSelectIpod = (colorId: string) => {
    setSelectedColor(colorId)
  }
  
  const handleContinue = () => {
    if (selectedColor) {
      // Store selection in localStorage for use in later steps
      localStorage.setItem('selectedIpodColor', selectedColor)
      router.push("/select-service")
    }
  }
  
  const handleBack = () => {
    router.push("/hello")
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl w-full"
      >
        <h1 className="text-3xl font-bold text-center mb-8">Pick your iPod Nano</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {ipodColors.map((ipod) => (
            <div
              key={ipod.id}
              className={`relative cursor-pointer transition-transform duration-300 transform hover:scale-105 ${
                selectedColor === ipod.id ? "scale-110 ring-2 ring-blue-500 rounded-lg" : ""
              }`}
              onClick={() => handleSelectIpod(ipod.id)}
            >
              <div className="flex flex-col items-center">
                <Image
                  src={ipod.path}
                  alt={`${ipod.name} iPod`}
                  width={120}
                  height={240}
                  className="h-auto object-contain"
                />
                <p className="mt-2 text-center text-sm">{ipod.name}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex justify-center space-x-4">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
          
          <button
            onClick={handleContinue}
            disabled={!selectedColor}
            className={`px-6 py-3 rounded-lg transition-colors ${
              selectedColor 
                ? "bg-blue-600 hover:bg-blue-700 text-white" 
                : "bg-gray-600 text-gray-300 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </motion.div>
    </div>
  )
}