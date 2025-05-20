"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Stepper, StepperItem, StepperTrigger, StepperIndicator, StepperSeparator } from "@/components/stepper"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import React from "react"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full text-white" viewBox="0 0 696 316" fill="none">
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

function StepOne() {
  const { setActiveStep, setCompletedStep } = useStepper()
  const [animationStage, setAnimationStage] = useState(0)
  const [selectedIpod, setSelectedIpod] = useState<string | null>(null)
  const [hoveredIpod, setHoveredIpod] = useState<string | null>(null)
  const [selectionComplete, setSelectionComplete] = useState(false)

  useEffect(() => {
    // Start the animation sequence with smoother timing
    const timer1 = setTimeout(() => setAnimationStage(1), 2500) // Move hello up after 2.5s
    const timer2 = setTimeout(() => setAnimationStage(2), 3500) // Show iPods after 3.5s

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  const ipods = [
    { name: "Black", src: "/images/ipod-black.png", alt: "Black iPod nano" },
    { name: "Silver", src: "/images/ipod-silver.png", alt: "Silver iPod nano" },
    { name: "Blue", src: "/images/ipod-blue.png", alt: "Blue iPod nano" },
    { name: "Yellow", src: "/images/ipod-yellow.png", alt: "Yellow iPod nano" },
    { name: "Red", src: "/images/ipod-red.png", alt: "Red iPod nano" },
  ]

  const handleSelectIpod = (name: string) => {
    setSelectedIpod(name)

    // First animate the iPod to center, then proceed to next step
    setTimeout(() => {
      setSelectionComplete(true)

      // Mark step as completed and move to next step after the animation completes
      setTimeout(() => {
        setCompletedStep(0) // Mark first step as completed
        setActiveStep(1) // Move to second step
      }, 1500)
    }, 300)
  }

  return (
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-center">
      {/* Hello Animation */}
      <AnimatePresence mode="wait">
        {animationStage < 2 && (
          <div className="fixed inset-0 flex items-center justify-center z-10">
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={animationStage === 0 ? { y: 0, opacity: 1 } : { y: -300, opacity: 0 }}
              exit={{ y: -500, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: animationStage === 0 ? 1 : 1.5,
              }}
              className="w-full max-w-xl"
            >
              <Image src="/images/hello.png" alt="Hello" width={1200} height={400} className="w-full h-auto" priority />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* iPod Selection */}
      <AnimatePresence>
        {animationStage === 2 && (
          <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            {/* "Pick your iPod Nano" text */}
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-16 sm:mb-20 md:mb-24"
            >
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Pick your{" "}
                <span className="bg-gradient-to-r from-green-400 via-yellow-400 to-blue-500 text-transparent bg-clip-text">
                  iPod Nano
                </span>
              </h1>
            </motion.div>

            {/* iPod devices - Desktop layout */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="hidden md:flex justify-center gap-6 w-full"
            >
              {ipods.map((ipod, index) => (
                <motion.div
                  key={`desktop-${ipod.name}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={
                    selectionComplete && selectedIpod === ipod.name
                      ? {
                          position: "fixed",
                          top: "50%",
                          left: "50%",
                          x: "-50%",
                          y: "-50%",
                          scale: 1.5,
                          zIndex: 50,
                          opacity: 1,
                        }
                      : selectionComplete && selectedIpod !== ipod.name
                        ? { opacity: 0, y: 50 }
                        : { opacity: 1, y: 0 }
                  }
                  transition={{
                    duration: selectionComplete ? 0.8 : 0.5,
                    delay: selectionComplete ? 0 : 0.3 + index * 0.15,
                    type: "spring",
                    stiffness: 100,
                    damping: selectionComplete ? 25 : 10,
                  }}
                  whileHover={
                    !selectionComplete
                      ? {
                          scale: 1.05,
                          y: -10,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 10,
                            duration: 0.2,
                          },
                        }
                      : {}
                  }
                  whileTap={!selectionComplete ? { scale: 0.95 } : {}}
                  onHoverStart={() => !selectionComplete && setHoveredIpod(ipod.name)}
                  onHoverEnd={() => !selectionComplete && setHoveredIpod(null)}
                  onClick={() => !selectionComplete && handleSelectIpod(ipod.name)}
                  className="cursor-pointer"
                >
                  <div
                    className={`${
                      selectionComplete && selectedIpod === ipod.name ? "w-64" : "w-40"
                    } relative transition-all duration-500`}
                  >
                    <motion.div
                      initial={{ scale: 1 }}
                      animate={{
                        scale: !selectionComplete && hoveredIpod === ipod.name ? [1, 1.02, 1] : 1,
                        y: !selectionComplete && hoveredIpod === ipod.name ? [0, -2, 0] : 0,
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: !selectionComplete && hoveredIpod === ipod.name ? Number.POSITIVE_INFINITY : 0,
                        repeatType: "reverse",
                      }}
                    >
                      <Image
                        src={ipod.src || "/placeholder.svg"}
                        alt={ipod.alt}
                        width={300}
                        height={600}
                        className={`w-full h-auto transition-all duration-200 ${
                          selectedIpod === ipod.name && !selectionComplete ? "ring-4 ring-blue-500 rounded-lg" : ""
                        }`}
                      />
                    </motion.div>
                    {!selectionComplete && (
                      <motion.p
                        className="text-white mt-4 font-medium text-center text-lg"
                        animate={{
                          scale: hoveredIpod === ipod.name ? 1.1 : 1,
                          color: hoveredIpod === ipod.name ? "#ffffff" : "#cccccc",
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {ipod.name}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* iPod devices - Mobile layout (3 on top, 2 on bottom) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="md:hidden flex flex-col items-center w-full"
            >
              {/* Top row - 3 iPods */}
              <div className="flex justify-center gap-4 mb-6">
                {ipods.slice(0, 3).map((ipod, index) => (
                  <motion.div
                    key={`mobile-top-${ipod.name}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={
                      selectionComplete && selectedIpod === ipod.name
                        ? {
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            x: "-50%",
                            y: "-50%",
                            scale: 1.5,
                            zIndex: 50,
                            opacity: 1,
                          }
                        : selectionComplete && selectedIpod !== ipod.name
                          ? { opacity: 0, y: 50 }
                          : { opacity: 1, y: 0 }
                    }
                    transition={{
                      duration: selectionComplete ? 0.8 : 0.5,
                      delay: selectionComplete ? 0 : 0.3 + index * 0.15,
                      type: "spring",
                      stiffness: 100,
                      damping: selectionComplete ? 25 : 10,
                    }}
                    whileTap={!selectionComplete ? { scale: 0.95 } : {}}
                    onClick={() => !selectionComplete && handleSelectIpod(ipod.name)}
                    className="cursor-pointer"
                  >
                    <div className="w-28 relative transition-all duration-500">
                      <Image
                        src={ipod.src || "/placeholder.svg"}
                        alt={ipod.alt}
                        width={300}
                        height={600}
                        className={`w-full h-auto transition-all duration-200 ${
                          selectedIpod === ipod.name && !selectionComplete ? "ring-4 ring-blue-500 rounded-lg" : ""
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Bottom row - 2 iPods */}
              <div className="flex justify-center gap-4">
                {ipods.slice(3, 5).map((ipod, index) => (
                  <motion.div
                    key={`mobile-bottom-${ipod.name}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={
                      selectionComplete && selectedIpod === ipod.name
                        ? {
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            x: "-50%",
                            y: "-50%",
                            scale: 1.5,
                            zIndex: 50,
                            opacity: 1,
                          }
                        : selectionComplete && selectedIpod !== ipod.name
                          ? { opacity: 0, y: 50 }
                          : { opacity: 1, y: 0 }
                    }
                    transition={{
                      duration: selectionComplete ? 0.8 : 0.5,
                      delay: selectionComplete ? 0 : 0.3 + (index + 3) * 0.15,
                      type: "spring",
                      stiffness: 100,
                      damping: selectionComplete ? 25 : 10,
                    }}
                    whileTap={!selectionComplete ? { scale: 0.95 } : {}}
                    onClick={() => !selectionComplete && handleSelectIpod(ipod.name)}
                    className="cursor-pointer"
                  >
                    <div className="w-28 relative transition-all duration-500">
                      <Image
                        src={ipod.src || "/placeholder.svg"}
                        alt={ipod.alt}
                        width={300}
                        height={600}
                        className={`w-full h-auto transition-all duration-200 ${
                          selectedIpod === ipod.name && !selectionComplete ? "ring-4 ring-blue-500 rounded-lg" : ""
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StepTwo() {
  const { setActiveStep, setCompletedStep } = useStepper()
  const [formComplete, setFormComplete] = useState(false)

  // Simulate form completion
  const handleComplete = () => {
    setFormComplete(true)
    setCompletedStep(1) // Mark second step as completed
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-bold text-white">Step 2: Your Music Preferences</h2>
      <p className="text-white/80 text-center">
        This is a placeholder for step 2 content. You can customize this with your specific requirements.
      </p>
      <Button onClick={handleComplete} className="mt-4" disabled={formComplete}>
        {formComplete ? "Completed" : "Complete Step 2"}
      </Button>
    </div>
  )
}

function StepThree() {
  const { setActiveStep, setCompletedStep } = useStepper()
  const [formComplete, setFormComplete] = useState(false)

  // Simulate form completion
  const handleComplete = () => {
    setFormComplete(true)
    setCompletedStep(2) // Mark third step as completed
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-bold text-white">Step 3: Additional Information</h2>
      <p className="text-white/80 text-center">
        This is a placeholder for step 3 content. You can customize this with your specific requirements.
      </p>
      <Button onClick={handleComplete} className="mt-4" disabled={formComplete}>
        {formComplete ? "Completed" : "Complete Step 3"}
      </Button>
    </div>
  )
}

function StepFour() {
  const [formComplete, setFormComplete] = useState(false)

  // Simulate form completion
  const handleComplete = () => {
    setFormComplete(true)
    // Final step completion
    alert("All steps completed! Process finished.")
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center justify-center space-y-6">
      <h2 className="text-2xl font-bold text-white">Step 4: Final Step</h2>
      <p className="text-white/80 text-center">
        This is a placeholder for step 4 content. You can customize this with your specific requirements.
      </p>
      <Button onClick={handleComplete} className="mt-4" disabled={formComplete}>
        {formComplete ? "Completed" : "Complete Setup"}
      </Button>
    </div>
  )
}

export function IPodSelection() {
  const [animationStage, setAnimationStage] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    // Start the animation sequence
    const timer = setTimeout(() => setAnimationStage(1), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Function to mark a step as completed
  const setCompletedStep = (step: number) => {
    setCompletedSteps((prev) => {
      const newSet = new Set(prev)
      newSet.add(step)
      return newSet
    })
  }

  // Function to check if a step can be accessed
  const canAccessStep = (step: number): boolean => {
    // Can always access step 0
    if (step === 0) return true

    // For other steps, all previous steps must be completed
    for (let i = 0; i < step; i++) {
      if (!completedSteps.has(i)) return false
    }

    return true
  }

  // Function to navigate to a step
  const navigateToStep = (step: number) => {
    if (canAccessStep(step)) {
      setActiveStep(step)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      <div className="absolute inset-0">
        <FloatingPaths position={1} />
        <FloatingPaths position={-1} />
      </div>

      <div className="relative z-10 container mx-auto px-4 md:px-6 text-center flex flex-col items-center justify-center min-h-screen py-12">
        <AnimatePresence mode="wait">
          {animationStage > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full"
            >
              <div className="flex justify-center mb-12">
                <Stepper className="w-auto max-w-xs" value={activeStep} onValueChange={navigateToStep}>
                  {Array.from({ length: 4 }).map((_, i) => (
                    <StepperItem key={i} step={i} completed={completedSteps.has(i)} disabled={!canAccessStep(i)}>
                      <StepperTrigger>
                        <StepperIndicator />
                      </StepperTrigger>
                      {i < 3 && <StepperSeparator />}
                    </StepperItem>
                  ))}
                </Stepper>
              </div>

              {/* Navigation buttons */}
              <div className="flex justify-center space-x-4 mb-8">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToStep(activeStep - 1)}
                  disabled={activeStep === 0}
                  className="bg-black text-white border-white/20 hover:bg-white/10"
                >
                  <ChevronLeft className="mr-1 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToStep(activeStep + 1)}
                  disabled={!canAccessStep(activeStep + 1)}
                  className="bg-black text-white border-white/20 hover:bg-white/10"
                >
                  Next
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>

              <AnimatePresence mode="wait">
                {/* Step content will be rendered here */}
                <StepContent
                  activeStep={activeStep}
                  setActiveStep={setActiveStep}
                  completedSteps={completedSteps}
                  setCompletedStep={setCompletedStep}
                />
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface StepContentProps {
  activeStep: number
  setActiveStep: (step: number) => void
  completedSteps: Set<number>
  setCompletedStep: (step: number) => void
}

function StepContent({ activeStep, setActiveStep, completedSteps, setCompletedStep }: StepContentProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <StepperProvider
          value={{
            activeStep,
            setActiveStep,
            orientation: "horizontal",
            completedSteps,
            setCompletedStep,
          }}
        >
          {activeStep === 0 && <StepOne />}
          {activeStep === 1 && <StepTwo />}
          {activeStep === 2 && <StepThree />}
          {activeStep === 3 && <StepFour />}
        </StepperProvider>
      </motion.div>
    </AnimatePresence>
  )
}

// Create a context provider for the stepper
const StepperProvider = ({ children, value }: { children: React.ReactNode; value: any }) => {
  return <StepperContext.Provider value={value}>{children}</StepperContext.Provider>
}

// Create a context for the stepper
const StepperContext = React.createContext<
  | {
      activeStep: number
      setActiveStep: (step: number) => void
      orientation: "horizontal" | "vertical"
      completedSteps: Set<number>
      setCompletedStep: (step: number) => void
    }
  | undefined
>(undefined)

// Hook to use the stepper context
const useStepperContext = () => {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error("useStepper must be used within a StepperProvider")
  }
  return context
}

export const useStepper = useStepperContext
