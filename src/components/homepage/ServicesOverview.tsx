'use client'

import Link from 'next/link'
import { FaCode, FaLaptopCode, FaPalette } from 'react-icons/fa'
import { useEffect, useState, useRef } from 'react'

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
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          sectionObserver.unobserve(entry.target)
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    )

    if (sectionRef.current) {
      sectionObserver.observe(sectionRef.current)
    }

    return () => sectionObserver.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with 3D scroll animation */}
        <div 
          className={`text-center mb-8 md:mb-12 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Our Services
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            We offer comprehensive tech solutions to help your business grow and succeed in the digital age.
          </p>
        </div>

        {/* Service Cards with staggered 3D animations */}
        <div 
          ref={cardsRef}
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 scroll-stagger ${
            isVisible ? 'is-visible' : ''
          }`}
        >
          {services.map((service, index) => (
            <Link 
              href={service.link} 
              key={index} 
              className="card card-3d-tilt group transform transition-all duration-500 hover:-translate-y-2"
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

        <div className="text-center mt-8 md:mt-12">
          <Link href="/services" className="btn-secondary btn-3d inline-block">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
