'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaUpload, FaTimes } from 'react-icons/fa'

interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  email: string
  phone: string | null
  photoUrl: string | null
  order: number
  isActive: boolean
}

export default function EditTeamMemberPage() {
  const router = useRouter()
  const params = useParams()
  const memberId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    email: '',
    phone: '',
    photoUrl: '',
    order: 0,
    isActive: true
  })
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch(`/api/v1/admin/team/${memberId}`, {
        })
        const data = await res.json()

        if (!data.success) {
          setError(data.error || 'Team member not found')
          return
        }

        const member: TeamMember = data.data
        setFormData({
          name: member.name,
          role: member.role,
          bio: member.bio,
          email: member.email,
          phone: member.phone || '',
          photoUrl: member.photoUrl || '',
          order: member.order,
          isActive: member.isActive
        })
      } catch {
        setError('Failed to load team member')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMember()
  }, [memberId])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    setError('')

    try {
      const fd = new FormData()
      fd.append('file', file)
      if (formData.photoUrl) fd.append('existingUrl', formData.photoUrl)

      const res = await fetch('/api/v1/upload/team', { method: 'POST', body: fd })
      const data = await res.json()

      if (data.success && data.url) {
        setFormData({ ...formData, photoUrl: data.url })
      } else {
        setError(data.error || 'Upload failed')
      }
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const removePhoto = () => {
    setFormData({ ...formData, photoUrl: '' })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSaving(true)

    try {
      const res = await fetch(`/api/v1/admin/team/${memberId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: formData.phone || null,
          photoUrl: formData.photoUrl || null
        })
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Failed to update team member')
        setIsSaving(false)
        return
      }

      router.push('/admin/team')
    } catch {
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
        <Link href="/admin/team" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-4">
          <FaArrowLeft /> Back to Team
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Team Member</h1>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
              <input type="text" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
            <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Photo Upload */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Photo</label>

              {formData.photoUrl ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-200">
                  <img src={formData.photoUrl} alt="Team member" className="w-full h-full object-cover" />
                  <button type="button" onClick={removePhoto} className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow">
                    <FaTimes size={12} />
                  </button>
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded hover:bg-black/80 transition-colors">
                    Change
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileChange} className="hidden" />
                </div>
              ) : (
                <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary hover:bg-gray-50 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <FaUpload className="text-gray-400 mb-2" size={24} />
                  <span className="text-sm text-gray-500">{uploading ? 'Uploading...' : 'Click to upload'}</span>
                  <span className="text-xs text-gray-400 mt-1">JPG, PNG, GIF, WebP (max 5MB)</span>
                  <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/gif,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })} min={0} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none" />
            </div>

            <div className="flex items-center gap-3 pt-8">
              <input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-5 h-5 text-primary border-gray-300 rounded focus:ring-primary" />
              <label htmlFor="isActive" className="text-sm font-medium text-gray-700">Active</label>
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button type="submit" disabled={isSaving} className="px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primaryDark transition-colors disabled:opacity-50">
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
            <Link href="/admin/team" className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">Cancel</Link>
          </div>
        </form>
      </div>
    </div>
  )
}
