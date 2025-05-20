"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import Image from "next/image"

interface GoogleLoginModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function GoogleLoginModal({ isOpen, onClose, onSuccess }: GoogleLoginModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  
  const handleGoogleLogin = () => {
    setIsLoading(true)
    
    // Simulate authentication process
    setTimeout(() => {
      // Store mock auth data in localStorage
      localStorage.setItem('user', JSON.stringify({
        id: 'user-123',
        name: 'John Doe',
        email: 'johndoe@example.com',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80',
        isAuthenticated: true
      }))
      
      setIsLoading(false)
      onSuccess()
    }, 1500)
  }
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Continue with Google</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                To save your playlist and create your page
              </p>
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 relative overflow-hidden">
                <Image 
                  src="/images/iPod black new version.png" 
                  alt="Your iPod" 
                  width={64} 
                  height={64} 
                  className="object-contain"
                />
              </div>
            </div>
            
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Your taste, playlist deserves more audience.
            </p>
            
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-md py-3 px-4 hover:bg-gray-50 transition-colors disabled:opacity-70"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_1_2)">
                      <path d="M19.999 10.2217C20.0111 9.53428 19.934 8.84788 19.8169 8.17737H10.2041V11.8884H15.8276C15.7211 12.5391 15.4814 13.162 15.1229 13.7195C14.7644 14.2771 14.2946 14.7578 13.7416 15.1328L13.722 15.257L16.7512 17.5567L16.9609 17.5772C18.8883 15.8328 19.9996 13.266 19.9996 10.2217" fill="#4285F4" />
                      <path d="M10.2042 19.9999C12.9593 19.9999 15.2724 19.111 16.9609 17.5772L13.7416 15.1331C12.8808 15.7221 11.7239 16.1333 10.2042 16.1333C8.91385 16.126 7.65863 15.7206 6.61663 14.9747C5.57464 14.2287 4.79879 13.1802 4.39915 11.9778L4.27957 11.9878L1.12973 14.3766L1.08856 14.4888C1.93689 16.1457 3.23879 17.5387 4.84869 18.512C6.45859 19.4852 8.31301 20.001 10.2046 19.9999" fill="#34A853" />
                      <path d="M4.39911 11.9777C4.17592 11.3411 4.06075 10.673 4.05819 9.99996C4.0623 9.32799 4.18026 8.66075 4.40686 8.02225L4.40115 7.8961L1.19269 5.4834L1.0884 5.51303C0.372762 6.90341 0 8.43716 0 9.99987C0 11.5626 0.372762 13.0964 1.0884 14.4868L4.39911 11.9777Z" fill="#FBBC05" />
                      <path d="M10.2042 3.86663C11.6663 3.84438 13.0804 4.37803 14.1498 5.35558L17.0296 2.59996C15.1824 0.901848 12.7344 -0.0298855 10.2042 -3.6784e-05C8.3126 -0.000477834 6.45819 0.514732 4.8483 1.48798C3.2384 2.46124 1.93649 3.85416 1.08813 5.51101L4.3994 8.02225C4.79883 6.82005 5.57467 5.77151 6.61666 5.02552C7.65866 4.27953 8.91387 3.87391 10.2042 3.86663Z" fill="#EB4335" />
                    </g>
                    <defs>
                      <clipPath id="clip0_1_2">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="text-gray-700 font-medium">Continue with Google</span>
                </>
              )}
            </button>
            
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}