"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { MessageLoading } from "@/components/ui/message-loading"
import { Heart } from "lucide-react"
import { motion } from "framer-motion"

// Fixed color constants
const BOT_BG = "#E6E5EB"
const USER_BG = "#007AFF"

interface ChatBubbleProps {
  variant?: "sent" | "received"
  layout?: "default" | "ai"
  className?: string
  children: React.ReactNode
  isLast?: boolean
}

export function ChatBubble({
  variant = "received",
  layout = "default",
  className,
  children,
  isLast = false,
}: ChatBubbleProps) {
  return (
    <div className={cn("flex items-start gap-2 mb-4", variant === "sent" && "flex-row-reverse", className)}>
      {children}
    </div>
  )
}

const Tail = ({ variant = "received" }) => (
  <div
    className={cn(
      "absolute w-0 h-0 border-t-[10px] border-t-transparent bottom-0",
      variant === "sent"
        ? `right-[-10px] border-l-[10px] border-l-[${USER_BG}]`
        : `left-[-10px] border-r-[10px] border-r-[${BOT_BG}]`,
    )}
  />
)

export const Typing = ({ text, onDone }: { text: string; onDone?: () => void }) => {
  const [chunk, setChunk] = useState("")

  useEffect(() => {
    let i = 0
    const speed = Math.max(15, 250 / text.length)

    const id = setInterval(() => {
      setChunk(text.slice(0, ++i))
      if (i >= text.length) {
        clearInterval(id)
        if (onDone) setTimeout(() => onDone(), 100)
      }
    }, speed)

    return () => clearInterval(id)
  }, [text, onDone])

  return <>{chunk}</>
}

interface ChatBubbleMessageProps {
  variant?: "sent" | "received"
  isLoading?: boolean
  isTyping?: boolean
  className?: string
  children?: React.ReactNode
  likeable?: boolean
  isLast?: boolean
  onTypingDone?: (text: string) => void
  id?: string
}

export function ChatBubbleMessage({
  variant = "received",
  isLoading,
  isTyping,
  className,
  children,
  likeable = false,
  isLast = false,
  onTypingDone,
  id,
}: ChatBubbleMessageProps) {
  const [liked, setLiked] = React.useState(false)
  const [taps, setTaps] = React.useState(0)

  const handleTap = () => {
    if (likeable) {
      setTaps((prev) => {
        const newTaps = prev + 1
        if (newTaps === 2) {
          setLiked(true)
          setTimeout(() => setTaps(0), 300)
        }
        return newTaps
      })

      // Reset tap count after a delay
      setTimeout(() => {
        setTaps(0)
      }, 500)
    }
  }

  const handleTypingComplete = () => {
    if (onTypingDone && typeof children === "string") {
      onTypingDone(children)
    }
  }

  return (
    <motion.div
      className={cn(
        "rounded-lg p-3",
        variant === "sent" ? `bg-[${USER_BG}] text-white font-medium` : `bg-[${BOT_BG}] text-black`,
        likeable && "cursor-pointer",
        className,
      )}
      onClick={handleTap}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        <div className="relative overflow-visible">
          {isTyping ? <Typing key={id} text={children as string} onDone={handleTypingComplete} /> : children}
          {isLast && <Tail variant={variant} />}
          {likeable && liked && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
            >
              <Heart size={12} fill="white" />
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  )
}

interface ChatBubbleActionProps {
  icon?: React.ReactNode
  onClick?: () => void
  className?: string
}

export function ChatBubbleAction({ icon, onClick, className }: ChatBubbleActionProps) {
  return (
    <Button variant="ghost" size="icon" className={cn("h-6 w-6", className)} onClick={onClick}>
      {icon}
    </Button>
  )
}

export function ChatBubbleActionWrapper({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return <div className={cn("flex items-center gap-1 mt-2", className)}>{children}</div>
}
