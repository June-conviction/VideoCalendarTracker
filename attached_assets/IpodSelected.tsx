"use client"

import { useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { Stepper } from "./Stepper"

interface IpodSelectedProps {
  color: string
  onFinished: () => void
}

export function IpodSelected({ color, onFinished }: IpodSelectedProps) {
  // Auto-transition after 1.2 seconds
  useEffect(() => {
    const timer = setTimeout(onFinished, 1200)
    return () => clearTimeout(timer)
  }, [onFinished])

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[60vh]">
      {/* Stepper - still step 1 */}
      <Stepper currentStep={1} />

      {/* Selected iPod */}
      <div className="flex items-center justify-center w-full my-8">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20,
          }}
          className="p-1 border-4 border-[#659FF1] rounded-lg shadow-[0_0_18px_rgba(101,159,241,0.5)] w-40 sm:w-56"
        >
          <Image
            src={`/images/ipod-${color}.png`}
            alt={`${color} iPod Nano`}
            width={300}
            height={600}
            className="w-full h-auto"
            priority
          />
        </motion.div>
      </div>
    </div>
  )
}
