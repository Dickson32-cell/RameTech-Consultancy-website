'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaExternalLinkAlt, FaFilePdf, FaCalendar, FaTag } from 'react-icons/fa'

interface Publication {
  id: string
  title: string
  type: string
  description: string | null
  url: string
  authors: string[]
  publicationDate: string | null
  doi: string | null
  journal: string | null
  tags: string[]
  thumbnailUrl: string | null
  pdfUrl: string | null
  isFeatured: boolean
}

export default function PublicationsSection() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/v1/publications?featured=true')
      const result = await response.json()

      if (result.success) {
        setPublications(result.data.slice(0, 3)) // Show only 3 featured publications
      }
    } catch (error) {
      console.error('Error fetching publications:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </section>
    )
  }

  if (publications.length === 0) {
    return null // Don't show section if no featured publications
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Research & Publications
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our latest research papers, articles, and publications
          </p>
        </div>

        {/* Publications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publications.map((pub) => (
            <div
              key={pub.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Thumbnail */}
              {pub.thumbnailUrl ? (
                <div className="relative h-48 bg-gray-200 overflow-hidden">
                  <img
                    src={pub.thumbnailUrl}
                    alt={pub.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                      {pub.type}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                  <div className="text-6xl text-white opacity-50">📄</div>
                  <div className="absolute top-2 right-2">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                      {pub.type}
                    </span>
                  </div>
                </div>
              )}

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                  {pub.title}
                </h3>

                {/* Authors */}
                {pub.authors.length > 0 && (
                  <p className="text-sm text-gray-600 mb-3">
                    {pub.authors.slice(0, 3).join(', ')}
                    {pub.authors.length > 3 && ' et al.'}
                  </p>
                )}

                {/* Journal/Conference */}
                {pub.journal && (
                  <p className="text-sm text-blue-600 font-medium mb-3">
                    {pub.journal}
                  </p>
                )}

                {/* Description */}
                {pub.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {pub.description}
                  </p>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
                  {pub.publicationDate && (
                    <div className="flex items-center gap-1">
                      <FaCalendar />
                      <span>{new Date(pub.publicationDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {pub.tags.length > 0 && (
                    <div className="flex items-center gap-1">
                      <FaTag />
                      <span>{pub.tags[0]}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <a
                    href={pub.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    <span>View Publication</span>
                    <FaExternalLinkAlt size={12} />
                  </a>
                  {pub.pdfUrl && (
                    <a
                      href={pub.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      title="Download PDF"
                    >
                      <FaFilePdf size={18} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        {publications.length > 0 && (
          <div className="text-center mt-12">
            <Link
              href="/publications"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              <span>View All Publications</span>
              <FaExternalLinkAlt />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
