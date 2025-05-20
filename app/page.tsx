"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Image from "next/image"

// All colors available for the iPod selection
const ipodColors = [
  { id: "black", name: "Black", path: "/images/iPod black new version.png" },
  { id: "silver", name: "Silver", path: "/images/iPod silver.png" },
  { id: "blue", name: "Blue", path: "/images/iPod blue.png" },
  { id: "red", name: "Red", path: "/images/iPod red.png" },
  { id: "yellow", name: "Yellow", path: "/images/iPod yellow.png" }
]

// Sample tracks for demo purposes
const sampleTracks = [
  {
    id: "1",
    title: "Blinding Lights",
    artist: "The Weeknd",
    image_url: "https://images.unsplash.com/photo-1619983081563-430f63602796?w=300&h=300"
  },
  {
    id: "2",
    title: "Good Days",
    artist: "SZA",
    image_url: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=300&h=300"
  },
  {
    id: "3",
    title: "Save Your Tears",
    artist: "The Weeknd & Ariana Grande",
    image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300"
  },
  {
    id: "4", 
    title: "Levitating",
    artist: "Dua Lipa",
    image_url: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=300&h=300"
  }
]

export default function Home() {
  // App state
  const [step, setStep] = useState<"hello" | "select" | "selected" | "service" | "playlist" | "coverflow">("hello")
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<"spotify" | "apple" | "other" | null>(null)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  
  // Auto-transition from Hello screen
  useEffect(() => {
    if (step === "hello") {
      const timer = setTimeout(() => {
        setStep("select")
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [step])

  // Handle iPod selection
  const handleSelectIpod = (color: string) => {
    setSelectedColor(color)
    setStep("selected")
    
    // Auto-transition to service selection
    setTimeout(() => {
      setStep("service")
    }, 1200)
  }
  
  // Handle service selection
  const handleSelectService = (service: "spotify" | "apple" | "other") => {
    setSelectedService(service)
    setStep("playlist")
  }
  
  // Handle playlist submission
  const handleSubmitPlaylist = (e: React.FormEvent) => {
    e.preventDefault()
    
    // In a real app, this would submit the playlist data to the backend
    // and then redirect to the profile page after login
    
    // For demo purposes, we'll just show the CoverFlow view first
    setStep("coverflow")
    
    // After a short delay, we'd normally redirect to login/profile
    // In a real app, this would be handled with proper authentication
    setTimeout(() => {
      // Using window.location for client-side navigation
      // In a production app, we'd use Next.js router
      // window.location.href = "/profile"
    }, 3000)
  }
  
  // Handle track navigation
  const handlePrevTrack = () => {
    setCurrentTrackIndex(prev => 
      prev > 0 ? prev - 1 : sampleTracks.length - 1
    )
  }
  
  const handleNextTrack = () => {
    setCurrentTrackIndex(prev => 
      prev < sampleTracks.length - 1 ? prev + 1 : 0
    )
  }
  
  // Helper to find current iPod color data
  const getCurrentIpod = () => {
    return ipodColors.find(ipod => ipod.id === selectedColor) || ipodColors[0]
  }
  
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <AnimatePresence mode="wait">
        {/* STEP 1: Hello Screen */}
        {step === "hello" && (
          <motion.div
            key="hello"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center text-center"
          >
            <div className="flex">
              {["H", "e", "l", "l", "o"].map((letter, i) => (
                <span 
                  key={i}
                  className="text-8xl sm:text-9xl md:text-[10rem] font-bold"
                  style={{ 
                    color: ["#FF5F5F", "#FFB84A", "#55D7FF", "#91F48F", "#B191F1"][i] 
                  }}
                >
                  {letter}
                </span>
              ))}
            </div>
            <p className="mt-4 text-xl">Welcome to your iPod music experience</p>
          </motion.div>
        )}
        
        {/* STEP 2: iPod Selection */}
        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Choose Your iPod</h2>
            <p className="text-gray-400 text-center mb-8 max-w-lg mx-auto">
              Select your favorite color for a personalized browsing experience
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
              {ipodColors.map(ipod => (
                <div key={ipod.id} className="flex flex-col items-center">
                  <button
                    onClick={() => handleSelectIpod(ipod.id)}
                    className={`relative p-1 rounded-lg overflow-hidden transition-all duration-200 
                      ${selectedColor === ipod.id ? 'ring-4 ring-blue-500 ring-opacity-70 scale-105' : 'scale-100'}`}
                  >
                    <Image 
                      src={ipod.path}
                      alt={`${ipod.name} iPod`}
                      width={200}
                      height={300}
                      className="w-full h-auto"
                    />
                  </button>
                  <p 
                    className="mt-3 text-center font-medium"
                    style={{
                      color: ipod.id === 'blue' ? '#4299e1' 
                        : ipod.id === 'red' ? '#f56565' 
                        : ipod.id === 'black' ? '#a0aec0' 
                        : ipod.id === 'yellow' ? '#ecc94b' 
                        : '#e2e8f0'
                    }}
                  >
                    {ipod.name}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* STEP 3: Selected iPod Confirmation */}
        {step === "selected" && selectedColor && (
          <motion.div
            key="selected"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center"
          >
            <div className="p-1 border-4 border-blue-500 rounded-lg shadow-lg w-60">
              <Image
                src={getCurrentIpod().path}
                alt={`${getCurrentIpod().name} iPod`}
                width={300}
                height={600}
                className="w-full h-auto"
              />
            </div>
            <p className="mt-4 text-xl font-medium">
              {getCurrentIpod().name} iPod Selected
            </p>
          </motion.div>
        )}
        
        {/* STEP 4: Service Selection */}
        {step === "service" && (
          <motion.div
            key="service"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-2xl"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Choose Your Music Service</h2>
            <p className="text-gray-400 text-center mb-8">
              Select the music streaming service you use
            </p>
            
            <div className="grid grid-cols-3 gap-6">
              <button
                onClick={() => handleSelectService("spotify")}
                className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <div className="w-16 h-16 bg-[#1DB954] rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.5 2 2 6.5 2 12C2 17.5 6.5 22 12 22C17.5 22 22 17.5 22 12C22 6.5 17.5 2 12 2ZM16.5 16.5C16.2 16.7 15.9 16.8 15.7 16.5C14.2 15.6 12.4 15.1 10.5 15.1C9.2 15.1 8 15.3 6.9 15.6C6.6 15.7 6.3 15.6 6.2 15.3C6.1 15 6.3 14.7 6.6 14.6C7.9 14.2 9.2 14 10.5 14C12.7 14 14.7 14.6 16.3 15.6C16.6 15.7 16.7 16.2 16.5 16.5ZM17.7 13.8C17.4 14 17 14.1 16.7 13.8C15 12.7 12.7 12 10 12C8.5 12 7 12.2 5.7 12.7C5.4 12.8 5 12.6 4.9 12.3C4.8 12 5 11.6 5.3 11.5C6.8 11 8.4 10.7 10 10.7C13 10.7 15.6 11.4 17.5 12.7C17.8 12.8 17.9 13.3 17.7 13.8ZM19 11C18.7 11.2 18.3 11.2 18 11C16 9.8 13 9 9.7 9C8 9 6.3 9.2 4.7 9.7C4.4 9.8 4 9.6 3.9 9.3C3.8 9 4 8.6 4.3 8.5C6 8 7.8 7.7 9.7 7.7C13.3 7.7 16.6 8.5 18.9 9.9C19.2 10.1 19.3 10.6 19 11Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-white font-medium">Spotify</span>
              </button>
              
              <button
                onClick={() => handleSelectService("apple")}
                className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.1 12C17.1 9.2 19.2 7.8 19.3 7.7C18 5.7 15.8 5.4 15 5.3C13.2 5.1 11.4 6.4 10.5 6.4C9.5 6.4 8 5.3 6.5 5.4C4.6 5.5 2.9 6.5 2 8.2C0 11.7 1.5 17 3.4 19.8C4.3 21.1 5.5 22.7 7 22.6C8.5 22.6 9 21.7 10.8 21.7C12.5 21.7 13.1 22.6 14.6 22.6C16.2 22.6 17.2 21.2 18.1 19.8C19.2 18.2 19.7 16.7 19.8 16.6C19.7 16.5 17.1 15.6 17.1 12ZM14.2 3.7C15 2.8 15.5 1.5 15.3 0.2C14.2 0.2 12.8 0.9 12 1.8C11.3 2.6 10.7 3.9 10.9 5.2C12.1 5.3 13.4 4.7 14.2 3.7Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-white font-medium">Apple Music</span>
              </button>
              
              <button
                onClick={() => handleSelectService("other")}
                className="flex flex-col items-center justify-center p-6 bg-gray-800 rounded-xl hover:bg-gray-700 transition-colors"
              >
                <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 3V13.5C11.4 13.2 10.7 13 10 13C7.8 13 6 14.8 6 17C6 19.2 7.8 21 10 21C12.2 21 14 19.2 14 17V7H18V3H12ZM10 19C8.9 19 8 18.1 8 17C8 15.9 8.9 15 10 15C11.1 15 12 15.9 12 17C12 18.1 11.1 19 10 19Z" fill="white"/>
                  </svg>
                </div>
                <span className="text-white font-medium">Other</span>
              </button>
            </div>
          </motion.div>
        )}
        
        {/* STEP 5: Playlist Input */}
        {step === "playlist" && (
          <motion.div
            key="playlist"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-md"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Add Your Playlist</h2>
            <p className="text-gray-400 text-center mb-8">
              Enter your playlist URL to create your iPod experience
            </p>
            
            <form 
              onSubmit={handleSubmitPlaylist}
              className="bg-gray-800 p-6 rounded-xl shadow-lg"
            >
              <div className="mb-4">
                <label htmlFor="playlistUrl" className="block text-sm font-medium mb-2">
                  Playlist URL
                </label>
                <input
                  id="playlistUrl"
                  type="text"
                  placeholder="https://open.spotify.com/playlist/..."
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="playlistName" className="block text-sm font-medium mb-2">
                  Playlist Name (optional)
                </label>
                <input
                  id="playlistName"
                  type="text"
                  placeholder="My Awesome Playlist"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium mb-4"
              >
                Create iPod Experience
              </button>
              
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className="text-gray-400">Your taste deserves more audience.</span>
                <a 
                  href="/profile" 
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  Continue with Google
                </a>
              </div>
            </form>
          </motion.div>
        )}
        
        {/* STEP 6: CoverFlow View */}
        {step === "coverflow" && (
          <motion.div
            key="coverflow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center p-4"
          >
            <button
              onClick={() => setStep("playlist")}
              className="absolute top-4 right-4 text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative w-full max-w-4xl h-60 sm:h-80 mb-8">
              {/* Previous Track */}
              <div 
                className="absolute left-[15%] top-1/2 -translate-y-1/2 transform rotate-[15deg] scale-75 opacity-60 z-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src={sampleTracks[(currentTrackIndex - 1 + sampleTracks.length) % sampleTracks.length].image_url}
                  alt="Previous Track"
                  width={300}
                  height={300}
                  className="w-40 h-40 sm:w-52 sm:h-52 rounded-lg shadow-2xl"
                />
              </div>
              
              {/* Current Track */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform scale-100 z-20">
                <Image
                  src={sampleTracks[currentTrackIndex].image_url}
                  alt={sampleTracks[currentTrackIndex].title}
                  width={300}
                  height={300}
                  className="w-48 h-48 sm:w-60 sm:h-60 rounded-lg shadow-2xl ring-4 ring-blue-500"
                />
              </div>
              
              {/* Next Track */}
              <div 
                className="absolute right-[15%] top-1/2 -translate-y-1/2 transform rotate-[-15deg] scale-75 opacity-60 z-10"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Image
                  src={sampleTracks[(currentTrackIndex + 1) % sampleTracks.length].image_url}
                  alt="Next Track"
                  width={300}
                  height={300}
                  className="w-40 h-40 sm:w-52 sm:h-52 rounded-lg shadow-2xl"
                />
              </div>
            </div>
            
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-bold">
                {sampleTracks[currentTrackIndex].title}
              </h3>
              <p className="text-gray-400">
                {sampleTracks[currentTrackIndex].artist}
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-6">
              <button 
                onClick={handlePrevTrack}
                className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
              
              <button className="w-16 h-16 rounded-full bg-white flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="black" viewBox="0 0 24 24" className="w-8 h-8">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
              
              <button 
                onClick={handleNextTrack}
                className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}