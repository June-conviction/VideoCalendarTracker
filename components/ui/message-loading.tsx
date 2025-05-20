"use client"

import { cn } from "@/lib/utils"

export function MessageLoading({ className }: { className?: string }) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0.2s]"></div>
      <div className="h-2 w-2 animate-bounce rounded-full bg-current [animation-delay:0.4s]"></div>
    </div>
  )
}
