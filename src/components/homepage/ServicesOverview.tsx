'use client'

import Link from 'next/link'
import { FaCode, FaLaptopCode, FaPalette } from 'react-icons/fa'
import { useEffect, useState } from 'react'

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
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            Our Services
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            We offer comprehensive tech solutions to help your business grow and succeed in the digital age.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => (
            <Link 
              href={service.link} 
              key={index} 
              className={`card group transform transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${index * 150}ms` }}
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
          <Link href="/services" className="btn-secondary inline-block">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  )
}
