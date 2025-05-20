"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, Music, Apple, Disc2 } from "lucide-react"
import { Stepper } from "./Stepper"

interface Message {
  id: string
  role: "user" | "bot"
  text: string
  likeable?: boolean
  typing?: boolean
}

interface ChatStepProps {
  onSelect: (service: "spotify" | "apple" | "other") => void
  onBack: () => void
}

// ChatBubble components
function ChatBubble({ 
  variant = "received", 
  children
}: { 
  variant?: "sent" | "received"
  children: React.ReactNode 
}) {
  return (
    <div className={`flex ${variant === "sent" ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`px-4 py-3 rounded-2xl max-w-[80%] ${
          variant === "sent"
            ? "bg-blue-500 text-white rounded-tr-none"
            : "bg-gray-800 text-white rounded-tl-none"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

// Typing animation component
function TypingEffect({ text, onComplete }: { text: string; onComplete?: () => void }) {
  const [displayText, setDisplayText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 30) // Speed of typing
      
      return () => clearTimeout(timeout)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, onComplete])
  
  return <>{displayText}</>
}

// Main ChatStep component
export function ChatStep({ onSelect, onBack }: ChatStepProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentTypingMessage, setCurrentTypingMessage] = useState<string | null>(null)
  const [showServiceOptions, setShowServiceOptions] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to the bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])
  
  // Initial bot welcome message
  useEffect(() => {
    const initialMessage = "Hi there! I'll help you set up your playlist. Which music streaming service do you use?"
    
    // Add with typing effect
    setMessages([
      {
        id: "welcome",
        role: "bot",
        text: "",
        typing: true
      }
    ])
    
    setCurrentTypingMessage(initialMessage)
    
    // After typing completes, show options
    const timer = setTimeout(() => {
      setShowServiceOptions(true)
    }, initialMessage.length * 30 + 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Handle when typing completes
  const handleTypingComplete = (id: string, text: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === id ? { ...msg, text, typing: false } : msg
      )
    )
    setCurrentTypingMessage(null)
  }
  
  // Handle selecting a service
  const handleSelectService = (service: "spotify" | "apple" | "other") => {
    // User message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      text: service === "spotify" 
        ? "I use Spotify" 
        : service === "apple" 
          ? "I use Apple Music" 
          : "I use another service"
    }
    
    // Add user message
    setMessages(prev => [...prev, userMessage])
    
    // Bot response
    setTimeout(() => {
      const responseText = service === "spotify" 
        ? "Great! Spotify has a huge library. Please paste your Spotify playlist link below." 
        : service === "apple" 
          ? "Apple Music is an excellent choice! Please paste your Apple Music playlist link below."
          : "No problem! You can manually enter your playlist details on the next screen."
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        text: "",
        typing: true
      }
      
      setMessages(prev => [...prev, botMessage])
      setCurrentTypingMessage(responseText)
      
      // Forward to parent after some delay
      setTimeout(() => {
        onSelect(service)
      }, responseText.length * 30 + 500)
      
    }, 500)
  }
  
  return (
    <div className="flex flex-col h-full w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="mr-1" size={20} />
          <span>Back</span>
        </button>
        
        <Stepper currentStep={2} />
      </div>
      
      {/* Chat container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pb-4 space-y-4 mb-4"
        style={{ maxHeight: "calc(100vh - 240px)" }}
      >
        {messages.map((message) => (
          <ChatBubble key={message.id} variant={message.role === "user" ? "sent" : "received"}>
            {message.typing && currentTypingMessage ? (
              <TypingEffect 
                text={currentTypingMessage} 
                onComplete={() => handleTypingComplete(message.id, currentTypingMessage)} 
              />
            ) : (
              <span>{message.text}</span>
            )}
          </ChatBubble>
        ))}
      </div>
      
      {/* Service selection */}
      <AnimatePresence>
        {showServiceOptions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-4 grid grid-cols-3 gap-4"
          >
            <button
              onClick={() => handleSelectService("spotify")}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center mb-2">
                <Disc2 size={24} color="white" />
              </div>
              <span className="text-sm font-medium">Spotify</span>
            </button>
            
            <button
              onClick={() => handleSelectService("apple")}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mb-2">
                <Apple size={24} color="white" />
              </div>
              <span className="text-sm font-medium">Apple Music</span>
            </button>
            
            <button
              onClick={() => handleSelectService("other")}
              className="flex flex-col items-center justify-center p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center mb-2">
                <Music size={24} color="white" />
              </div>
              <span className="text-sm font-medium">Other</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}