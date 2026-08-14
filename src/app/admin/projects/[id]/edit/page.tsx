'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaTimes } from 'react-icons/fa'

interface Department { id: string; name: string }
interface SubDepartment { id: string; name: string }

export default function EditProjectPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState('')
  const [departments, setDepartments] = useState<Department[]>([])
  const [subDepartments, setSubDepartments] = useState<SubDepartment[]>([])
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)

  const [formData, setFormData] = useState({
    departmentId: '',
    subDepartmentId: '',
    title: '',
    slug: '',
    description: '',
    imageUrl: '',
    videoUrl: '',
    technologies: '',
    clientName: '',
    projectUrl: '',
    completedDate: '',
    order: 0,
    isActive: true
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchProject()
    fetchDepartments()
  }, [router, projectId])

  useEffect(() => {
    if (formData.departmentId) {
      fetchSubDepartments(formData.departmentId)
    }
  }, [formData.departmentId])

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/v1/admin/department-projects/${projectId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success && result.data) {
        const p = result.data
        setFormData({
          departmentId: p.departmentId || '',
          subDepartmentId: p.subDepartmentId || '',
          title: p.title || '',
          slug: p.slug || '',
          description: p.description || '',
          imageUrl: p.imageUrl || '',
          videoUrl: p.videoUrl || '',
          technologies: p.technologies?.join(', ') || '',
          clientName: p.clientName || '',
          projectUrl: p.projectUrl || '',
          completedDate: p.completedDate ? new Date(p.completedDate).toISOString().split('T')[0] : '',
          order: p.order || 0,
          isActive: p.isActive
        })
      } else {
        setError('Project not found')
      }
    } catch (err) {
      setError('Failed to load project')
    } finally {
      setFetching(false)
    }
  }

  const fetchDepartments = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/departments', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.success) setDepartments(result.data || [])
    } catch (err) { console.error('Error fetching departments:', err) }
  }

  const fetchSubDepartments = async (departmentId: string) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/subdepartments?departmentId=${departmentId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.success) setSubDepartments(result.data || [])
    } catch (err) { console.error('Error fetching sub-departments:', err) }
  }

  const generateSlug = (title: string) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value
    setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }))
  }

  // ─── Image Upload ───
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingImage(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/v1/upload/department-project', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, imageUrl: data.url }))
      } else {
        setError(data.error || 'Image upload failed')
      }
    } catch {
      setError('Image upload failed. Please try again.')
    } finally {
      setUploadingImage(false)
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: '' }))
    if (imageInputRef.current) imageInputRef.current.value = ''
  }

  // ─── Video Upload ───
  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingVideo(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/v1/upload/department-project-video', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success && data.url) {
        setFormData(prev => ({ ...prev, videoUrl: data.url }))
      } else {
        setError(data.error || 'Video upload failed')
      }
    } catch {
      setError('Video upload failed. Please try again.')
    } finally {
      setUploadingVideo(false)
    }
  }

  const removeVideo = () => {
    setFormData(prev => ({ ...prev, videoUrl: '' }))
    if (videoInputRef.current) videoInputRef.current.value = ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      if (!token) { router.push('/admin/login'); return }

      const submitData = {
        ...formData,
        technologies: formData.technologies ? formData.technologies.split(',').map(t => t.trim()) : [],
        completedDate: formData.completedDate || null,
        subDepartmentId: formData.subDepartmentId || null,
        imageUrl: formData.imageUrl || null,
        videoUrl: formData.videoUrl || null
      }

      const response = await fetch(`/api/v1/admin/department-projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/admin/departments/${formData.departmentId}`)
      } else {
        setError(result.error || 'Failed to update project')
      }
    } catch (err) {
      setError('An error occurred while updating the project')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  const labelClass = "block text-sm font-medium text-gray-700 mb-2"

  if (fetching) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href={formData.departmentId ? `/admin/departments/${formData.departmentId}` : '/admin/departments'} className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-2">
          <FaArrowLeft /> Back
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Project</h1>

        {error && <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="departmentId" className={labelClass}>Department *</label>
            <select id="departmentId" value={formData.departmentId} onChange={(e) => setFormData({ ...formData, departmentId: e.target.value, subDepartmentId: '' })} required className={inputClass}>
              <option value="">Select Department</option>
              {departments.map((dept) => <option key={dept.id} value={dept.id}>{dept.name}</option>)}
            </select>
          </div>

          {formData.departmentId && subDepartments.length > 0 && (
            <div>
              <label htmlFor="subDepartmentId" className={labelClass}>Sub-Department (Optional)</label>
              <select id="subDepartmentId" value={formData.subDepartmentId} onChange={(e) => setFormData({ ...formData, subDepartmentId: e.target.value })} className={inputClass}>
                <option value="">None</option>
                {subDepartments.map((subDept) => <option key={subDept.id} value={subDept.id}>{subDept.name}</option>)}
              </select>
            </div>
          )}

          <div>
            <label htmlFor="title" className={labelClass}>Project Title *</label>
            <input type="text" id="title" value={formData.title} onChange={handleTitleChange} required className={inputClass} />
          </div>

          <div>
            <label htmlFor="slug" className={labelClass}>Slug *</label>
            <input type="text" id="slug" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} required className={inputClass} />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description *</label>
            <textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={6} className={inputClass} />
          </div>

          {/* ─── Image Upload ─── */}
          <div>
            <label className={labelClass}>Project Image</label>
            {formData.imageUrl ? (
              <div className="relative w-full max-w-md">
                <img src={formData.imageUrl} alt="Project preview" className="w-full h-48 object-cover rounded-lg border border-gray-200" />
                <button type="button" onClick={removeImage} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors ${uploadingImage ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  <span className="text-sm text-gray-500">{uploadingImage ? 'Uploading...' : 'Click to upload image'}</span>
                  <span className="text-xs text-gray-400">JPEG, PNG, GIF, WebP (max 5MB)</span>
                </div>
                <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          {/* ─── Video Upload ─── */}
          <div>
            <label className={labelClass}>Project Video</label>
            {formData.videoUrl ? (
              <div className="relative w-full max-w-md">
                <video src={formData.videoUrl} controls className="w-full h-48 object-cover rounded-lg border border-gray-200" />
                <button type="button" onClick={removeVideo} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors ${uploadingVideo ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="flex flex-col items-center gap-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  <span className="text-sm text-gray-500">{uploadingVideo ? 'Uploading...' : 'Click to upload video'}</span>
                  <span className="text-xs text-gray-400">MP4, WebM, OGG, MOV (max 50MB)</span>
                </div>
                <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/ogg,video/quicktime" onChange={handleVideoChange} className="hidden" />
              </label>
            )}
          </div>

          <div>
            <label htmlFor="technologies" className={labelClass}>Technologies <span className="text-gray-500 text-xs">(comma-separated)</span></label>
            <input type="text" id="technologies" value={formData.technologies} onChange={(e) => setFormData({ ...formData, technologies: e.target.value })} className={inputClass} placeholder="e.g., React, Node.js, MongoDB" />
          </div>

          <div>
            <label htmlFor="clientName" className={labelClass}>Client Name</label>
            <input type="text" id="clientName" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label htmlFor="projectUrl" className={labelClass}>Project URL (Live Link)</label>
            <input type="url" id="projectUrl" value={formData.projectUrl} onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })} className={inputClass} placeholder="https://..." />
          </div>

          <div>
            <label htmlFor="completedDate" className={labelClass}>Completion Date</label>
            <input type="date" id="completedDate" value={formData.completedDate} onChange={(e) => setFormData({ ...formData, completedDate: e.target.value })} className={inputClass} />
          </div>

          <div>
            <label htmlFor="order" className={labelClass}>Display Order</label>
            <input type="number" id="order" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} className={inputClass} min="0" />
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">Active (visible to public)</label>
          </div>

          <div className="flex gap-4">
            <button type="submit" disabled={loading} className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition">
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href={formData.departmentId ? `/admin/departments/${formData.departmentId}` : '/admin/departments'} className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition text-center">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}