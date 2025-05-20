"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"

export default function SelectServicePage() {
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [showErrorMessage, setShowErrorMessage] = useState(false)
  
  const handleSelectService = (service: string) => {
    setSelectedService(service)
    
    if (service === "spotify" || service === "apple") {
      // Store selection
      localStorage.setItem('selectedService', service)
      router.push("/submit-playlist")
    } else {
      // Show error message for "others"
      setShowErrorMessage(true)
    }
  }
  
  const handleBack = () => {
    router.push("/select-ipod")
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Select Your Music Service</h1>
        
        <div className="space-y-4 mb-8">
          <p className="text-gray-300 mb-4">
            What music streaming service do you use?
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => handleSelectService("spotify")}
              className={`p-4 rounded-lg transition-colors ${
                selectedService === "spotify" 
                  ? "bg-green-600 text-white" 
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              Spotify
            </button>
            
            <button
              onClick={() => handleSelectService("apple")}
              className={`p-4 rounded-lg transition-colors ${
                selectedService === "apple" 
                  ? "bg-pink-600 text-white" 
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              Apple Music
            </button>
            
            <button
              onClick={() => handleSelectService("others")}
              className={`p-4 rounded-lg col-span-2 transition-colors ${
                selectedService === "others" 
                  ? "bg-blue-600 text-white" 
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              Others
            </button>
          </div>
          
          {showErrorMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-gray-700 rounded-lg"
            >
              <p className="text-white">
                Sorry, currently we support only Spotify and Apple Music.
              </p>
            </motion.div>
          )}
        </div>
        
        <div className="flex justify-center">
          <button
            onClick={handleBack}
            className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Back
          </button>
        </div>
      </motion.div>
    </div>
  )
}