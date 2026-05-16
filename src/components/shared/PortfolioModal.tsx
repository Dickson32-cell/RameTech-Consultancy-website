'use client'

import React, { useEffect } from 'react'
import { FiX, FiExternalLink } from 'react-icons/fi'

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

interface PortfolioModalProps {
  project: PortfolioProject | null
  isOpen: boolean
  onClose: () => void
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ project, isOpen, onClose }) => {
  // Close modal on ESC key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !project) return null

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl animate-slideUp">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200"
          aria-label="Close modal"
        >
          <FiX className="w-6 h-6 text-gray-700" />
        </button>

        {/* Media Section */}
        <div className="relative w-full h-64 md:h-96 bg-gray-100 overflow-hidden">
          {project.videoUrl ? (
            <video
              key={project.videoUrl}
              src={project.videoUrl}
              controls
              loop
              playsInline
              preload="metadata"
              controlsList="nodownload"
              className="w-full h-full object-contain bg-black"
              onError={(e) => {
                console.error('Modal video error:', project.videoUrl)
                const target = e.currentTarget
                target.style.display = 'none'
                const errorDiv = document.createElement('div')
                errorDiv.className = 'w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4'
                errorDiv.innerHTML = `
                  <svg class="w-16 h-16 mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <p class="text-sm text-center mb-2">Unable to load video</p>
                  <p class="text-xs text-gray-400 text-center break-all px-4">${project.videoUrl}</p>
                `
                target.parentElement?.appendChild(errorDiv)
              }}
              onCanPlay={() => console.log('Modal video ready:', project.videoUrl)}
            >
              Your browser does not support the video tag.
            </video>
          ) : project.imageUrl ? (
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
              <span className="text-gray-400 text-lg">No media available</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-block px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
              {project.category}
            </span>
          </div>

          {/* Title */}
          <h2 id="modal-title" className="text-3xl md:text-4xl font-bold text-text mb-4">
            {project.title}
          </h2>

          {/* Client Name */}
          {project.clientName && (
            <p className="text-sm text-gray-600 mb-4">
              <span className="font-semibold">Client:</span> {project.clientName}
            </p>
          )}

          {/* Description */}
          <div className="prose prose-lg max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Technologies Used:</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-sm font-medium text-secondary bg-secondary/10 rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Project Link */}
          {project.projectUrl && (
            <div className="pt-6 border-t border-gray-200">
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 text-white bg-gradient-to-r from-primary to-secondary rounded-lg font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <span>View Live Project</span>
                <FiExternalLink className="w-5 h-5" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PortfolioModal
