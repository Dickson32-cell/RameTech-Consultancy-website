'use client'

import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/v1/settings?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.logoUrl) {
          setLogoUrl(data.data.logoUrl)
        }
      })
      .catch(() => { })
  }, [])

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) return

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after 5 seconds delay
      setTimeout(() => setShowPrompt(true), 5000)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    if (choice.outcome === 'accepted') {
      setIsInstalled(true)
    }
    setShowPrompt(false)
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-install-dismissed', 'true')
  }

  if (isInstalled || !showPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50" style={{ animation: 'fadeInUp 0.4s ease-out' }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-4 max-w-md mx-auto border border-gray-200">
        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src={logoUrl || '/logo.png'} alt="RAMEDIC" className="w-full h-full object-contain" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-sm text-text">Install RAMEDIC App</h3>
          <p className="text-text-light text-xs">Quick access from your home screen</p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleDismiss}
            className="text-gray-400 hover:text-gray-600 text-lg px-1"
            aria-label="Dismiss"
          >
            ✕
          </button>
          <button
            onClick={handleInstall}
            className="bg-primary text-white font-semibold text-sm px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  )
}