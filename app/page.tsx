"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the first page in our flow
    router.push("/hello")
  }, [router])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="animate-pulse">
        <h1 className="text-white text-xl">Loading LinkPlaylist...</h1>
      </div>
    </div>
  )
}