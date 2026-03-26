'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaImage } from 'react-icons/fa'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  imageUrl: string | null
  author: string | null
  readTime: string | null
  isPublished: boolean
  isFeatured: boolean
  createdAt: string
}

export default function AdminBlogsPage() {
  const router = useRouter()
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/admin/login'); return }
    fetchBlogs()
  }, [router])

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/api/v1/admin/blogs')
      const data = await res.json()
      if (data.success) setBlogs(data.data)
    } catch (error) {
      console.error('Error fetching blogs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog post?')) return
    try {
      const res = await fetch(`/api/v1/admin/blogs/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) setBlogs(blogs.filter(b => b.id !== id))
      else alert(data.error || 'Failed to delete')
    } catch {
      alert('Failed to delete blog post')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Blog Posts</h1>
          <p className="text-gray-600 mt-1">Manage your blog content</p>
        </div>
        <Link href="/admin/blogs/new" className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors whitespace-nowrap">
          <FaPlus /> Add Blog Post
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 mb-4">No blog posts yet. Create your first post!</p>
          <Link href="/admin/blogs/new" className="btn-primary">Add Blog Post</Link>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Image</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Title</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Author</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      {blog.imageUrl ? (
                        <img src={blog.imageUrl} alt={blog.title} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FaImage className="text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{blog.title}</div>
                      <div className="text-sm text-gray-500">/{blog.slug}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{blog.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{blog.author || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {blog.isPublished ? (
                          <span className="inline-flex items-center gap-1 text-green-600 text-sm">
                            <FaCheck className="w-4 h-4" /> Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-gray-400 text-sm">
                            <FaTimes className="w-4 h-4" /> Draft
                          </span>
                        )}
                        {blog.isFeatured && (
                          <span className="inline-flex items-center gap-1 text-yellow-600 text-xs">
                            ★ Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blogs/${blog.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <FaEdit />
                        </Link>
                        <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex gap-4">
                  {blog.imageUrl ? (
                    <img src={blog.imageUrl} alt={blog.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
                  ) : (
                    <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <FaImage className="text-gray-400 text-xl" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{blog.title}</h3>
                    <p className="text-sm text-gray-500 truncate">/{blog.slug}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">{blog.category}</span>
                      {blog.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-green-600 text-xs">
                          <FaCheck className="w-3 h-3" /> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-gray-400 text-xs">
                          <FaTimes className="w-3 h-3" /> Draft
                        </span>
                      )}
                      {blog.isFeatured && (
                        <span className="text-yellow-600 text-xs">★ Featured</span>
                      )}
                    </div>
                  </div>
                </div>
                {blog.author && (
                  <div className="text-sm text-gray-500 mt-3">
                    Author: {blog.author}
                  </div>
                )}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Link href={`/admin/blogs/${blog.id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <FaEdit /> Edit
                  </Link>
                  <button onClick={() => handleDelete(blog.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
