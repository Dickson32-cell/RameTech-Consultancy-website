import { Metadata } from 'next'
import prisma from '@/lib/db'
import Link from 'next/link'
import { FaCalendar, FaUser, FaClock, FaArrowRight } from 'react-icons/fa'

export const metadata: Metadata = {
  title: 'Blog | RAME Tech Consultancy',
  description: 'Insights, tutorials, and updates from RAME Tech Consultancy.'
}

export const dynamic = 'force-dynamic'

async function getPublishedBlogs() {
  return prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: 'desc' }
  })
}

export default async function BlogPage() {
  const blogs = await getPublishedBlogs()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
          <p className="text-xl text-gray-300">Insights, tutorials, and updates from our team</p>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No blog posts yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link key={blog.id} href={`/blog/${blog.slug}`} className="group">
                <article className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow">
                  {blog.imageUrl && (
                    <div className="aspect-video overflow-hidden">
                      <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">{blog.category}</span>
                      {blog.readTime && (
                        <span className="flex items-center gap-1"><FaClock size={12} /> {blog.readTime}</span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">{blog.title}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        {blog.author && <><FaUser size={12} /> {blog.author}</>}
                      </div>
                      <span className="flex items-center gap-1 text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Read <FaArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
