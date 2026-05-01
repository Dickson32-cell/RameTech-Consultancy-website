import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import prisma from '@/lib/db'
import Link from 'next/link'
import { FaCalendar, FaUser, FaClock, FaArrowLeft } from 'react-icons/fa'

export const dynamic = 'force-dynamic'

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

async function getBlogPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, isPublished: true }
  })
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const blog = await getBlogPost(params.slug)

  if (!blog) {
    return {
      title: 'Blog Post Not Found | RAME Tech Consultancy'
    }
  }

  return {
    title: `${blog.title} | RAME Tech Blog`,
    description: blog.excerpt,
    openGraph: blog.imageUrl ? {
      images: [blog.imageUrl]
    } : undefined
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const blog = await getBlogPost(params.slug)

  if (!blog) {
    notFound()
  }

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors">
            <FaArrowLeft size={14} />
            <span>Back to Blog</span>
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              {blog.category}
            </span>
            {blog.readTime && (
              <span className="flex items-center gap-2 text-sm text-white/80">
                <FaClock size={14} /> {blog.readTime}
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">{blog.title}</h1>

          <div className="flex items-center gap-6 text-white/80">
            {blog.author && (
              <span className="flex items-center gap-2">
                <FaUser size={14} />
                {blog.author}
              </span>
            )}
            {blog.publishedAt && (
              <span className="flex items-center gap-2">
                <FaCalendar size={14} />
                {formatDate(blog.publishedAt)}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {blog.imageUrl && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={blog.imageUrl}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          {/* Excerpt */}
          {blog.excerpt && (
            <div className="text-xl text-gray-700 font-medium mb-8 pb-8 border-b border-gray-200">
              {blog.excerpt}
            </div>
          )}

          {/* Main Content */}
          <div
            className="prose prose-lg max-w-none
              prose-headings:font-bold prose-headings:text-gray-900
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
              prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
              prose-li:text-gray-700 prose-li:mb-2
              prose-blockquote:border-l-4 prose-blockquote:border-primary
              prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700
              prose-code:text-primary prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
              prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-6 prose-pre:rounded-xl
              prose-img:rounded-xl prose-img:shadow-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>

        {/* Back to Blog Link */}
        <div className="mt-12 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
          >
            <FaArrowLeft />
            <span>Back to All Posts</span>
          </Link>
        </div>
      </article>
    </div>
  )
}
