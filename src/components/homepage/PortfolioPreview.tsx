'use client'

import Link from 'next/link'
import Image from 'next/image'

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
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Portfolio</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check out some of our recent projects and see how we've helped businesses transform their digital presence.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="card group overflow-hidden p-0">
              <div className="relative h-48 bg-gray-200">
                <Image 
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <p className="text-sm text-accent font-medium mb-1">{project.category}</p>
                <h3 className="text-xl font-semibold">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/portfolio" className="btn-primary">
            View Full Portfolio
          </Link>
        </div>
      </div>
    </section>
  )
}
