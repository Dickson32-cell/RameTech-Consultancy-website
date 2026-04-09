'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaExternalLinkAlt, FaFilePdf, FaCalendar, FaTag, FaArrowLeft } from 'react-icons/fa'

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

export default function PublicationsPage() {
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedTag, setSelectedTag] = useState<string>('all')

  useEffect(() => {
    fetchPublications()
  }, [])

  const fetchPublications = async () => {
    try {
      const response = await fetch('/api/v1/publications')
      const result = await response.json()

      if (result.success) {
        setPublications(result.data)
      }
    } catch (error) {
      console.error('Error fetching publications:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get unique types and tags
  const types = ['all', ...new Set(publications.map(p => p.type))]
  const allTags = publications.flatMap(p => p.tags)
  const tags = ['all', ...new Set(allTags)]

  // Filter publications
  const filteredPublications = publications.filter(pub => {
    const typeMatch = selectedType === 'all' || pub.type === selectedType
    const tagMatch = selectedTag === 'all' || pub.tags.includes(selectedTag)
    return typeMatch && tagMatch
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Research & Publications
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Explore our collection of research papers, articles, and publications
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap gap-4">
            {/* Type Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Type
              </label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type}
                  </option>
                ))}
              </select>
            </div>

            {/* Tag Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Tag
              </label>
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {tags.map(tag => (
                  <option key={tag} value={tag}>
                    {tag === 'all' ? 'All Tags' : tag}
                  </option>
                ))}
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <p className="text-gray-600 pb-2">
                {filteredPublications.length} publication{filteredPublications.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Publications Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredPublications.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No publications found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPublications.map((pub) => (
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
                    {pub.isFeatured && (
                      <div className="absolute top-2 left-2">
                        <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <div className="text-6xl text-white opacity-50">📄</div>
                    <div className="absolute top-2 right-2">
                      <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                        {pub.type}
                      </span>
                    </div>
                    {pub.isFeatured && (
                      <div className="absolute top-2 left-2">
                        <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-semibold rounded-full">
                          Featured
                        </span>
                      </div>
                    )}
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

                  {/* DOI */}
                  {pub.doi && (
                    <p className="text-xs text-gray-500 mb-3">
                      DOI: {pub.doi}
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
                        <span>{pub.tags.slice(0, 2).join(', ')}</span>
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
        )}
      </div>
    </div>
  )
}
