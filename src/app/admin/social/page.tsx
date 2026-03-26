'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa'

interface SocialMedia {
  id: string
  name: string
  url: string
  icon: string
  order: number
  isActive: boolean
}

const iconOptions = [
  { value: 'FaLinkedin', label: 'LinkedIn' },
  { value: 'FaTwitter', label: 'Twitter' },
  { value: 'FaFacebook', label: 'Facebook' },
  { value: 'FaInstagram', label: 'Instagram' },
  { value: 'FaYoutube', label: 'YouTube' },
  { value: 'FaGithub', label: 'GitHub' },
  { value: 'FaWhatsapp', label: 'WhatsApp' },
]

export default function AdminSocialPage() {
  const router = useRouter()
  const [socials, setSocials] = useState<SocialMedia[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', url: '', icon: 'FaLinkedin' })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchSocials()
  }, [router])

  const fetchSocials = async () => {
    try {
      const res = await fetch('/api/v1/admin/social')
      const data = await res.json()
      if (data.success) setSocials(data.data)
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/v1/admin/social', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        setSocials([...socials, data.data])
        setShowForm(false)
        setFormData({ name: '', url: '', icon: 'FaLinkedin' })
      }
    } catch (e) { console.error(e) }
  }

  const deleteSocial = async (id: string) => {
    if (!confirm('Delete this social link?')) return
    try {
      await fetch(`/api/v1/admin/social/${id}`, { method: 'DELETE' })
      setSocials(socials.filter(s => s.id !== id))
    } catch (e) { console.error(e) }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Social Media</h1>
          <p className="text-gray-500 mt-1">Manage your social media links</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark cursor-pointer"
        >
          <FaPlus /> Add Link
        </button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">Add Social Media Link</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. LinkedIn"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="https://linkedin.com/company/..."
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  {iconOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark cursor-pointer">
                Save
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 cursor-pointer">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Social Links List */}
      {socials.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500">No social media links yet. Add one above!</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {socials.map((social) => (
                <tr key={social.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-500">{social.order}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{social.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <a href={social.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline cursor-pointer">
                      {social.url.substring(0, 40)}...
                    </a>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{social.icon}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center text-sm ${social.isActive ? 'text-green-600' : 'text-red-500'}`}>
                      {social.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/social/${social.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg cursor-pointer">
                        <FaEdit />
                      </Link>
                      <button onClick={() => deleteSocial(social.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg cursor-pointer">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
