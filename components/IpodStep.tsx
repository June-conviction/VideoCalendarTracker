"use client"

import { useState } from "react"
import Image from "next/image"
import { Stepper } from "./Stepper"

interface IpodStepProps {
  onSelect: (color: string) => void
  selectedColor: string | null
}

export function IpodStep({ onSelect, selectedColor }: IpodStepProps) {
  const [hoveredIpod, setHoveredIpod] = useState<string | null>(null)
  
  const ipodOptions = [
    { id: "black", name: "Black" },
    { id: "silver", name: "Silver" },
    { id: "blue", name: "Blue" },
    { id: "red", name: "Red" },
    { id: "yellow", name: "Yellow" }
  ]

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Stepper */}
      <Stepper currentStep={1} />
      
      {/* Title */}
      <h2 className="mt-8 text-2xl md:text-3xl font-bold text-center text-white">
        Choose Your iPod
      </h2>
      <p className="mt-2 text-gray-400 text-center max-w-md">
        Select your favorite color for a personalized browsing experience
      </p>
      
      {/* iPod options */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-4xl">
        {ipodOptions.map((ipod) => (
          <div
            key={ipod.id}
            className="flex flex-col items-center"
          >
            <button
              className={`relative p-1 rounded-lg overflow-hidden transition-all duration-200 
                ${hoveredIpod === ipod.id || selectedColor === ipod.id 
                  ? 'ring-4 ring-opacity-70 scale-105' 
                  : 'scale-100'}`}
              style={{
                ringColor: ipod.id === 'blue' ? '#4299e1' 
                  : ipod.id === 'red' ? '#f56565' 
                  : ipod.id === 'black' ? '#2d3748' 
                  : ipod.id === 'yellow' ? '#ecc94b' 
                  : '#a0aec0'
              }}
              onClick={() => onSelect(ipod.id)}
              onMouseEnter={() => setHoveredIpod(ipod.id)}
              onMouseLeave={() => setHoveredIpod(null)}
            >
              <Image 
                src={`/images/ipod-${ipod.id}.png`}
                alt={`${ipod.name} iPod Nano`}
                width={200}
                height={300}
                className="w-full h-auto"
              />
              
              {/* Overlay for selected/hovered state */}
              {(hoveredIpod === ipod.id || selectedColor === ipod.id) && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              )}
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
    </div>
  )
}