'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FaCalendar, FaClock, FaUser } from 'react-icons/fa'
import NewsSection from './NewsSection'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  imageUrl: string | null
  author: string | null
  readTime: string | null
  publishedAt: Date | null
}

type Tab = 'blog' | 'news'

export default function BlogTabsClient({ blogs }: { blogs: BlogPost[] }) {
  const [activeTab, setActiveTab] = useState<Tab>('blog')

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

      {/* Tab Switcher */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex bg-white rounded-xl p-1 gap-1 shadow-sm border border-gray-100">
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              activeTab === 'blog'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Blog Posts
            {blogs.length > 0 && (
              <span className={`ml-2 text-xs px-1.5 py-0.5 rounded-full ${activeTab === 'blog' ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                {blogs.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 flex items-center gap-2 ${
              activeTab === 'news'
                ? 'bg-primary text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full animate-pulse ${
                activeTab === 'news' ? 'bg-white' : 'bg-accent'
              }`}
            />
            News Updates
          </button>
        </div>
      </div>

      {/* Blog Posts */}
      {activeTab === 'blog' && (
        blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
                <article className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                  {blog.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={blog.imageUrl}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                        {blog.category}
                      </span>
                      {blog.readTime && (
                        <span className="flex items-center gap-1 text-xs">
                          <FaClock size={10} /> {blog.readTime}
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-grow">
                      {blog.title}
                    </h2>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{blog.excerpt}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {blog.author && (
                          <>
                            <FaUser size={10} />
                            <span className="text-xs">{blog.author}</span>
                          </>
                        )}
                      </div>
                      {blog.publishedAt && (
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <FaCalendar size={10} />
                          {formatDate(blog.publishedAt)}
                        </span>
                      )}
                    </div>
                    <div className="mt-4 flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all duration-200">
                      <span>Read more</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )
      )}

      {/* News Updates */}
      {activeTab === 'news' && <NewsSection />}
    </section>
  )
}
