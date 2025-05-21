"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { motion } from "framer-motion"
import { Menu, X, Music, Share2, MessageSquare, Image as ImageIcon } from "lucide-react"

// Cover Flow Component for displaying tracks
const CoverFlow = ({ tracks, onClose }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  
  const handleNext = () => {
    setCurrentIndex(prev => (prev < tracks.length - 1) ? prev + 1 : 0)
  }
  
  const handlePrev = () => {
    setCurrentIndex(prev => (prev > 0) ? prev - 1 : tracks.length - 1)
  }
  
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center">
      <div className="w-full p-4 flex justify-between items-center">
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
      
      <div className="perspective-1000 my-12 relative flex items-center justify-center h-96 w-full">
        {tracks.map((track: any, idx: number) => {
          const isPrev = idx === (currentIndex === 0 ? tracks.length - 1 : currentIndex - 1)
          const isCurrent = idx === currentIndex
          const isNext = idx === (currentIndex === tracks.length - 1 ? 0 : currentIndex + 1)
          
          if (!isPrev && !isCurrent && !isNext) return null
          
          return (
            <div
              key={track.id}
              className={`absolute transition-all duration-500 w-64 h-64 bg-cover bg-center rounded-md shadow-2xl 
                ${isCurrent ? 'z-30 scale-100' : 'z-10 scale-[0.8] opacity-70'} 
                ${isPrev ? '-translate-x-40 rotate-y-45' : ''}
                ${isNext ? 'translate-x-40 -rotate-y-45' : ''}
              `}
              style={{ backgroundImage: `url(${track.image_url})` }}
            />
          )
        })}
      </div>
      
      <div className="text-center my-4">
        <h3 className="text-2xl font-bold text-white">{tracks[currentIndex]?.title}</h3>
        <p className="text-gray-400 mt-1">{tracks[currentIndex]?.artist}</p>
      </div>
      
      <div className="flex items-center justify-center space-x-6">
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  )
}

// Guest Note Component
const GuestNoteModal = ({ isOpen, onClose, onSubmit }: any) => {
  const [noteText, setNoteText] = useState("")
  
  const handleSubmit = () => {
    if (noteText.trim()) {
      onSubmit(noteText)
      setNoteText("")
    }
  }
  
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-white">Leave a Note</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <textarea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Write something nice..."
          className="w-full h-32 bg-gray-700 text-white border border-gray-600 rounded-md p-3 mb-4"
        />
        
        <div className="flex justify-end space-x-2">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  )
}

export default function UserProfilePage() {
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(false)
  const [showCoverFlow, setShowCoverFlow] = useState(false)
  const [showGuestNote, setShowGuestNote] = useState(false)
  const [backgroundIndex, setBackgroundIndex] = useState(0)
  const [guestNotes, setGuestNotes] = useState<{id: string, author: string, text: string, date: string}[]>([])
  
  // Mock backgrounds
  const backgrounds = [
    "https://images.unsplash.com/photo-1691252163653-5ba40ae7bede", // Windows XP classic
    "https://images.unsplash.com/photo-1620121692029-d088224ddc74", // Blue sky
    "https://images.unsplash.com/photo-1579546929662-711aa81148cf", // Gradient
  ]
  
  // Mock playlist data
  const [playlist, setPlaylist] = useState({
    title: "My Favorite Mix",
    url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    tracks: [
      { id: "1", title: "Blinding Lights", artist: "The Weeknd", image_url: "https://images.unsplash.com/photo-1445985543470-41fba5c3144a?w=400&h=400&fit=crop" },
      { id: "2", title: "Save Your Tears", artist: "The Weeknd", image_url: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=400&h=400&fit=crop" },
      { id: "3", title: "Stay", artist: "The Kid LAROI, Justin Bieber", image_url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=400&fit=crop" },
      { id: "4", title: "Industry Baby", artist: "Lil Nas X, Jack Harlow", image_url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&h=400&fit=crop" },
    ]
  })
  
  // Get selected iPod color
  const [ipodColor, setIpodColor] = useState("black")
  
  useEffect(() => {
    // Get stored iPod color from previous steps
    const storedColor = localStorage.getItem('selectedIpodColor')
    if (storedColor) {
      setIpodColor(storedColor)
    }
    
    // Get stored playlist name and URL if available
    const storedName = localStorage.getItem('playlistName')
    if (storedName) {
      setPlaylist(prev => ({ ...prev, title: storedName }))
    }
  }, [])
  
  const handleAddGuestNote = (text: string) => {
    const newNote = {
      id: Date.now().toString(),
      author: "Guest",
      text,
      date: new Date().toISOString()
    }
    
    setGuestNotes(prev => [newNote, ...prev])
    setShowGuestNote(false)
  }
  
  const changeBackground = () => {
    setBackgroundIndex((prev) => (prev + 1) % backgrounds.length)
  }
  
  const handleSharePlaylist = () => {
    // In a real app, this would generate a shareable link
    const shareUrl = `${window.location.origin}/user-profile?user=123`
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        alert("Link copied to clipboard!")
      })
      .catch(err => {
        console.error("Could not copy text: ", err)
      })
  }
  
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url('${backgrounds[backgroundIndex]}')` }}
    >
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <button
          onClick={() => setShowMenu(true)}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <h1 className="text-xl font-semibold text-white drop-shadow-md">
          {"{linkPlaylist}"}
        </h1>
      </header>
      
      {/* Desktop Icons */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 flex flex-wrap justify-center items-start gap-8 pt-12">
          {/* Wallpaper Icon */}
          <div className="flex flex-col items-center">
            <button 
              onClick={changeBackground}
              className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
            >
              <ImageIcon size={32} className="text-white drop-shadow-md" />
              <span className="mt-2 text-xs text-white drop-shadow-md">Wallpaper</span>
            </button>
          </div>
          
          {/* Guest Note */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowGuestNote(true)}
              className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
            >
              <MessageSquare size={32} className="text-white drop-shadow-md" />
              <span className="mt-2 text-xs text-white drop-shadow-md">Guest Note</span>
            </button>
          </div>
          
          {/* My iPod */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => setShowCoverFlow(true)}
              className="w-32 h-60 relative rounded-xl bg-transparent flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <Image 
                src={`/images/iPod ${ipodColor}.png`}
                alt="My iPod"
                width={150}
                height={300}
                className="h-full w-auto object-contain"
              />
              <span className="absolute -bottom-6 text-sm text-white drop-shadow-md">My iPod</span>
            </button>
          </div>
          
          {/* Share Playlist */}
          <div className="flex flex-col items-center">
            <button
              onClick={handleSharePlaylist}
              className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
            >
              <Share2 size={32} className="text-white drop-shadow-md" />
              <span className="mt-2 text-xs text-white drop-shadow-md">Share Playlist</span>
            </button>
          </div>
          
          {/* Post Playlist */}
          <div className="flex flex-col items-center">
            <button
              onClick={() => router.push("/submit-playlist")}
              className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
            >
              <Music size={32} className="text-white drop-shadow-md" />
              <span className="mt-2 text-xs text-white drop-shadow-md">Post Playlist</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Sidebar Menu */}
      {showMenu && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMenu(false)}
          ></div>
          
          {/* Sidebar */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="relative w-64 h-full bg-black/80 backdrop-blur-xl p-4 flex flex-col z-10"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-white text-xl font-semibold">Menu</h2>
              <button
                onClick={() => setShowMenu(false)}
                className="text-white hover:text-gray-300"
              >
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1">
              <ul className="space-y-4">
                <li>
                  <a 
                    href="/" 
                    className="block py-2 px-3 text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a 
                    href="/hello" 
                    className="block py-2 px-3 text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    Make my iPod
                  </a>
                </li>
                <li>
                  <button 
                    className="block w-full text-left py-2 px-3 text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="block py-2 px-3 text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
            
            <div className="mt-auto pt-4 border-t border-white/20">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-600 overflow-hidden mr-3">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600"></div>
                </div>
                <div>
                  <p className="text-white text-sm font-medium">User</p>
                  <p className="text-gray-400 text-xs">user@example.com</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Cover Flow */}
      {showCoverFlow && (
        <CoverFlow 
          tracks={playlist.tracks} 
          onClose={() => setShowCoverFlow(false)} 
        />
      )}
      
      {/* Guest Note Modal */}
      <GuestNoteModal
        isOpen={showGuestNote}
        onClose={() => setShowGuestNote(false)}
        onSubmit={handleAddGuestNote}
      />
      
      {/* Display Guest Notes */}
      {guestNotes.length > 0 && (
        <div className="absolute bottom-4 right-4 max-w-xs w-full">
          <div className="bg-black/40 backdrop-blur-md rounded-lg p-4 shadow-lg">
            <h3 className="text-white font-medium mb-2">Guest Notes</h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {guestNotes.map(note => (
                <div key={note.id} className="bg-white/10 rounded p-2">
                  <div className="flex justify-between items-start">
                    <p className="text-white text-sm font-medium">{note.author}</p>
                    <p className="text-gray-400 text-xs">{new Date(note.date).toLocaleDateString()}</p>
                  </div>
                  <p className="text-white text-sm mt-1">{note.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}