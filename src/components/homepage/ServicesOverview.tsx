'use client'

import Link from 'next/link'
import { FaCode, FaLaptopCode, FaPalette } from 'react-icons/fa'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const services = [
  {
    icon: FaCode,
    title: 'Software Development',
    description: 'Custom web applications, mobile apps, and enterprise software solutions tailored to your business needs.',
    link: '/services'
  },
  {
    icon: FaLaptopCode,
    title: 'Hardware & IT',
    description: 'IT infrastructure setup, network solutions, hardware procurement, and technical support services.',
    link: '/services'
  },
  {
    icon: FaPalette,
    title: 'Graphic Design',
    description: 'Professional branding, logo design, marketing materials, and visual content creation.',
    link: '/services'
  }
]

export default function ServicesOverview() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header slide-up animation
      if (headerRef.current) {
        gsap.from(headerRef.current, {
          duration: 1,
          y: 50,
          opacity: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        })
      }

      // Service cards staggered entrance
      if (cardsContainerRef.current) {
        gsap.from(cardsContainerRef.current.children, {
          duration: 0.8,
          y: 40,
          opacity: 0,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gray-50 overflow-visible">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header with GSAP animation */}
        <div ref={headerRef} className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Our Services
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            We offer comprehensive tech solutions to help your business grow and succeed in the digital age.
          </p>
        </div>

        {/* Service Cards with GSAP staggered animation */}
        <div 
          ref={cardsContainerRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {services.map((service, index) => (
            <Link 
              href={service.link} 
              key={index} 
              className="card card-3d-tilt group block transform transition-all duration-500 hover:-translate-y-2"
              style={{ position: 'relative', zIndex: 1 }}
            >
              <div className="w-14 h-14 md:w-16 md:h-16 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
                <service.icon className="w-6 h-6 md:w-8 md:h-8 text-primary group-hover:text-white" />
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-sm md:text-base text-gray-600">
                {service.description}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12 relative z-20">
          <Link href="/services" className="btn-secondary btn-3d inline-block">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
