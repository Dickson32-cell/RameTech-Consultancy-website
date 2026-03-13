'use client'

import Link from 'next/link'
import { useEffect, useState, useRef } from 'react'

export default function HeroSection() {
  const [loaded, setLoaded] = useState(false)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const textRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoaded(true)
    
    const handleScroll = () => {
      const scrollY = window.scrollY
      setParallaxOffset(scrollY * 0.15)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Setup IntersectionObserver for scroll-triggered animations
  useEffect(() => {
    const observerOptions = { threshold: 0.2, rootMargin: '0px 0px -50px 0px' }
    
    const textObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    }, observerOptions)

    const statsObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible')
      }
    }, observerOptions)

    if (textRef.current) textObserver.observe(textRef.current)
    if (statsRef.current) statsObserver.observe(statsRef.current)

    return () => {
      textObserver.disconnect()
      statsObserver.disconnect()
    }
  }, [])

  return (
    <section className="relative bg-gradient-to-br from-primary to-primaryDark text-white overflow-hidden">
      {/* Animated Background Elements - Enhanced with 3D depth & Parallax */}
      <div 
        className="absolute inset-0 overflow-hidden"
        style={{ transform: `translateY(${parallaxOffset * 0.3}px)` }}
      >
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float-3d"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float-3d" style={{ animationDelay: '1.5s' }}></div>
        {/* Additional depth layers */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-float-3d" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-accent/5 rounded-full blur-xl animate-float-3d" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-10">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Text Content with 3D animation */}
          <div 
            ref={textRef}
            className="scroll-animate scroll-animate-rotate-in"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 leading-tight">
              Innovative Tech{' '}
              <span className="text-accent">Solutions</span>{' '}
              for Your Business
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-6 md:mb-8">
              RAME Tech Consultancy delivers cutting-edge software development, hardware & IT solutions, and professional graphic design services to help your business thrive.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <Link href="/contact" className="btn-accent btn-3d text-center text-base md:text-lg">
                Get a Free Quote
              </Link>
              <Link href="/portfolio" className="bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-md font-semibold hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-center text-base md:text-lg">
                View Our Work
              </Link>
            </div>
          </div>

          {/* Stats Card with 3D effect - Scroll triggered */}
          <div 
            ref={statsRef}
            className="hidden md:block scroll-animate scroll-animate-flip-in"
            style={{ transitionDelay: '200ms' }}
          >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10 shadow-3d-4">
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white/20 rounded-xl p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105 card-3d-tilt">
                  <div className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">50+</div>
                  <div className="text-sm text-gray-200">Projects Completed</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105 card-3d-tilt">
                  <div className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">5+</div>
                  <div className="text-sm text-gray-200">Years Experience</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105 card-3d-tilt">
                  <div className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">30+</div>
                  <div className="text-sm text-gray-200">Happy Clients</div>
                </div>
                <div className="bg-white/20 rounded-xl p-4 md:p-6 text-center hover:bg-white/30 transition-all duration-300 transform hover:scale-105 card-3d-tilt">
                  <div className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">24/7</div>
                  <div className="text-sm text-gray-200">Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Wave Divider */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
