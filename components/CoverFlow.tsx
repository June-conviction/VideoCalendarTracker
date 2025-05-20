"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
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
  const [currentIndex, setCurrentIndex] = useState(initialTrack)
  const [direction, setDirection] = useState(0)
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrev()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "Escape") {
        onClose()
      }
    }
    
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, onClose])
  
  const handleNext = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % tracks.length)
  }
  
  const handlePrev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + tracks.length) % tracks.length)
  }
  
  // Get previous, current, and next tracks for the coverflow effect
  const currentTrack = tracks[currentIndex]
  const prevTrack = tracks[(currentIndex - 1 + tracks.length) % tracks.length]
  const nextTrack = tracks[(currentIndex + 1) % tracks.length]
  
  // No tracks available
  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <p className="text-white text-xl">No tracks available</p>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20 transition-colors"
        >
          Close
        </button>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] p-4">
      {/* Header controls */}
      <div className="w-full flex justify-between items-center mb-12">
        <div className="w-1/3">
          <p className="text-gray-400 text-sm">Track {currentIndex + 1} of {tracks.length}</p>
        </div>
        
        <div className="w-1/3 flex justify-center">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="w-1/3"></div>
      </div>
      
      {/* CoverFlow area */}
      <div className="relative w-full max-w-3xl h-96 perspective-1000">
        {/* Cover artwork area */}
        <div className="w-full h-full flex items-center justify-center relative">
          {/* Previous track */}
          <motion.div
            className="absolute transform origin-center"
            initial={{ x: "-20%", rotateY: 45, scale: 0.8, opacity: 0.6, zIndex: 1 }}
            animate={{ x: "-20%", rotateY: 45, scale: 0.8, opacity: 0.6, zIndex: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-52 h-52 bg-white/5 rounded-md overflow-hidden shadow-2xl">
              <Image
                src={prevTrack.image_url}
                alt={prevTrack.title}
                width={208}
                height={208}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
          
          {/* Current track */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              className="absolute transform origin-center z-10"
              initial={{ 
                x: direction === 1 ? "30%" : "-30%", 
                rotateY: direction === 1 ? -45 : 45, 
                scale: 0.8, 
                opacity: 0.6 
              }}
              animate={{ x: "0%", rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ 
                x: direction === 1 ? "-30%" : "30%", 
                rotateY: direction === 1 ? 45 : -45, 
                scale: 0.8, 
                opacity: 0.6 
              }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-64 h-64 bg-white rounded-md overflow-hidden shadow-2xl">
                <Image
                  src={currentTrack.image_url}
                  alt={currentTrack.title}
                  width={256}
                  height={256}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Next track */}
          <motion.div
            className="absolute transform origin-center"
            initial={{ x: "20%", rotateY: -45, scale: 0.8, opacity: 0.6, zIndex: 1 }}
            animate={{ x: "20%", rotateY: -45, scale: 0.8, opacity: 0.6, zIndex: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-52 h-52 bg-white/5 rounded-md overflow-hidden shadow-2xl">
              <Image
                src={nextTrack.image_url}
                alt={nextTrack.title}
                width={208}
                height={208}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Track info */}
      <div className="mt-8 text-center">
        <h3 className="text-2xl font-bold text-white">{currentTrack.title}</h3>
        <p className="text-gray-400 mt-1">{currentTrack.artist}</p>
      </div>
      
      {/* Navigation controls */}
      <div className="flex items-center justify-center mt-8 space-x-6">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </div>
  )
}