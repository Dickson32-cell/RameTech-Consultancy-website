'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaShareAlt } from 'react-icons/fa'

interface SocialLink {
  id: string
  platform: string
  url: string
  icon: string
  order: number
  isActive: boolean
}

const PLATFORMS = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'github', label: 'GitHub' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'tiktok', label: 'TikTok' },
]

const ICONS = [
  { value: 'FaInstagram', label: 'Instagram' },
  { value: 'FaLinkedin', label: 'LinkedIn' },
  { value: 'FaTwitter', label: 'Twitter' },
  { value: 'FaFacebook', label: 'Facebook' },
  { value: 'FaYoutube', label: 'YouTube' },
  { value: 'FaGithub', label: 'GitHub' },
  { value: 'FaWhatsapp', label: 'WhatsApp' },
  { value: 'FaTiktok', label: 'TikTok' },
]

export default function AdminSocialLinksPage() {
  const router = useRouter()
  const [links, setLinks] = useState<SocialLink[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null)
  const [form, setForm] = useState({ platform: 'instagram', url: '', icon: 'FaInstagram', order: 0, isActive: true })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchLinks()
  }, [router])

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/v1/admin/social-links')
      const data = await res.json()
      if (data.success) setLinks(data.data)
    } catch (e) { console.error(e) }
    finally { setIsLoading(false) }
  }

  const openCreate = () => {
    setEditingLink(null)
    setForm({ platform: 'instagram', url: '', icon: 'FaInstagram', order: links.length + 1, isActive: true })
    setShowModal(true)
  }

  const openEdit = (link: SocialLink) => {
    setEditingLink(link)
    setForm({ platform: link.platform, url: link.url, icon: link.icon, order: link.order, isActive: link.isActive })
    setShowModal(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editingLink
        ? `/api/v1/admin/social-links/${editingLink.id}`
        : '/api/v1/admin/social-links'
      const method = editingLink ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        fetchLinks()
        setShowModal(false)
      } else {
        alert(data.error || 'Failed to save')
      }
    } catch (e) { console.error(e); alert('Failed to save') }
    setSaving(false)
  }

  const deleteLink = async (id: string) => {
    if (!confirm('Delete this social link?')) return
    try {
      await fetch(`/api/v1/admin/social-links/${id}`, { method: 'DELETE' })
      setLinks(links.filter(l => l.id !== id))
    } catch (e) { console.error(e) }
  }

  if (isLoading) return (
    <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Social Links</h1>
          <p className="text-gray-500 mt-1">{links.length} links</p>
        </div>
        <button onClick={openCreate} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors whitespace-nowrap">
          <FaPlus /> Add Link
        </button>
      </div>

      {links.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <FaShareAlt className="mx-auto text-gray-300 text-4xl mb-4" />
          <p className="text-gray-500 mb-4">No social links configured.</p>
          <button onClick={openCreate} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark">
            Add Your First Link
          </button>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Icon</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{link.order}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 capitalize font-medium text-gray-900">{link.platform}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 max-w-xs truncate">
                      <a href={link.url} target="_blank" rel="noopener noreferrer">{link.url}</a>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{link.icon}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-sm ${link.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {link.isActive ? <FaCheck /> : <FaTimes />} {link.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(link)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEdit /></button>
                        <button onClick={() => deleteLink(link.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {links.map((link) => (
              <div key={link.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <FaShareAlt className="text-primary text-xl flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 capitalize">{link.platform}</h3>
                      <p className="text-xs text-gray-400">{link.icon}</p>
                    </div>
                  </div>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded flex-shrink-0">
                    #{link.order}
                  </span>
                </div>
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 truncate block mb-3">
                  {link.url}
                </a>
                <div className="flex items-center justify-between mb-4">
                  <span className={`inline-flex items-center gap-1 text-sm ${link.isActive ? 'text-green-600' : 'text-red-500'}`}>
                    {link.isActive ? <FaCheck /> : <FaTimes />} {link.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="flex gap-2 pt-3 border-t">
                  <button onClick={() => openEdit(link)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <FaEdit /> Edit
                  </button>
                  <button onClick={() => deleteLink(link.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingLink ? 'Edit Social Link' : 'Add Social Link'}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Platform</label>
                <select
                  value={form.platform}
                  onChange={e => setForm({ ...form, platform: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  {PLATFORMS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                <input
                  type="url"
                  value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                <select
                  value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  required
                >
                  {ICONS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
                </select>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={e => setForm({ ...form, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    min="0"
                  />
                </div>
                <div className="flex-1 flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={e => setForm({ ...form, isActive: e.target.checked })}
                      className="w-4 h-4 text-primary rounded focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
