'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function CTASection() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const decor1Ref = useRef<HTMLDivElement>(null)
  const decor2Ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Content entrance animation
      if (contentRef.current) {
        gsap.from(contentRef.current, {
          duration: 1,
          y: 50,
          opacity: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        })
      }

      // Floating decorative elements with continuous animation
      if (decor1Ref.current) {
        gsap.to(decor1Ref.current, {
          y: 20,
          duration: 3,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        })
      }

      if (decor2Ref.current) {
        gsap.to(decor2Ref.current, {
          y: -20,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: 0.5
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section 
      ref={sectionRef}
      className="py-16 md:py-20 bg-accent relative overflow-hidden"
    >
      {/* Floating decorative elements with GSAP animation */}
      <div 
        ref={decor1Ref}
        className="absolute top-0 left-0 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full -translate-x-16 -translate-y-16 animate-float-3d"
      ></div>
      <div 
        ref={decor2Ref}
        className="absolute bottom-0 right-0 w-40 h-40 md:w-64 md:h-64 bg-white/10 rounded-full translate-x-20 translate-y-20 animate-float-3d"
      ></div>
      
      <div ref={contentRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
