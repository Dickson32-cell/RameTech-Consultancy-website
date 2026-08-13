import Link from 'next/link'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary flex items-center justify-center overflow-hidden">
          <img src="/logo.png" alt="RAMEDIC" className="w-full h-full object-contain p-2" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-text mb-3">You are offline</h1>
        <p className="text-text-light mb-8">
          No internet connection. Check your network and try again. The site will load automatically once you reconnect.
        </p>
        <Link href="/" className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
          Try Again
        </Link>
      </div>
    </div>
  )
}