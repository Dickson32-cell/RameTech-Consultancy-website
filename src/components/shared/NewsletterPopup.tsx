'use client'

import { useState, useEffect } from 'react'
import { FaTimes, FaEnvelope } from 'react-icons/fa'

export default function NewsletterPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    // Show popup after 10 seconds if not already dismissed
    const timer = setTimeout(() => {
      const hasSeenPopup = localStorage.getItem('newsletter-popup-seen')
      if (!hasSeenPopup) {
        setIsVisible(true)
      }
    }, 10000)

    return () => clearTimeout(timer)
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    localStorage.setItem('newsletter-popup-seen', 'true')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    localStorage.setItem('newsletter-popup-seen', 'true')
    setTimeout(() => setIsVisible(false), 2000)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleDismiss}
      />
      
      {/* Popup */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 transform transition-all animate-bounce-in">
        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          aria-label="Close popup"
        >
          <FaTimes className="w-4 h-4 text-gray-500" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600">You're now subscribed to our newsletter.</p>
          </div>
        ) : (
          <>
            {/* Icon */}
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaEnvelope className="w-8 h-8 text-accent" />
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-center mb-2">Stay Updated!</h3>
            <p className="text-gray-600 text-center mb-6">
              Get the latest tech insights, industry trends, and exclusive offers delivered to your inbox.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
              />
              <button
                type="submit"
                className="w-full btn-accent py-3"
              >
                Subscribe
              </button>
            </form>

            {/* Privacy Note */}
            <p className="text-xs text-gray-400 text-center mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
