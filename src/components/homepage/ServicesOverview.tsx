'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Service {
  id: string
  name: string
  slug: string
  description: string
  icon: string | null
  link?: string
}

const iconSvgs: Record<string, React.ReactNode> = {
  FaCode: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
    </svg>
  ),
  FaLaptopCode: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  FaPalette: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  FaServer: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
    </svg>
  ),
  FaMobileAlt: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
  ),
  FaDatabase: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  ),
  FaCloud: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
    </svg>
  ),
  FaShieldAlt: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  FaGraduationCap: (
    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
    </svg>
  ),
}

export default function ServicesOverview() {
  const [services, setServices] = useState<Service[]>([])

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await fetch('/api/v1/services')
        const data = await res.json()
        if (data.success && data.data) {
          const mappedServices = data.data.slice(0, 6).map((s: Service) => ({
            ...s,
            link: s.slug === 'academic-writing' ? '/services/academic-writing' : '/services'
          }))
          setServices(mappedServices)
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      }
    }
    fetchServices()
  }, [])

  return (
    <section className="relative py-16 md:py-24 bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple/5 rounded-full blur-3xl"></div>
      <div className="absolute inset-0 tech-grid-pattern opacity-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 glass-tech neon-border rounded-full px-5 py-2 mb-4">
            <div className="w-2 h-2 bg-cyan rounded-full animate-pulse"></div>
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">What We Offer</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-text mt-3 mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-cyan to-purple">Services</span>
          </h2>
          <p className="text-base md:text-lg text-text-light max-w-2xl mx-auto px-4">
            We offer comprehensive tech solutions to help your business grow and succeed in the digital age.
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Link
              href={service.link || '/services'}
              key={service.id}
              className={`group relative bg-white rounded-2xl p-6 border border-gray-200 hover:border-primary/30 shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer overflow-hidden ${
                index === 0 || index === 3 ? 'sm:col-span-2 lg:col-span-1' : ''
              }`}
            >
              {/* Gradient Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-cyan/0 to-purple/0 group-hover:from-primary/5 group-hover:via-cyan/5 group-hover:to-purple/5 transition-all duration-500"></div>

              {/* Tech Corner Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 border-t-2 border-r-2 border-transparent group-hover:border-cyan/20 rounded-tr-2xl transition-all duration-300"></div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-primary/10 to-cyan/10 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:shadow-glow transition-all duration-300">
                  <div className="text-primary group-hover:text-cyan transition-colors duration-300">
                    {iconSvgs[service.icon || 'FaCode'] || iconSvgs['FaCode']}
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan/20 to-purple/20 opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                </div>

                <h3 className="text-xl font-heading font-semibold text-text mb-3 group-hover:text-primary transition-colors duration-300">
                  {service.name}
                </h3>

                <p className="text-text-light text-sm leading-relaxed mb-4">
                  {service.description}
                </p>

                {/* Arrow Indicator */}
                <div className="flex items-center text-primary gap-2 opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                  <span className="text-sm font-semibold">Learn more</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 md:mt-16">
          <Link href="/services" className="group inline-flex items-center gap-3 glass-tech neon-border px-8 py-4 rounded-lg font-semibold hover:shadow-neon transition-all duration-300">
            <span className="text-primary">View All Services</span>
            <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
