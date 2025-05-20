"use client"

import { motion } from "framer-motion"

interface StepperProps {
  currentStep: number
  className?: string
}

export function Stepper({ currentStep = 1, className }: StepperProps) {
  const steps = [
    { id: 1, label: "Select iPod" },
    { id: 2, label: "Choose Service" },
    { id: 3, label: "Add Playlist" }
  ]

  return (
    <div className={`w-full max-w-md mx-auto px-4 ${className || ""}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center">
            {/* Step circle */}
            <motion.div
              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 
              ${currentStep >= step.id ? "border-blue-500 bg-blue-500 text-white" : "border-gray-300 text-gray-400"}`}
              animate={{
                scale: currentStep === step.id ? [1, 1.1, 1] : 1,
                backgroundColor: currentStep >= step.id ? "#3b82f6" : "transparent"
              }}
              transition={{ duration: 0.3 }}
            >
              {currentStep > step.id ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <span>{step.id}</span>
              )}
            </motion.div>

            {/* Step label */}
            <span
              className={`hidden sm:block ml-2 text-sm ${
                currentStep >= step.id ? "text-blue-500 font-medium" : "text-gray-400"
              }`}
            >
              {step.label}
            </span>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={`flex-grow h-0.5 mx-4 ${
                  currentStep > i + 1 ? "bg-blue-500" : "bg-gray-300"
                }`}
              ></div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}