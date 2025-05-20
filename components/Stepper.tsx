"use client"

import { cn } from "@/lib/utils"
import { CheckIcon } from "lucide-react"

interface StepperProps {
  currentStep: number
  className?: string
}

export function Stepper({ currentStep = 1, className }: StepperProps) {
  // Define the steps
  const steps = [
    { id: 1, title: "Pick iPod" },
    { id: 2, title: "Music Service" },
    { id: 3, title: "Playlist" }
  ]

  return (
    <div className={cn("flex w-full justify-center mt-8 mb-12", className)}>
      <div className="relative flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            {/* Step indicator */}
            <div className="relative">
              <div 
                className={cn(
                  "w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors",
                  currentStep > step.id 
                    ? "bg-[#007AFF] text-white"
                    : currentStep === step.id
                      ? "bg-[#007AFF] text-white ring-4 ring-blue-100"
                      : "bg-gray-200 text-gray-500"
                )}
              >
                {currentStep > step.id ? (
                  <CheckIcon className="w-4 h-4" />
                ) : (
                  step.id
                )}
              </div>
              
              {/* Step title */}
              <span 
                className={cn(
                  "absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap",
                  currentStep >= step.id ? "text-[#007AFF] font-medium" : "text-gray-500"
                )}
              >
                {step.title}
              </span>
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div 
                className={cn(
                  "w-12 h-0.5 mx-1",
                  currentStep > step.id + 1 
                    ? "bg-[#007AFF]" 
                    : "bg-gray-200"
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}