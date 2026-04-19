'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { FaNewspaper, FaSearch, FaSync, FaExternalLinkAlt, FaClock, FaFilter } from 'react-icons/fa'

interface NewsArticle {
  title: string
  description: string | null
  url: string
  source: string | null
  publishedAt: string
}

const CATEGORIES = ['technology', 'business', 'science', 'health', 'entertainment', 'sports', 'general']
const COUNTRIES = [
  { code: 'us', label: 'United States' },
  { code: 'gb', label: 'United Kingdom' },
  { code: 'au', label: 'Australia' },
  { code: 'ca', label: 'Canada' },
  { code: 'za', label: 'South Africa' },
  { code: 'ng', label: 'Nigeria' },
  { code: 'in', label: 'India' },
]

export default function AdminNewsPage() {
  const router = useRouter()
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Filter state
  const [mode, setMode] = useState<'headlines' | 'search'>('headlines')
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('technology')
  const [country, setCountry] = useState('us')
  const [limit, setLimit] = useState(20)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetchNews()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router])

  const fetchNews = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({ limit: String(limit) })
      if (mode === 'search' && query.trim()) {
        params.set('q', query.trim())
      } else {
        params.set('category', category)
        params.set('country', country)
      }

      const res = await fetch(`/api/v1/news?${params.toString()}`)
      const data = await res.json()

      if (data.success) {
        setArticles(data.data)
      } else {
        setError(data.error || 'Failed to fetch news')
        setArticles([])
      }
    } catch {
      setError('Network error — could not reach news API')
      setArticles([])
    } finally {
      setIsLoading(false)
    }
  }, [mode, query, category, country, limit])

  const handleApply = () => {
    fetchNews()
  }

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">News Updates</h1>
          <p className="text-gray-600 mt-1">
            Live news from NewsAPI — the ticker on the main website pulls from this feed
          </p>
        </div>
        <button
          onClick={fetchNews}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60 whitespace-nowrap"
        >
          <FaSync className={isLoading ? 'animate-spin' : ''} />
          Refresh Feed
        </button>
      </div>

      {/* Settings Panel */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <FaFilter className="text-primary" /> News Feed Settings
        </h2>

        {/* Mode toggle */}
        <div className="flex gap-3 mb-5">
          <button
            onClick={() => setMode('headlines')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'headlines'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Top Headlines
          </button>
          <button
            onClick={() => setMode('search')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              mode === 'search'
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Search by Topic
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {mode === 'search' ? (
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Query</label>
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                  placeholder="e.g. artificial intelligence, cybersecurity..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>{c.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Max Articles</label>
            <select
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {[10, 15, 20, 30, 40].map((n) => (
                <option key={n} value={n}>{n} articles</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={handleApply}
              disabled={isLoading}
              className="w-full px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium disabled:opacity-60"
            >
              Apply &amp; Preview
            </button>
          </div>
        </div>
      </div>

      {/* Ticker Preview */}
      {articles.length > 0 && (
        <div className="bg-primary-dark rounded-xl overflow-hidden mb-6 shadow-sm">
          <div className="px-4 py-2 text-xs text-white/50 uppercase tracking-wider">
            Ticker Preview (as seen on main website)
          </div>
          <div className="flex items-center h-9 overflow-hidden border-t border-white/10">
            <div className="flex-shrink-0 flex items-center gap-1.5 bg-accent px-3 py-0.5 h-full text-white font-bold text-xs uppercase tracking-widest">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              LIVE NEWS
            </div>
            <div className="flex-shrink-0 w-px h-full bg-white/20" />
            <div className="flex-1 overflow-hidden">
              <div
                className="flex whitespace-nowrap"
                style={{ animation: 'ticker 55s linear infinite' }}
              >
                {[...articles, ...articles].map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-2 px-6 text-sm text-white/90">
                    <span className="text-accent/60 text-xs">◆</span>
                    {a.title}
                    {a.source && <span className="text-xs text-white/40 ml-1">[{a.source}]</span>}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 text-sm">
          <strong>Error:</strong> {error}
          {error.includes('developer') || error.includes('upgrade') ? (
            <p className="mt-1 text-red-600">
              Note: The free NewsAPI plan only works on localhost. For production (Render), you need a Business plan at newsapi.org.
            </p>
          ) : null}
        </div>
      )}

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      )}

      {/* Articles List */}
      {!isLoading && articles.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FaNewspaper className="text-primary" />
              {articles.length} Articles in Feed
            </h2>
            <span className="text-xs text-gray-400">Hover ticker above to pause scrolling</span>
          </div>
          <div className="divide-y divide-gray-100">
            {articles.map((article, index) => (
              <div key={index} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-gray-900 hover:text-primary transition-colors flex items-start gap-2 group"
                    >
                      <span className="flex-1">{article.title}</span>
                      <FaExternalLinkAlt className="flex-shrink-0 text-xs mt-1 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </a>
                    {article.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{article.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2">
                      {article.source && (
                        <span className="text-xs font-medium text-primary/80 bg-primary/10 px-2 py-0.5 rounded">
                          {article.source}
                        </span>
                      )}
                      {article.publishedAt && (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FaClock className="text-xs" />
                          {formatDate(article.publishedAt)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !error && articles.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaNewspaper className="text-gray-300 text-5xl mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No articles loaded yet.</p>
          <p className="text-sm text-gray-400">Click &quot;Refresh Feed&quot; or adjust settings above and click &quot;Apply &amp; Preview&quot;.</p>
        </div>
      )}
    </div>
  )
}
