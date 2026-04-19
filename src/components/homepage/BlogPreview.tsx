'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { FaExternalLinkAlt, FaArrowRight } from 'react-icons/fa'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  imageUrl: string | null
  author: string | null
  readTime: string | null
  publishedAt: string | null
}

interface NewsArticle {
  title: string
  description: string | null
  url: string
  source: string | null
  publishedAt: string
}

type Tab = 'blog' | 'news'

export default function BlogPreview() {
  const [activeTab, setActiveTab] = useState<Tab>('blog')
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [news, setNews] = useState<NewsArticle[]>([])
  const [blogsLoading, setBlogsLoading] = useState(true)
  const [newsLoading, setNewsLoading] = useState(false)
  const [newsFetched, setNewsFetched] = useState(false)

  // Fetch blog posts on mount
  useEffect(() => {
    fetch('/api/v1/blogs?limit=3')
      .then(res => res.json())
      .then(data => { if (data.success) setBlogs(data.data) })
      .catch(() => {})
      .finally(() => setBlogsLoading(false))
  }, [])

  // Fetch news lazily when tab is first opened
  useEffect(() => {
    if (activeTab === 'news' && !newsFetched) {
      setNewsLoading(true)
      fetch('/api/v1/news?limit=3&category=technology')
        .then(res => res.json())
        .then(data => { if (data.success) setNews(data.data) })
        .catch(() => {})
        .finally(() => {
          setNewsLoading(false)
          setNewsFetched(true)
        })
    }
  }, [activeTab, newsFetched])

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return ''
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  const isLoading = activeTab === 'blog' ? blogsLoading : newsLoading

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Insights</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-text mt-3 mb-4">
            Latest Updates
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Stay ahead with the latest industry insights, tutorials, and news.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-100 rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('blog')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'blog'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Blog Posts
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
                activeTab === 'news'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              News Updates
            </button>
          </div>
        </div>

        {/* Loading skeletons */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-gray-100 rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        )}

        {/* Blog Posts Grid */}
        {!isLoading && activeTab === 'blog' && (
          <>
            {blogs.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-12 h-12 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p>No blog posts yet. Check back soon!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {blogs.map((blog) => (
                  <Link key={blog.id} href={`/blog/${blog.slug}`} className="group cursor-pointer">
                    <article className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
                      {blog.imageUrl && (
                        <div className="aspect-video overflow-hidden">
                          <img
                            src={blog.imageUrl}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-grow">
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium mb-3 w-fit">
                          {blog.category}
                        </span>
                        <h3 className="text-lg font-heading font-semibold text-text mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">{blog.excerpt}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                              <span className="text-primary text-xs font-semibold">
                                {blog.author ? blog.author.split(' ').map(n => n[0]).join('').slice(0, 2) : 'RT'}
                              </span>
                            </div>
                            <span className="text-gray-500 text-xs">{blog.author || 'RAME Tech'}</span>
                          </div>
                          <span className="text-gray-400 text-xs">{formatDate(blog.publishedAt)}</span>
                        </div>
                        <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all duration-200">
                          <span>Read more</span>
                          <FaArrowRight size={12} />
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>
            )}
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
              >
                <span>View All Posts</span>
                <FaArrowRight size={16} />
              </Link>
            </div>
          </>
        )}

        {/* News Grid */}
        {!isLoading && activeTab === 'news' && (
          <>
            {news.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No news available right now. Try again later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {news.map((article, index) => (
                  <a
                    key={index}
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group cursor-pointer"
                  >
                    <article className="bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
                      {/* News header image placeholder */}
                      <div className="aspect-video bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center">
                        <div className="text-center px-4">
                          <span className="text-white/20 text-6xl font-bold leading-none select-none">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex flex-col flex-grow">
                        {/* Source badge */}
                        <div className="flex items-center justify-between mb-3">
                          {article.source && (
                            <span className="inline-block px-3 py-1 bg-accent/10 text-accent rounded-full text-xs font-medium">
                              {article.source}
                            </span>
                          )}
                          <span className="text-xs text-gray-400 ml-auto">{formatDate(article.publishedAt)}</span>
                        </div>

                        <h3 className="text-lg font-heading font-semibold text-text mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-3">
                          {article.title}
                        </h3>

                        {article.description && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                            {article.description}
                          </p>
                        )}

                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all duration-200">
                          <span>Read full article</span>
                          <FaExternalLinkAlt size={11} />
                        </div>
                      </div>
                    </article>
                  </a>
                ))}
              </div>
            )}
            <div className="text-center mt-12">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition-colors duration-200"
              >
                <span>View All News &amp; Blog</span>
                <FaArrowRight size={16} />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
