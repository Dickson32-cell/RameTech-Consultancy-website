'use client'

import { useEffect, useState, useRef } from 'react'

interface NewsArticle {
  title: string
  description: string | null
  url: string
  source: string | null
  publishedAt: string
}

export default function NewsTicker() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isPaused, setIsPaused] = useState(false)
  const tickerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch('/api/v1/news?limit=20&category=technology')
        const data = await res.json()
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setArticles(data.data)
        }
      } catch {
        // Silently fail — ticker is non-critical
      }
    }

    fetchNews()
    // Refresh every hour
    const interval = setInterval(fetchNews, 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  if (articles.length === 0) return null

  // Duplicate articles for seamless infinite loop
  const doubled = [...articles, ...articles]

  return (
    <div
      className="bg-primary-dark border-b border-white/10 text-white py-2 overflow-hidden"
      role="marquee"
      aria-label="Live news ticker"
    >
      <div className="flex items-center h-7">
        {/* Label badge */}
        <div className="flex-shrink-0 flex items-center gap-1.5 bg-accent px-3 py-0.5 h-full text-white font-bold text-xs uppercase tracking-widest z-10 shadow-md">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          LIVE NEWS
        </div>

        {/* Divider */}
        <div className="flex-shrink-0 w-px h-full bg-white/20" />

        {/* Scrolling track */}
        <div
          className="flex-1 overflow-hidden relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={tickerRef}
            className="flex whitespace-nowrap"
            style={{
              animation: `ticker 55s linear infinite`,
              animationPlayState: isPaused ? 'paused' : 'running',
            }}
          >
            {doubled.map((article, index) => (
              <a
                key={`${article.url}-${index}`}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 group"
                title={article.title}
              >
                <span className="text-accent/60 text-xs select-none">◆</span>
                <span className="text-sm text-white/90 group-hover:text-accent transition-colors duration-200">
                  {article.title}
                </span>
                {article.source && (
                  <span className="text-xs text-white/40 font-medium ml-1 group-hover:text-white/60 transition-colors">
                    [{article.source}]
                  </span>
                )}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
