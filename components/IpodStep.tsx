"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Stepper } from "./Stepper"

interface IpodStepProps {
  onSelect: (color: string) => void
  selectedColor: string | null
}

export function IpodStep({ onSelect, selectedColor }: IpodStepProps) {
  const [selected, setSelected] = useState<string | null>(selectedColor)
  const [hideOthers, setHideOthers] = useState(false)

  // Reset selected state when selectedColor changes (for back button)
  useEffect(() => {
    setSelected(selectedColor)
    setHideOthers(!!selectedColor)
  }, [selectedColor])

  const ipods = [
    { color: "black", src: "/images/ipod-black.png", alt: "Black iPod nano" },
    { color: "silver", src: "/images/ipod-silver.png", alt: "Silver iPod nano" },
    { color: "blue", src: "/images/ipod-blue.png", alt: "Blue iPod nano" },
    { color: "yellow", src: "/images/ipod-yellow.png", alt: "Yellow iPod nano" },
    { color: "red", src: "/images/ipod-red.png", alt: "Red iPod nano" },
  ]

  // Handle iPod selection
  const handleSelectIpod = (color: string) => {
    setSelected(color)
    setHideOthers(true)
    onSelect(color)
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Stepper - keeping as step 1 */}
      <Stepper currentStep={1} />

      {/* Heading */}
      <h1 className="text-2xl font-sans mb-12">Pick your iPod Nano</h1>

      {/* iPod Grid - Desktop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="hidden md:flex justify-center items-center gap-6 w-full"
      >
        {ipods.map((ipod) => (
          <div key={ipod.color} className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.08 }}
              animate={{
                scale: selected === ipod.color ? 1.08 : 1,
                borderColor: selected === ipod.color ? "#659FF1" : "transparent",
                boxShadow: selected === ipod.color ? "0 0 12px rgba(101,159,241,.45)" : "none",
                opacity: hideOthers && selected !== ipod.color ? 0 : 1,
              }}
              onClick={() => !selected && handleSelectIpod(ipod.color)}
              className="relative border-4 rounded-lg cursor-pointer"
            >
              {selected === ipod.color && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-20">
                  ✓
                </div>
              )}
              <Image
                src={ipod.src || "/placeholder.svg"}
                alt={ipod.alt}
                width={300}
                height={600}
                className="w-40 sm:w-56 h-auto"
                quality={80}
                loading="lazy"
              />
            </motion.div>
            <motion.p
              animate={{
                opacity: hideOthers && selected !== ipod.color ? 0 : 1,
              }}
              className="mt-4 text-lg text-gray-400"
            >
              {ipod.color.charAt(0).toUpperCase() + ipod.color.slice(1)}
            </motion.p>
          </div>
        ))}
      </motion.div>

      {/* iPod Grid - Mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:hidden gap-4 justify-center">
        {ipods.map((ipod) => (
          <div key={`mobile-${ipod.color}`} className="flex flex-col items-center">
            <motion.div
              whileHover={{ scale: 1.08 }}
              animate={{
                scale: selected === ipod.color ? 1.08 : 1,
                borderColor: selected === ipod.color ? "#659FF1" : "transparent",
                boxShadow: selected === ipod.color ? "0 0 12px rgba(101,159,241,.45)" : "none",
                opacity: hideOthers && selected !== ipod.color ? 0 : 1,
              }}
              onClick={() => !selected && handleSelectIpod(ipod.color)}
              className="relative border-4 rounded-lg cursor-pointer"
            >
              {selected === ipod.color && (
                <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full z-20">
                  ✓
                </div>
              )}
              <Image
                src={ipod.src || "/placeholder.svg"}
                alt={ipod.alt}
                width={300}
                height={600}
                className="w-40 sm:w-56 h-auto"
                quality={80}
                loading="lazy"
              />
            </motion.div>
            <motion.p
              animate={{
                opacity: hideOthers && selected !== ipod.color ? 0 : 1,
              }}
              className="mt-4 text-lg text-gray-400"
            >
              {ipod.color.charAt(0).toUpperCase() + ipod.color.slice(1)}
            </motion.p>
          </div>
        ))}
      </div>
    </div>
  )
}
