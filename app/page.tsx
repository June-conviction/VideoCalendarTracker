"use client"

import { useState, useEffect } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { HelloSplash } from "@/components/HelloSplash"
import { IpodStep } from "@/components/IpodStep"
import { ChatStep } from "@/components/ChatStep"

export default function Home() {
  const [step, setStep] = useState<"hello" | "select" | "chat">("hello")
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<"spotify" | "apple" | "other" | null>(null)

  // Ensure the viewport is properly set for mobile devices
  useEffect(() => {
    // Force scroll to bottom when chat step is active
    if (step === "chat") {
      setTimeout(() => window.scrollTo(0, document.body.scrollHeight), 100)
    }
  }, [step])

  const handleSplashFinished = () => {
    setStep("select")
  }

  const handleIpodSelect = (color: string) => {
    setSelectedColor(color)
    setTimeout(() => setStep("chat"), 400)
  }

  const handleServiceSelect = (service: "spotify" | "apple" | "other") => {
    setSelectedService(service)
    // No transition to another step after service selection
  }

  const handleBackToIpod = () => {
    setSelectedColor(null)
    setStep("select")
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <AnimatePresence mode="wait">
        {step === "hello" && (
          <motion.div
            key="hello"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full"
          >
            <HelloSplash onFinished={handleSplashFinished} />
          </motion.div>
        )}

        {step === "select" && (
          <motion.div
            key="select"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl px-4 py-8"
          >
            <IpodStep onSelect={handleIpodSelect} selectedColor={selectedColor} />
          </motion.div>
        )}

        {step === "chat" && (
          <motion.div
            key="chat"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-6xl px-4 py-8 min-h-screen"
          >
            <ChatStep onSelect={handleServiceSelect} onBack={handleBackToIpod} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
