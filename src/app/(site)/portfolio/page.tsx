'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
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

export default function PortfolioPage() {
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<PortfolioProject | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    fetch('/api/v1/portfolio')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProjects(data.data)
        }
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  const categories = ['All', ...Array.from(new Set(projects.map(p => p.category)))]

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory)

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
    'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop',
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span className="text-sm font-medium">Our Work</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">Portfolio</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Browse through our completed projects and see how we've helped businesses transform their digital presence.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white text-gray-600 hover:bg-gray-50 shadow'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects */}
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-gray-200 rounded-2xl h-80 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <div
                  key={project.id}
                  className="bento-card p-0 overflow-hidden group cursor-pointer"
                  onClick={() => handleProjectClick(project)}
                >
                  {/* Image or Video */}
                  <div className="relative h-56 bg-gray-200 overflow-hidden group/video">
                    {project.videoUrl ? (
                      <div className="relative w-full h-full bg-gray-900 flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        <video
                          key={project.videoUrl}
                          className="w-full h-full object-cover"
                          controls
                          controlsList="nodownload"
                          loop
                          playsInline
                          preload="metadata"
                          onError={(e) => {
                            console.error('Video load error:', {
                              url: project.videoUrl,
                              error: e,
                              networkState: e.currentTarget.networkState,
                              readyState: e.currentTarget.readyState
                            })
                            // Show error message
                            const container = e.currentTarget.parentElement
                            if (container) {
                              container.innerHTML = `
                                <div class="flex flex-col items-center justify-center h-full text-white p-4">
                                  <svg class="w-16 h-16 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                  </svg>
                                  <p class="text-sm text-center">Video cannot be loaded</p>
                                  <p class="text-xs text-gray-400 mt-2 text-center">The video file may not be available</p>
                                </div>
                              `
                            }
                          }}
                          onLoadStart={() => console.log('Video loading:', project.videoUrl)}
                          onCanPlay={() => console.log('Video ready:', project.videoUrl)}
                          style={{
                            display: 'block',
                            maxWidth: '100%',
                            maxHeight: '100%'
                          }}
                        >
                          <source src={project.videoUrl} type="video/mp4" />
                          <source src={project.videoUrl.replace('/api/v1/videos/', '/uploads/')} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    ) : (
                      <img
                        src={project.imageUrl || placeholderImages[index % placeholderImages.length]}
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = placeholderImages[index % placeholderImages.length];
                        }}
                      />
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-text/90 via-text/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
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

                  {/* Content */}
                  <div className="p-6">
                    <p className="text-sm text-accent font-medium mb-2">{project.category}</p>
                    <h3 className="text-xl font-heading font-semibold text-text mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {project.technologies.slice(0, 3).map((tech, idx) => (
                          <span key={idx} className="px-3 py-1 bg-primary/10 text-primary text-xs rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primaryDark font-medium transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View Live Project</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-secondary to-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Have a Project in Mind?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create something amazing together.
          </p>
          <Link href="/contact" className="btn-accent text-lg px-8 py-4 cursor-pointer">
            Start Your Project
          </Link>
        </div>
      </section>

      {/* Portfolio Modal */}
      <PortfolioModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}
