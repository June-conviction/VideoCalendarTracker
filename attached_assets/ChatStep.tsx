"use client"

import React, { useEffect, useRef, useCallback } from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Stepper } from "@/components/Stepper"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Send } from "lucide-react"
import { ChatBubble, ChatBubbleMessage } from "@/components/chat-bubble"

// Helper function to generate UUID
const uuid = () => crypto.randomUUID()

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

// Service Button Component
const ServiceButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="px-4 py-2 border border-white/30 rounded-full text-white hover:bg-white/10 transition-colors"
  >
    {label}
  </button>
)

// URL Form component
const UrlForm = ({ onSubmit }: { onSubmit: (url: string) => void }) => {
  const [playlistUrl, setPlaylistUrl] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!playlistUrl.trim()) return
    onSubmit(playlistUrl)
    setPlaylistUrl("")
  }

  const handleFocus = () => {
    window.scrollTo(0, document.body.scrollHeight)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed inset-x-0 bottom-[calc(env(safe-area-inset-bottom,24px)+40px)] flex justify-center"
      style={{ "--input-h": "128px" } as React.CSSProperties}
    >
      <div className="flex w-full max-w-xl gap-2 px-4 md:px-6">
        <input
          type="text"
          value={playlistUrl}
          onChange={(e) => setPlaylistUrl(e.target.value)}
          placeholder="Place your playlist url here."
          className="flex-1 h-12 rounded-xl px-4 bg-white text-black"
          onFocus={handleFocus}
        />
        <button type="submit" className="w-12 h-12 rounded-full bg-[#007AFF] flex items-center justify-center">
          <Send className="h-5 w-5 text-white" />
        </button>
      </div>
    </form>
  )
}

export function ChatStep({ onSelect, onBack }: ChatStepProps) {
  const [selectedService, setSelectedService] = useState<"spotify" | "apple" | "other" | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const chatRef = useRef<HTMLDivElement>(null)

  // State for message queue, messages, and pending UI elements
  const [queue, setQueue] = useState<Message[]>([
    { id: uuid(), role: "bot", text: "Hi I'm linkPlaylist. Chat to me and express yourself through your playlist." },
    { id: uuid(), role: "bot", text: "What music streaming service are you on?" },
  ])
  const [messages, setMessages] = useState<Message[]>([])
  const [pendingUI, setPendingUI] = useState<"serviceButtons" | "urlInput" | null>(null)

  // Process queue - dequeue exactly ONE message at a time
  useEffect(() => {
    if (queue.length === 0 || messages.some((m) => m.typing)) return
    const [next, ...rest] = queue
    setMessages((m) => [...m, { ...next, typing: true }])
    setQueue(rest)
  }, [queue, messages])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, pendingUI])

  // Handle typing completion
  const handleTypingDone = useCallback((text: string) => {
    setMessages((m) => {
      const last = { ...m.at(-1)!, typing: false }
      return [...m.slice(0, -1), last]
    })

    /* 1) Show service buttons after second message */
    if (text.startsWith("What music")) {
      setPendingUI("serviceButtons")
    }

    /* 2) Show URL input form after "Alrighty" message */
    if (text.startsWith("Alrighty")) {
      setTimeout(() => setPendingUI("urlInput"), 400)
    }
  }, [])

  // Handle service selection
  const handleService = (label: string) => {
    let service: "spotify" | "apple" | "other"

    if (label === "Spotify") {
      service = "spotify"
    } else if (label === "Apple Music") {
      service = "apple"
    } else {
      service = "other"
    }

    setSelectedService(service)

    // Add user message
    setMessages((m) => [...m, { id: uuid(), role: "user", text: label }])

    // Queue bot responses based on service
    if (service === "other") {
      setQueue((q) => [
        ...q,
        { id: uuid(), role: "bot", text: "I'm all about music, but for now we only support Apple Music and Spotify." },
        {
          id: uuid(),
          role: "bot",
          text: "If you'd like us to support your service too, double-tap this message and drop a like 💙",
          likeable: true,
        },
      ])
    } else {
      setQueue((q) => [...q, { id: uuid(), role: "bot", text: "Alrighty. Wanna share one of your playlist with us?" }])
    }

    // Hide buttons immediately
    setPendingUI(null)

    // Call the parent handler
    onSelect(service)
  }

  // Handle playlist submission
  const handleSubmitPlaylist = (url: string) => {
    // Add user message with playlist URL
    setMessages((m) => [...m, { id: uuid(), role: "user", text: url }])

    // Queue bot response
    setQueue((q) => [...q, { id: uuid(), role: "bot", text: "Thanks for sharing your playlist! We'll check it out." }])

    // Hide URL form
    setPendingUI(null)
  }

  // Group messages by role for speech tail logic
  const groupedMessages = messages.reduce((acc, message, index) => {
    const prevMessage = messages[index - 1]

    if (!prevMessage || prevMessage.role !== message.role) {
      acc.push([message])
    } else {
      acc[acc.length - 1].push(message)
    }

    return acc
  }, [] as Message[][])

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      {/* Stepper - now showing as step 2 */}
      <Stepper value={2} defaultValue={2} />

      <div className="w-full">
        {/* Back button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }} style={{ marginBottom: "1rem" }}>
          <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/10 pl-2" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to iPod
          </Button>
        </motion.div>

        {/* Chat messages */}
        <div
          ref={chatRef}
          className="flex flex-col gap-4 overflow-y-auto px-4 md:px-6 pt-4"
          style={{ paddingBottom: "var(--input-h,128px)" }}
        >
          <AnimatePresence initial={false}>
            {groupedMessages.map((group, groupIndex) => (
              <React.Fragment key={`group-${groupIndex}`}>
                {group.map((message, messageIndex) => (
                  <motion.div
                    key={`${message.id}-${messageIndex}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChatBubble variant={message.role === "user" ? "sent" : "received"}>
                      <ChatBubbleMessage
                        id={message.id}
                        variant={message.role === "user" ? "sent" : "received"}
                        likeable={message.likeable}
                        isLast={messageIndex === group.length - 1}
                        isTyping={message.typing}
                        onTypingDone={handleTypingDone}
                      >
                        {message.text}
                      </ChatBubbleMessage>
                    </ChatBubble>
                  </motion.div>
                ))}
              </React.Fragment>
            ))}
          </AnimatePresence>

          {/* Service selection buttons - only shown after second bot message */}
          {pendingUI === "serviceButtons" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{ 
                display: "flex", 
                gap: "0.75rem", 
                alignSelf: "flex-end", 
                marginTop: "0.5rem", 
                justifyContent: "flex-end" 
              }}
            >
              <ServiceButton label="Spotify" onClick={() => handleService("Spotify")} />
              <ServiceButton label="Apple Music" onClick={() => handleService("Apple Music")} />
              <ServiceButton label="Others" onClick={() => handleService("Others")} />
            </motion.div>
          )}

          {/* Auto-scroll reference div */}
          <div ref={bottomRef}></div>
        </div>
      </div>

      {/* URL input form - only shown after "Alrighty" message */}
      {pendingUI === "urlInput" && <UrlForm onSubmit={handleSubmitPlaylist} />}
    </div>
  )
}
