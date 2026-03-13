'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function CTASection() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-16 bg-accent relative overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 animate-float-3d"></div>
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-white/10 rounded-full translate-x-20 translate-y-20 animate-float-3d" style={{ animationDelay: '2s' }}></div>
      
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Let's discuss your project and how we can help you achieve your goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="bg-white text-accent px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 btn-3d">
            Get a Free Quote
          </Link>
          <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105 btn-3d">
            Schedule Consultation
          </Link>
        </div>
      </div>
    </section>
  )
}
