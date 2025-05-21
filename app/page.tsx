"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to the first page in our flow
    router.push("/hello")
  }, [router])

  return (
    <>
      <Head>
        <title>LinkPlaylist - Share Music Your Way</title>
        <meta name="description" content="Transform your music playlists into customized iPod-style experiences. Share Spotify and Apple Music playlists with a retro twist." />
        <meta property="og:title" content="LinkPlaylist - Music Sharing Reimagined" />
        <meta property="og:description" content="Share your favorite playlists with a nostalgic iPod interface. Perfect for music lovers who want to stand out." />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/link-playlist-social.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse mb-4">
            <h1 className="text-white text-2xl font-bold">LinkPlaylist</h1>
          </div>
          <p className="text-gray-400 text-sm">Loading your music experience...</p>
        </div>
      </div>
    </>
  )
}