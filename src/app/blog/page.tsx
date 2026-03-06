import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog | RAME Tech Consultancy',
  description: 'Latest insights on software development, technology trends, and business tips from RAME Tech.',
}

const blogPosts = [
  {
    title: 'Why Every Business in Ghana Needs a Professional Website in 2026',
    excerpt: 'In today\'s digital age, having a professional online presence is no longer optional—it\'s essential for business success.',
    category: 'Web Development',
    date: 'March 1, 2026',
    readTime: '5 min read',
    image: 'https://ui-avatars.com/api/?name=Website&size=600x400&background=1A5276&color=fff'
  },
  {
    title: 'How AI is Transforming Software Development in Africa',
    excerpt: 'Artificial intelligence is revolutionizing how we build software, and African developers are leading the charge.',
    category: 'AI & Technology',
    date: 'February 25, 2026',
    readTime: '7 min read',
    image: 'https://ui-avatars.com/api/?name=AI+Africa&size=600x400&background=F39C12&color=fff'
  },
  {
    title: '5 Signs Your Business Needs a Custom Software Solution',
    excerpt: 'Off-the-shelf software isn\'t always the answer. Here are signs it\'s time to invest in custom development.',
    category: 'Software Development',
    date: 'February 20, 2026',
    readTime: '4 min read',
    image: 'https://ui-avatars.com/api/?name=Custom+Software&size=600x400&background=154360&color=fff'
  },
  {
    title: 'The Complete Guide to Mobile Money Integration for Ghanaian Businesses',
    excerpt: 'Learn how to integrate Mobile Money into your business applications for seamless transactions.',
    category: 'Payments',
    date: 'February 15, 2026',
    readTime: '8 min read',
    image: 'https://ui-avatars.com/api/?name=Mobile+Money&size=600x400&background=27AE60&color=fff'
  },
  {
    title: 'Understanding Web Accessibility: Why WCAG Compliance Matters',
    excerpt: 'Web accessibility isn\'t just about compliance—it\'s about ensuring everyone can access your content.',
    category: 'Web Development',
    date: 'February 10, 2026',
    readTime: '6 min read',
    image: 'https://ui-avatars.com/api/?name=Accessibility&size=600x400&background=8E44AD&color=fff'
  },
  {
    title: 'Choosing the Right Tech Stack for Your Startup',
    excerpt: 'The technology decisions you make early on can make or break your startup. Here\'s how to choose wisely.',
    category: 'Technology',
    date: 'February 5, 2026',
    readTime: '5 min read',
    image: 'https://ui-avatars.com/api/?name=Tech+Stack&size=600x400&background=E74C3C&color=fff'
  }
]

export default function BlogPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-primaryDark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Latest insights, tips, and trends from the world of technology and business.
          </p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="card overflow-hidden p-0 group">
                <div className="relative h-48 bg-gray-200">
                  <Image 
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 bg-white/90 text-primary text-sm font-medium rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter to get the latest insights delivered to your inbox.
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="input-field flex-1"
            />
            <button type="submit" className="btn-primary">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  )
}
