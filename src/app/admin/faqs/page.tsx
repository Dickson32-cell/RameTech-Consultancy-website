'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, HelpCircle, Search, Loader2, ChevronDown } from 'lucide-react'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order: number
  isActive: boolean
}

export default function FAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => { fetchFAQs() }, [])

  const fetchFAQs = async () => {
    try {
      const res = await fetch('/api/v1/admin/faqs')
      const data = await res.json()
      if (data.success) setFaqs(data.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return
    setDeleting(id)
    try {
      await fetch(`/api/v1/admin/faqs/${id}`, { method: 'DELETE' })
      setFaqs(faqs.filter(f => f.id !== id))
    } catch (e) { console.error(e) }
    setDeleting(null)
  }

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-400">Loading FAQs...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">FAQs</h1>
          <p className="text-gray-400">{filteredFaqs.length} questions</p>
        </div>
        <Link 
          href="/admin/faqs/new" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          Add FAQ
        </Link>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by question or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredFaqs.length === 0 ? (
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-12">
          <div className="flex flex-col items-center gap-3">
            <HelpCircle className="w-12 h-12 text-gray-600" />
            <p className="text-gray-400">No FAQs yet</p>
            <Link href="/admin/faqs/new" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
              Add your first FAQ <Plus className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Order</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Question</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Category</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1 text-gray-400">
                        <ChevronDown className="w-4 h-4" />
                        {faq.order}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-white font-medium max-w-md">{faq.question}</div>
                      <div className="text-gray-500 text-sm truncate max-w-md">{faq.answer}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-700 text-gray-300 text-sm px-3 py-1 rounded-lg">{faq.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      {faq.isActive ? (
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-lg">Active</span>
                      ) : (
                        <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-lg">Inactive</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/faqs/${faq.id}`}
                          className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(faq.id)}
                          disabled={deleting === faq.id}
                          className="bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
                        >
                          {deleting === faq.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
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
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="text-xs px-2 py-1 bg-slate-700 text-gray-400 rounded flex-shrink-0">
                      #{faq.order}
                    </span>
                  </div>
                  {faq.isActive ? (
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-lg flex-shrink-0">Active</span>
                  ) : (
                    <span className="bg-gray-500/20 text-gray-400 text-xs px-2 py-1 rounded-lg flex-shrink-0">Inactive</span>
                  )}
                </div>
                <h3 className="text-white font-medium mb-2">{faq.question}</h3>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{faq.answer}</p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-slate-700 text-gray-300 text-xs px-2 py-1 rounded">{faq.category}</span>
                </div>
                <div className="flex gap-2 pt-3 border-t border-slate-700">
                  <Link
                    href={`/admin/faqs/${faq.id}`}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white text-sm px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(faq.id)}
                    disabled={deleting === faq.id}
                    className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm px-3 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                  >
                    {deleting === faq.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </>
                    )}
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
