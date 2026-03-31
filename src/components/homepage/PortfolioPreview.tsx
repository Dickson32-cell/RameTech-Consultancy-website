'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import PortfolioModal from '@/components/shared/PortfolioModal'

interface PortfolioProject {
  id: string
  title: string
  category: string
  description: string
  imageUrl: string | null
  videoUrl: string | null
  projectUrl: string | null
  technologies?: string[]
  clientName?: string | null
}

export default function PortfolioPreview() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/v1/portfolio')
        const data = await res.json()
        if (data.success && data.data) {
          setProjects(data.data.slice(0, 3))
        }
      } catch (error) {
        console.error('Error fetching portfolio:', error)
      }
    }
    fetchProjects()
  }, [])

  const handleProjectClick = (project: PortfolioProject) => {
    setSelectedProject(project)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedProject(null)
  }

  const placeholderImages = [
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop'
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Our Work</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-text mt-3 mb-4">
            Featured Projects
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Check out some of our recent projects and see how we've helped businesses transform their digital presence.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              {/* Image/Video Container */}
              <div className="relative h-56 md:h-64 bg-gray-200 overflow-hidden group/video">
                {project.videoUrl ? (
                  <div className="relative w-full h-full" onClick={(e) => e.stopPropagation()}>
                    <video
                      src={project.videoUrl}
                      className="w-full h-full object-cover"
                      controls
                      controlsList="nodownload"
                      loop
                      playsInline
                      preload="metadata"
                      style={{
                        display: 'block',
                        maxWidth: '100%',
                        maxHeight: '100%'
                      }}
                    >
                      <source src={project.videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : project.imageUrl ? (
                  <Image
                    src={project.imageUrl}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <Image
                    src={placeholderImages[index] || placeholderImages[0]}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-text/80 via-text/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Hover Content */}
                <div className="absolute inset-0 flex items-end p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="text-white">
                    <p className="text-sm text-accent font-medium mb-1">{project.category}</p>
                    <h3 className="text-xl font-heading font-semibold">{project.title}</h3>
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-white hover:text-accent mt-2 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View Project</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 bg-white group-hover:-translate-y-full transition-transform duration-300">
                <p className="text-sm text-accent font-medium mb-1">{project.category}</p>
                <h3 className="text-xl font-heading font-semibold text-text">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12 md:mt-16">
          <Link href="/portfolio" className="btn-primary inline-flex items-center gap-2">
            <span>View Full Portfolio</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Portfolio Modal */}
      <PortfolioModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  )
}
