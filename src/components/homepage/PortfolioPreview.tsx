'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    title: 'E-Commerce Platform',
    category: 'Web Development',
    image: 'https://ui-avatars.com/api/?name=E-Commerce&size=400x300&background=1A5276&color=fff'
  },
  {
    title: 'Mobile Banking App',
    category: 'Mobile Development',
    image: 'https://ui-avatars.com/api/?name=Banking+App&size=400x300&background=F39C12&color=fff'
  },
  {
    title: 'Corporate Branding',
    category: 'Graphic Design',
    image: 'https://ui-avatars.com/api/?name=Branding&size=400x300&background=154360&color=fff'
  }
]

export default function PortfolioPreview() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
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

      // Portfolio cards staggered entrance
      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          duration: 0.8,
          y: 40,
          opacity: 0,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        })
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with GSAP animation */}
        <div ref={headerRef} className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Our Portfolio
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Check out some of our recent projects and see how we've helped businesses transform their digital presence.
          </p>
        </div>

        {/* Portfolio items with GSAP staggered animation */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative z-10">
          {projects.map((project, index) => (
            <div 
              key={index} 
              className="card card-3d-tilt group overflow-hidden p-0 transition-all duration-700 hover:-translate-y-2"
            >
              <div className="relative h-48 sm:h-56 bg-gray-200 overflow-hidden">
                <Image 
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-4 md:p-6">
                <p className="text-sm text-accent font-medium mb-1">{project.category}</p>
                <h3 className="text-lg md:text-xl font-semibold">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:mt-12">
          <Link href="/portfolio" className="btn-primary btn-3d">
            View Full Portfolio
          </Link>
        </div>
      </div>
    </section>
  )
}
