"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Track {
  id: string
  title: string
  artist: string
  image_url: string
}

interface CoverFlowProps {
  tracks: Track[]
  initialTrack?: number
  onClose: () => void
}

export function CoverFlow({ tracks, initialTrack = 0, onClose }: CoverFlowProps) {
  const [activeIndex, setActiveIndex] = useState(initialTrack)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 100)
  }, [])

  const handlePrevious = () => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : tracks.length - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev < tracks.length - 1 ? prev + 1 : 0))
  }

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 500) // Allow time for exit animation
  }

  // Return early if no tracks
  if (!tracks.length) return null

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center">
      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Cover flow */}
      <div className="w-full max-w-4xl overflow-hidden">
        <div className="relative coverflow h-64 md:h-96">
          <AnimatePresence initial={false}>
            {tracks.map((track, index) => {
              // Calculate positions - centered on active
              const position = index - activeIndex
              
              // Style based on position
              const isActive = position === 0
              const isVisible = Math.abs(position) <= 3 // Only render visible cards
              
              if (!isVisible) return null
              
              // Dynamic styles based on position
              const zIndex = 20 - Math.abs(position)
              const x = position * 60
              const scale = isActive ? 1 : 0.8 - Math.abs(position) * 0.1
              const rotateY = position * -15
              const opacity = isActive ? 1 : 0.7 - Math.abs(position) * 0.15
              
              return (
                <motion.div
                  key={track.id}
                  className="coverflow-item absolute left-1/2 top-1/2"
                  animate={{
                    zIndex,
                    x: `calc(-50% + ${x}px)`,
                    y: "-50%",
                    rotateY: `${rotateY}deg`,
                    scale,
                    opacity: isVisible ? opacity : 0,
                  }}
                  transition={{ duration: 0.5 }}
                >
                  {/* Album Cover */}
                  <div 
                    className={`w-48 md:w-72 aspect-square rounded-lg shadow-2xl overflow-hidden 
                      ${isActive ? 'ring-4 ring-blue-500 ring-opacity-70' : ''}`}
                  >
                    <Image
                      src={track.image_url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17"}
                      alt={track.title}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

        {/* Now Playing Info */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 50 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 text-center"
        >
          <h2 className="text-2xl font-bold text-white">{tracks[activeIndex]?.title || "No Track Selected"}</h2>
          <p className="text-lg text-gray-400">{tracks[activeIndex]?.artist || ""}</p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8 flex justify-center space-x-8"
        >
          <button
            onClick={handlePrevious}
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"
          >
            <i className="fas fa-backward"></i>
          </button>
          
          <button
            className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-gray-900 hover:bg-gray-200"
          >
            <i className="fas fa-play text-lg"></i>
          </button>
          
          <button
            onClick={handleNext}
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-gray-700"
          >
            <i className="fas fa-forward"></i>
          </button>
        </motion.div>
      </div>
    </div>
  )
}