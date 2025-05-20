"use client"

import { useState, useEffect } from "react"
import { ProfilePage } from "@/components/ProfilePage"

export default function ProfileRoute() {
  const [userId, setUserId] = useState<string | null>(null)
  const [isOwner, setIsOwner] = useState(false)
  
  useEffect(() => {
    // In a real app, this would check authentication status
    // and determine if the current user is the profile owner
    
    // Mock authentication for demo
    const mockUserId = "user-123"
    setUserId(mockUserId)
    
    // Determine if current user is profile owner
    // This would normally check against the authenticated user's ID
    setIsOwner(true)
  }, [])
  
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="animate-pulse text-white text-xl">Loading profile...</div>
      </div>
    )
  }
  
  return <ProfilePage userId={userId} isOwner={isOwner} />
}