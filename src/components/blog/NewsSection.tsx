'use client'

import { useEffect, useState } from 'react'
import { FaExternalLinkAlt, FaClock, FaNewspaper } from 'react-icons/fa'

interface NewsArticle {
  title: string
  description: string | null
  url: string
  source: string | null
  publishedAt: string
}

export default function NewsSection() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/v1/news?limit=12&category=technology')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data.length > 0) {
          setArticles(data.data)
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false))
  }, [])

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
      })
    } catch {
      return ''
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
            <div className="aspect-video bg-gray-100" />
            <div className="p-6 space-y-3">
              <div className="h-4 bg-gray-100 rounded w-1/3" />
              <div className="h-5 bg-gray-100 rounded w-full" />
              <div className="h-5 bg-gray-100 rounded w-4/5" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error || articles.length === 0) {
    return (
      <div className="text-center py-16">
        <FaNewspaper className="text-gray-300 text-5xl mx-auto mb-4" />
        <p className="text-gray-500">News is temporarily unavailable. Please check back later.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {articles.map((article, index) => (
        <a
          key={index}
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <article className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            {/* Card header */}
            <div className="aspect-video bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center relative overflow-hidden">
              <span className="absolute inset-0 opacity-10 text-white text-8xl font-black flex items-center justify-center select-none">
                {String(index + 1).padStart(2, '0')}
              </span>
              {article.source && (
                <span className="relative z-10 px-4 py-2 bg-white/15 backdrop-blur-sm rounded-full text-white text-sm font-semibold border border-white/20">
                  {article.source}
                </span>
              )}
            </div>

            {/* Content */}
            <div className="p-6 flex flex-col flex-grow">
              {/* Meta row */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                  News
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-400">
                  <FaClock size={10} />
                  {formatDate(article.publishedAt)}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-3 flex-grow">
                {article.title}
              </h2>

              {/* Description */}
              {article.description && (
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {article.description}
                </p>
              )}

              {/* CTA */}
              <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-primary text-sm font-medium group-hover:gap-3 transition-all duration-200">
                <span>Read full article</span>
                <FaExternalLinkAlt size={11} />
              </div>
            </div>
          </article>
        </a>
      ))}
    </div>
  )
}
