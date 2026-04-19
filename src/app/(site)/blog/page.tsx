import { Metadata } from 'next'
import prisma from '@/lib/db'
import Link from 'next/link'
import { FaCalendar, FaUser, FaClock } from 'react-icons/fa'
import BlogTabsClient from '@/components/blog/BlogTabsClient'

export const metadata: Metadata = {
  title: 'Blog & News | RAME Tech Consultancy',
  description: 'Insights, tutorials, news, and updates from RAME Tech Consultancy.'
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog &amp; News</h1>
          <p className="text-xl text-gray-300">Insights, tutorials, and live news updates from our team</p>
        </div>
      </section>

      {/* Tabs + Content */}
      <BlogTabsClient blogs={blogs} />
    </div>
  )
}
