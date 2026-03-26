'use client'

import { useState, useEffect } from 'react'
import { Trash2, Mail, User, Loader2, Users, Search, Check, X } from 'lucide-react'

interface Subscriber {
  id: string
  email: string
  name: string | null
  isActive: boolean
  subscribedAt: string
  unsubscribedAt: string | null
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchSubscribers() }, [])

  const fetchSubscribers = async () => {
    try {
      const res = await fetch('/api/v1/admin/subscribers')
      const data = await res.json()
      if (data.success) setSubscribers(data.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const toggleActive = async (id: string, currentState: boolean) => {
    // Note: Need to add this endpoint
    alert('Toggle feature coming soon. The backend endpoint needs to be added.')
  }

  const deleteSubscriber = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return
    setDeleting(id)
    try {
      await fetch(`/api/v1/admin/subscribers/${id}`, { method: 'DELETE' })
      setSubscribers(subscribers.filter(s => s.id !== id))
    } catch (e) { 
      console.error(e)
      alert('Delete feature coming soon. The backend endpoint needs to be added.') 
    }
    setDeleting(null)
  }

  const filteredSubscribers = subscribers.filter(sub =>
    sub.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (sub.name && sub.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-400">Loading subscribers...</p>
        </div>
      </div>
    )
  }

  const activeCount = subscribers.filter(s => s.isActive).length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Newsletter Subscribers</h1>
          <p className="text-gray-400">{activeCount} of {subscribers.length} active</p>
        </div>
        <div className="bg-slate-800 border border-slate-700 text-gray-300 px-4 py-2 rounded-xl text-sm flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-500" />
          <span className="font-medium">{activeCount}</span> / {subscribers.length} active
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {filteredSubscribers.length === 0 ? (
        <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-12">
          <div className="flex flex-col items-center gap-3">
            <Mail className="w-12 h-12 text-gray-600" />
            <p className="text-gray-400">No subscribers found</p>
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-900/50">
                <tr>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Email</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Name</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Subscribed</th>
                  <th className="text-left px-6 py-4 text-gray-400 font-medium text-sm">Status</th>
                  <th className="text-right px-6 py-4 text-gray-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          sub.isActive ? 'bg-blue-500/10' : 'bg-slate-700'
                        }`}>
                          <Mail className={`w-5 h-5 ${sub.isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                        </div>
                        <span className="text-white font-medium">{sub.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.name ? (
                        <div className="flex items-center gap-2 text-gray-300">
                          <User className="w-4 h-4 text-gray-500" />
                          {sub.name}
                        </div>
                      ) : (
                        <span className="text-gray-600">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-gray-400">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {sub.isActive ? (
                        <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-lg flex items-center gap-1 w-fit">
                          <Check className="w-3 h-3" />
                          Active
                        </span>
                      ) : (
                        <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-lg flex items-center gap-1 w-fit">
                          <X className="w-3 h-3" />
                          Unsubscribed
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <button
                          onClick={() => deleteSubscriber(sub.id)}
                          disabled={deleting === sub.id}
                          className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deleting === sub.id ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <Trash2 className="w-5 h-5" />
                          )}
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
            {filteredSubscribers.map((sub) => (
              <div key={sub.id} className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    sub.isActive ? 'bg-blue-500/10' : 'bg-slate-700'
                  }`}>
                    <Mail className={`w-6 h-6 ${sub.isActive ? 'text-blue-400' : 'text-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{sub.email}</p>
                    {sub.name && (
                      <div className="flex items-center gap-2 text-gray-300 text-sm mt-1">
                        <User className="w-4 h-4 text-gray-500" />
                        {sub.name}
                      </div>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      {new Date(sub.subscribedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                  {sub.isActive ? (
                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Active
                    </span>
                  ) : (
                    <span className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                      <X className="w-3 h-3" />
                      Unsubscribed
                    </span>
                  )}
                  <button
                    onClick={() => deleteSubscriber(sub.id)}
                    disabled={deleting === sub.id}
                    className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {deleting === sub.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
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
