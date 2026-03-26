'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaUpload, FaTimes } from 'react-icons/fa'

const CATEGORIES = [
  'Web Development',
  'Mobile Development',
  'Graphic Design',
  'Hardware & IT',
  'Cloud Services',
  'Database Solutions',
  'Other'
]

interface PortfolioProject {
  id: string
  title: string
  slug: string
  category: string
  description: string
  imageUrl: string | null
  technologies: string[]
  clientName: string | null
  projectUrl: string | null
  order: number
  isActive: boolean
}

export default function EditPortfolioPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: 'Web Development',
    description: '',
    imageUrl: '',
    technologies: '',
    clientName: '',
    projectUrl: '',
    order: 0,
    isActive: true
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/v1/admin/portfolio/${projectId}`, {
        })
        const data = await res.json()

        if (!data.success) {
          setError(data.error || 'Project not found')
          return
        }

        const project: PortfolioProject = data.data
        setFormData({
          title: project.title,
          slug: project.slug,
          category: project.category,
          description: project.description,
          imageUrl: project.imageUrl || '',
          technologies: project.technologies?.join(', ') || '',
          clientName: project.clientName || '',
          projectUrl: project.projectUrl || '',
          order: project.order,
          isActive: project.isActive
        })
      } catch (err) {
        setError('Failed to load project')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [projectId])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/v1/upload/portfolio', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success && data.url) setFormData({ ...formData, imageUrl: data.url })
      else setError(data.error || 'Upload failed')
    } catch { setError('Upload failed. Please try again.') }
    finally { setUploading(false) }
  }

  const removeImage = () => {
    setFormData({ ...formData, imageUrl: '' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      const res = await fetch(`/api/v1/admin/portfolio/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          technologies: formData.technologies.split(',').map(t => t.trim()).filter(Boolean),
          imageUrl: formData.imageUrl || null,
          clientName: formData.clientName || null,
          projectUrl: formData.projectUrl || null
        })
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Failed to update project')
        setIsSaving(false)
        return
      }

      router.push('/admin/portfolio')
    } catch (err) {
      setError('An error occurred. Please try again.')
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link
          href="/admin/portfolio"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4"
        >
          <FaArrowLeft /> Back to Portfolio
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
      </div>

      {error && !isLoading && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Order
              </label>
              <input
                type="number"
                value={formData.order}
                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                min={0}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project Image
              </label>
              {formData.imageUrl ? (
                <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img src={formData.imageUrl} alt="Project" className="w-full h-full object-cover" />
                  <button type="button" onClick={removeImage} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 shadow">
                    <FaTimes size={12} />
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded hover:bg-black/80">
                    Change
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileChange} className="hidden" />
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full max-w-md h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <FaUpload className="text-gray-400 mb-2" size={24} />
                  <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Click to upload image'}</span>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Project URL
              </label>
              <input
                type="url"
                value={formData.projectUrl}
                onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Client Name
              </label>
              <input
                type="text"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Technologies
              </label>
              <input
                type="text"
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                placeholder="React, Node.js, PostgreSQL"
              />
              <p className="text-xs text-gray-500 mt-1">Separate technologies with commas</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primaryDark transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link
              href="/admin/portfolio"
              className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
