"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Menu, X, Music, Share2, MessageSquare, Image as ImageIcon } from "lucide-react"
import { CoverFlow } from "./CoverFlow"

interface Profile {
  id: string
  name: string
  email: string
  avatarUrl: string
  ipodColor: string
}

interface Playlist {
  id: string
  title: string
  artist: string
  platform: "spotify" | "apple" | "other"
  url: string
  imageUrl: string
  tracks: Track[]
}

interface Track {
  id: string
  title: string
  artist: string
  image_url: string
}

interface GuestNote {
  id: string
  authorName: string
  content: string
  createdAt: string
}

interface ProfilePageProps {
  userId: string
  isOwner: boolean // Whether the current user is the owner of this profile
}

export function ProfilePage({ userId, isOwner = false }: ProfilePageProps) {
  // State for UI control
  const [showSidebar, setShowSidebar] = useState(false)
  const [showCoverFlow, setShowCoverFlow] = useState(false)
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [noteText, setNoteText] = useState("")
  const [isMobile, setIsMobile] = useState(false)
  
  // Mock data - in a real app, this would come from API
  const [profile, setProfile] = useState<Profile>({
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80",
    ipodColor: "silver"
  })
  
  const [playlist, setPlaylist] = useState<Playlist>({
    id: "1",
    title: "My Favorite Mix",
    artist: "Various Artists",
    platform: "spotify",
    url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    imageUrl: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=300&h=300",
    tracks: [
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
  })
  
  const [guestNotes, setGuestNotes] = useState<GuestNote[]>([
    {
      id: "1",
      authorName: "Sarah",
      content: "Love your music taste! 🎵",
      createdAt: "2023-05-15T14:23:00Z"
    }
  ])
  
  const [backgrounds, setBackgrounds] = useState([
    { id: "1", name: "Windows XP", url: "https://images.unsplash.com/photo-1691252163653-5ba40ae7bede?q=80&w=1470&auto=format&fit=crop" },
    { id: "2", name: "Blue Sky", url: "https://images.unsplash.com/photo-1681843302121-b3bff58d9aec?q=80&w=1470&auto=format&fit=crop" },
    { id: "3", name: "Dark Mode", url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1470&auto=format&fit=crop" }
  ])
  
  const [currentBackground, setCurrentBackground] = useState(backgrounds[0].url)
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    
    checkIfMobile()
    window.addEventListener('resize', checkIfMobile)
    
    return () => {
      window.removeEventListener('resize', checkIfMobile)
    }
  }, [])
  
  // Handle adding a guest note
  const handleAddNote = () => {
    if (!noteText.trim()) return
    
    const newNote = {
      id: (guestNotes.length + 1).toString(),
      authorName: "Guest",
      content: noteText.trim(),
      createdAt: new Date().toISOString()
    }
    
    setGuestNotes(prev => [newNote, ...prev])
    setNoteText("")
    setShowNoteInput(false)
  }
  
  // Handle playlist deletion (only available for profile owner)
  const handleDeletePlaylist = () => {
    // In a real app, this would call an API
    alert("Playlist deleted!")
    setShowDeleteConfirm(false)
  }
  
  // Handle sharing the playlist
  const handleSharePlaylist = () => {
    // In a real app, this would generate a shareable link
    navigator.clipboard.writeText(`https://linkplaylist.xyz/user/${userId}`)
    alert("Link copied to clipboard!")
  }
  
  // Format relative time for guest notes
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)
    
    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hr ago`
    return `${Math.floor(diffInSeconds / 86400)} days ago`
  }
  
  return (
    <div 
      className="min-h-screen w-full bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url('${currentBackground}')` }}
    >
      {/* Header */}
      <header className="p-4 flex items-center justify-between">
        <button
          onClick={() => setShowSidebar(true)}
          className="w-10 h-10 rounded-full bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <h1 className="text-xl font-semibold text-white drop-shadow-md">
          {"{linkPlaylist}"}
        </h1>
      </header>
      
      {/* Desktop Layout */}
      {!isMobile && (
        <div className="container mx-auto px-4 py-8 grid grid-cols-12 gap-8">
          {/* Main content */}
          <div className="col-span-12 flex flex-wrap justify-center items-start gap-8 pt-12">
            {/* Wallpaper Icon */}
            <div className="flex flex-col items-center">
              <button 
                onClick={() => {
                  if (isOwner) {
                    const nextBgIndex = backgrounds.findIndex(bg => bg.url === currentBackground) + 1
                    setCurrentBackground(backgrounds[nextBgIndex % backgrounds.length].url)
                  }
                }} 
                className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
              >
                <ImageIcon size={32} className="text-white drop-shadow-md" />
                <span className="mt-2 text-xs text-white drop-shadow-md">Wallpaper</span>
              </button>
            </div>
            
            {/* Guest Note */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowNoteInput(true)}
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
                  src={`/images/iPod ${profile.ipodColor}.png`}
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
                onClick={() => {
                  if (isOwner) {
                    window.location.href = "/add-playlist"
                  }
                }}
                className="w-20 h-20 rounded-xl bg-white/20 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
              >
                <Music size={32} className="text-white drop-shadow-md" />
                <span className="mt-2 text-xs text-white drop-shadow-md">Post Playlist</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Mobile Layout */}
      {isMobile && (
        <div className="container mx-auto px-4 py-8 flex flex-col items-center">
          {/* My iPod */}
          <div className="mb-6">
            <button
              onClick={() => setShowCoverFlow(true)}
              className="w-28 h-52 relative rounded-xl bg-transparent flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
            >
              <Image 
                src={`/images/iPod ${profile.ipodColor}.png`}
                alt="My iPod"
                width={120}
                height={240}
                className="h-full w-auto object-contain"
              />
              <span className="absolute -bottom-6 text-sm text-white drop-shadow-md">My iPod</span>
            </button>
          </div>
          
          {/* Icon Grid */}
          <div className="grid grid-cols-3 gap-4 mt-4">
            {/* Guest Note */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => setShowNoteInput(true)}
                className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
              >
                <MessageSquare size={24} className="text-white drop-shadow-md" />
                <span className="mt-1 text-[10px] text-white drop-shadow-md">Guest Note</span>
              </button>
            </div>
            
            {/* Wallpaper */}
            <div className="flex flex-col items-center">
              <button 
                onClick={() => {
                  if (isOwner) {
                    const nextBgIndex = backgrounds.findIndex(bg => bg.url === currentBackground) + 1
                    setCurrentBackground(backgrounds[nextBgIndex % backgrounds.length].url)
                  }
                }} 
                className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
              >
                <ImageIcon size={24} className="text-white drop-shadow-md" />
                <span className="mt-1 text-[10px] text-white drop-shadow-md">Wallpaper</span>
              </button>
            </div>
            
            {/* Post Playlist */}
            <div className="flex flex-col items-center">
              <button
                onClick={() => {
                  if (isOwner) {
                    window.location.href = "/add-playlist"
                  }
                }}
                className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
              >
                <Music size={24} className="text-white drop-shadow-md" />
                <span className="mt-1 text-[10px] text-white drop-shadow-md">Post Playlist</span>
              </button>
            </div>
            
            {/* Share Playlist */}
            <div className="flex flex-col items-center">
              <button
                onClick={handleSharePlaylist}
                className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur-xl shadow-xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/30 transition-colors"
              >
                <Share2 size={24} className="text-white drop-shadow-md" />
                <span className="mt-1 text-[10px] text-white drop-shadow-md">Share Taste</span>
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Sidebar Menu */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowSidebar(false)}
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
                onClick={() => setShowSidebar(false)}
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
                    href="/make-ipod" 
                    className="block py-2 px-3 text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    Make my iPod
                  </a>
                </li>
                <li>
                  <a 
                    href="/login" 
                    className="block py-2 px-3 text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    {isOwner ? "Logout" : "Login"}
                  </a>
                </li>
                <li>
                  <a 
                    href="/contact" 
                    className="block py-2 px-3 text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </nav>
            
            <div className="mt-auto pt-4 border-t border-white/20">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden mr-3">
                  <Image 
                    src={profile.avatarUrl} 
                    alt={profile.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{profile.name}</p>
                  <p className="text-gray-400 text-xs">{profile.email}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      
      {/* CoverFlow View */}
      {showCoverFlow && (
        <div className="fixed inset-0 z-40 bg-black/90">
          {/* Header */}
          <div className="p-4 flex justify-between items-center">
            <h2 className="text-white text-xl font-semibold">{playlist.title}</h2>
            <button
              onClick={() => setShowCoverFlow(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Cover Flow */}
          <CoverFlow 
            tracks={playlist.tracks}
            onClose={() => setShowCoverFlow(false)}
          />
          
          {/* Delete button - only visible to owner */}
          {isOwner && (
            <div className="absolute bottom-6 left-0 right-0 flex justify-center">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete Playlist
              </button>
            </div>
          )}
        </div>
      )}
      
      {/* Guest Note Input Modal */}
      {showNoteInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowNoteInput(false)}
          ></div>
          
          <div className="relative bg-black/80 backdrop-blur-xl rounded-xl p-6 w-full max-w-md z-10">
            <h3 className="text-white text-xl font-semibold mb-4">Leave a Note</h3>
            
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write something nice..."
              className="w-full h-32 bg-white/10 text-white border border-white/20 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
            ></textarea>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowNoteInput(false)}
                className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Submit
              </button>
            </div>
            
            {/* Display existing notes */}
            {guestNotes.length > 0 && (
              <div className="mt-6 border-t border-white/20 pt-4">
                <h4 className="text-white text-lg font-medium mb-3">Guest Notes</h4>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {guestNotes.map(note => (
                    <div key={note.id} className="bg-white/10 rounded-md p-3">
                      <div className="flex justify-between items-start">
                        <p className="text-white font-medium text-sm">{note.authorName}</p>
                        <p className="text-gray-400 text-xs">{formatRelativeTime(note.createdAt)}</p>
                      </div>
                      <p className="text-white mt-1">{note.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
          ></div>
          
          <div className="relative bg-black/80 backdrop-blur-xl rounded-xl p-6 w-full max-w-sm z-10">
            <h3 className="text-white text-xl font-semibold mb-4">Delete Playlist?</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this playlist? This action cannot be undone.</p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-white hover:bg-white/10 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePlaylist}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}