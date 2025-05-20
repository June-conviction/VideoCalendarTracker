"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
    { color: "red", src: "/images/ipod-red.png", alt: "Red iPod nano" },
    { color: "yellow", src: "/images/ipod-yellow.png", alt: "Yellow iPod nano" },
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
      <motion.h1 
        className="text-3xl font-semibold mb-12 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Choose your iPod color
      </motion.h1>

      {/* Color Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 w-full max-w-4xl mx-auto"
      >
        {ipods.map((ipod, index) => (
          <motion.div
            key={ipod.color}
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: hideOthers && selected !== ipod.color ? 0 : 1,
              y: 0,
              scale: selected === ipod.color ? 1.1 : 1,
            }}
            transition={{ 
              duration: 0.4, 
              delay: 0.1 * index,
              ease: "easeOut" 
            }}
            className="flex flex-col items-center"
          >
            <motion.div
              whileHover={!selected ? { scale: 1.05, y: -5 } : {}}
              whileTap={!selected ? { scale: 0.98 } : {}}
              onClick={() => !selected && handleSelectIpod(ipod.color)}
              className={`w-full shadow-lg cursor-pointer ${selected === ipod.color ? 'ring-4 ring-blue-500 ring-opacity-70 rounded-lg' : ''}
                transition-all duration-300`}
            >
              <img
                src={ipod.src}
                alt={ipod.alt}
                className="w-full h-auto"
                style={{ maxWidth: "200px" }}
              />
              
              {/* Selected indicator */}
              {selected === ipod.color && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full p-2 z-10"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
              )}
            </motion.div>
            
            <motion.p
              animate={{
                opacity: hideOthers && selected !== ipod.color ? 0 : 1,
              }}
              className="mt-3 capitalize font-medium"
            >
              {ipod.color}
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}