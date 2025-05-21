import { Inter } from "next/font/google"
import "./globals.css"
import type { Metadata, Viewport } from "next"

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', 'sans-serif']
})

// Improved metadata for SEO and social sharing
export const metadata: Metadata = {
  title: "LinkPlaylist - Turn your playlists into iPod experiences",
  description: "Transform your Spotify and Apple Music playlists into nostalgic iPod-style experiences that you can share with friends.",
  keywords: ["music", "playlist", "ipod", "spotify", "apple music", "sharing", "nostalgic", "music player"],
  openGraph: {
    title: "LinkPlaylist - Music Sharing Reimagined",
    description: "Share your favorite playlists with a nostalgic iPod interface. Perfect for music lovers who want to stand out.",
    url: "https://drop.linkplaylist.xyz",
    siteName: "LinkPlaylist",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LinkPlaylist - Music Sharing Reimagined",
    description: "Share your favorite playlists with a nostalgic iPod interface. Perfect for music lovers who want to stand out.",
    creator: "@linkplaylist",
  },
  metadataBase: new URL("https://drop.linkplaylist.xyz"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
}

// Viewport configuration for better mobile experience
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' }
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Preconnect to external domains for faster loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  )
}