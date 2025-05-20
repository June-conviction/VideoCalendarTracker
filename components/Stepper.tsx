"use client"

import { cn } from "@/lib/utils"

interface StepperProps {
  currentStep: number
  className?: string
}

export function Stepper({ currentStep = 1, className }: StepperProps) {
  return (
    <div className={cn("flex items-center justify-center space-x-2 mb-8", className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-2.5 h-2.5 rounded-full transition-all duration-300",
            index + 1 === currentStep ? "bg-white scale-125" : "bg-white/30",
          )}
        />
      ))}
    </div>
  )
}
