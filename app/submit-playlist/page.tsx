"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { GoogleLoginModal } from "@/components/GoogleLoginModal"

export default function SubmitPlaylistPage() {
  const router = useRouter()
  const [playlistUrl, setPlaylistUrl] = useState("")
  const [playlistName, setPlaylistName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  
  // Get selected service
  const selectedService = typeof window !== 'undefined' 
    ? localStorage.getItem('selectedService') || "spotify" 
    : "spotify"
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!playlistUrl) return
    
    setIsSubmitting(true)
    
    try {
      // In a real implementation, make an API call to extract playlist metadata
      // Store both the URL and extracted data in localStorage for demo purposes
      localStorage.setItem('playlistUrl', playlistUrl)
      localStorage.setItem('playlistName', playlistName || 'My Playlist')
      
      // Show login modal immediately
      setIsLoginModalOpen(true)
    } catch (error) {
      console.error("Error submitting playlist:", error)
      setIsSubmitting(false)
    }
  }
  
  const handleLoginSuccess = () => {
    // Close the login modal
    setIsLoginModalOpen(false)
    
    // Navigate to loading page
    router.push("/loading")
  }
  
  const handleBack = () => {
    router.push("/select-service")
  }
  
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <GoogleLoginModal 
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-gray-800 rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Submit Your Playlist</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playlistUrl" className="block text-sm font-medium mb-2">
              {selectedService === "spotify" ? "Spotify Playlist URL" : "Apple Music Playlist URL"}
            </label>
            <input
              id="playlistUrl"
              type="text"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              placeholder={selectedService === "spotify" 
                ? "https://open.spotify.com/playlist/..." 
                : "https://music.apple.com/playlist/..."}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="playlistName" className="block text-sm font-medium mb-2">
              Playlist Name (optional)
            </label>
            <input
              id="playlistName"
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="My Awesome Playlist"
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || !playlistUrl}
              className={`px-6 py-2 rounded-lg transition-colors ${
                isSubmitting || !playlistUrl
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Create iPod Experience"}
            </button>
          </div>
          
          <div className="text-center mt-4 text-gray-400 text-sm">
            Your taste deserves more audience.
          </div>
        </form>
      </motion.div>
    </div>
  )
}