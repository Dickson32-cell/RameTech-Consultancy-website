'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaUpload, FaTimes } from 'react-icons/fa'

const CATEGORIES = ['Technology', 'Business', 'Design', 'Marketing', 'AI & ML', 'Development', 'News', 'Updates']

export default function NewBlogPostPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'Technology',
    imageUrl: '',
    author: '',
    readTime: '',
    isPublished: false,
    isFeatured: false
  })

  // Auto-generate slug from title
  const handleTitleChange = (title: string) => {
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    setFormData({ ...formData, title, slug })
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/v1/upload/blog', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success && data.url) {
        setFormData({ ...formData, imageUrl: data.url })
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: '' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const res = await fetch('/api/v1/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Failed to create blog post')
        setIsLoading(false)
        return
      }
      router.push('/admin/blogs')
    } catch {
      setError('An error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/blogs" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4">
          <FaArrowLeft /> Back to Blog
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">New Blog Post</h1>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{error}</div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input type="text" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Your blog post title" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug *</label>
              <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-sm" placeholder="auto-generated-from-title" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt *</label>
              <textarea value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })} required rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" placeholder="Brief description for the blog card..." />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
              <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} required rows={10} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none font-mono text-sm" placeholder="Full blog post content (supports HTML)..." />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Author</label>
              <input type="text" value={formData.author} onChange={(e) => setFormData({ ...formData, author: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="Author name" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Read Time</label>
              <input type="text" value={formData.readTime} onChange={(e) => setFormData({ ...formData, readTime: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="e.g., 5 min" />
            </div>

            {/* Cover Image */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
              {formData.imageUrl ? (
                <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img src={formData.imageUrl} alt="Cover" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow">
                    <FaTimes size={12} />
                  </button>
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <FaUpload className="text-gray-400 mb-2" size={24} />
                  <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Click to upload cover image'}</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG (max 5MB)</span>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            {/* Video/Audio Links */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Video URL (YouTube, Vimeo, etc.)</label>
              <input type="url" value={formData.content.includes('videoUrl') ? '' : ''} onChange={(e) => {
                // Store in a separate field approach - add as embed in content
              }} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="https://youtube.com/watch?v=..." />
              <p className="text-xs text-gray-500 mt-1">Add video links in the content field using iframe or video tags</p>
            </div>

            <div className="md:col-span-2 flex items-center gap-6 pt-2">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isPublished" checked={formData.isPublished} onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })} className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="isPublished" className="text-sm font-medium text-gray-700">Published</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="isFeatured" checked={formData.isFeatured} onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })} className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
                <label htmlFor="isFeatured" className="text-sm font-medium text-gray-700">Featured</label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="submit" disabled={isLoading} className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primaryDark transition-colors disabled:opacity-50">
              {isLoading ? 'Creating...' : 'Create Blog Post'}
            </button>
            <Link href="/admin/blogs" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
