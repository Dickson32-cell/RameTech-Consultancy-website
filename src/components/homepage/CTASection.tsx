'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Parallax effect for decorative elements
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      const section = sectionRef.current
      if (!section) return
      
      const rect = section.getBoundingClientRect()
      const sectionTop = rect.top + scrollY
      const relativeScroll = scrollY - sectionTop
      setParallaxOffset(relativeScroll * 0.1)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-20 bg-accent relative overflow-hidden"
    >
      {/* Floating decorative elements with parallax */}
      <div 
        className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full -translate-x-16 -translate-y-16 animate-float-3d"
        style={{ transform: `translateY(${parallaxOffset * 0.5}px)` }}
      ></div>
      <div 
        className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-white/10 rounded-full translate-x-20 translate-y-20 animate-float-3d"
        style={{ animationDelay: '2s', transform: `translateY(${parallaxOffset * -0.3}px)` }}
      ></div>
      
      <div 
        className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 md:mb-6">
          Ready to Transform Your Business?
        </h2>
        <p className="text-base md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto px-4">
          Let's discuss your project and how we can help you achieve your goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
          <Link href="/contact" className="bg-white text-accent px-6 md:px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 btn-3d min-h-[44px] flex items-center justify-center">
            Get a Free Quote
          </Link>
          <Link href="/contact" className="border-2 border-white text-white px-6 md:px-8 py-3 rounded-md font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105 btn-3d min-h-[44px] flex items-center justify-center">
            Schedule Consultation
          </Link>
        </div>
      </div>
    </section>
  )
}
