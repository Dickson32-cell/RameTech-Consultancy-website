'use client'

import { useState, useEffect } from 'react'
import { Plus, Trash2, Mail, Phone, User, Loader2, MailOpen, Calendar, Briefcase } from 'lucide-react'

interface Lead {
  id: string
  name: string
  email: string
  phone: string | null
  service: string
  status: string
  createdAt: string
  source: string
  type: 'quote' | 'chatbot'
  projectDescription?: string
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'quote' | 'chatbot'>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchLeads() }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/v1/admin/leads')
      const data = await res.json()
      if (data.success) setLeads(data.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const updateStatus = async (id: string, status: string) => {
    setUpdating(id)
    try {
      await fetch(`/api/v1/admin/leads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      })
      fetchLeads()
    } catch (e) { console.error(e) }
    setUpdating(null)
  }

  const deleteLead = async (id: string) => {
    if (!confirm('Delete this lead?')) return
    setDeleting(id)
    try {
      await fetch(`/api/v1/admin/leads/${id}`, { method: 'DELETE' })
      setLeads(leads.filter(l => l.id !== id))
    } catch (e) { console.error(e) }
    setDeleting(null)
  }

  const filteredLeads = filter === 'all' ? leads : leads.filter(l => l.type === filter)

  const statusColors: Record<string, string> = {
    new: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
    pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
    contacted: 'bg-violet-500/20 text-violet-400 border border-violet-500/30',
    qualified: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
    lost: 'bg-red-500/20 text-red-400 border border-red-500/30',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          <p className="text-gray-400">Loading leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Leads</h1>
          <p className="text-gray-400">{filteredLeads.length} total leads</p>
        </div>
        <div className="flex gap-2">
          {(['all', 'quote', 'chatbot'] as const).map(f => (
            <button 
              key={f} 
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                filter === f 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'bg-slate-700 text-gray-400 hover:text-white'
              }`}
            >
              {f === 'all' ? 'All' : f === 'quote' ? 'Quote Requests' : 'Chatbot Leads'}
            </button>
          ))}
        </div>
      </div>

      {/* Leads Grid */}
      <div className="grid gap-4">
        {filteredLeads.length === 0 && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <User className="w-12 h-12 text-gray-600" />
              <p className="text-gray-400">No leads found</p>
            </div>
          </div>
        )}
        {filteredLeads.map((lead) => (
          <div 
            key={`${lead.type}-${lead.id}`} 
            className={`bg-slate-800/80 backdrop-blur border rounded-xl p-5 transition-colors ${
              lead.status === 'new' ? 'border-blue-500/30' : 'border-slate-700'
            }`}
          >
            {/* Header Row */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{lead.name}</h3>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <Mail className="w-4 h-4" />
                    {lead.email}
                  </p>
                </div>
                <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                  lead.type === 'quote' 
                    ? 'bg-violet-500/20 text-violet-400' 
                    : 'bg-cyan-500/20 text-cyan-400'
                }`}>
                  {lead.type === 'quote' ? 'Quote' : 'Chatbot'}
                </span>
              </div>
              
              {/* Actions */}
              <div className="flex items-center gap-2">
                <select 
                  value={lead.status} 
                  onChange={e => updateStatus(lead.id, e.target.value)}
                  disabled={updating === lead.id}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium border-0 cursor-pointer disabled:opacity-50 ${statusColors[lead.status] || statusColors.new}`}
                >
                  <option value="new">New</option>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="lost">Lost</option>
                </select>
                <button 
                  onClick={() => deleteLead(lead.id)} 
                  disabled={deleting === lead.id}
                  className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors disabled:opacity-50"
                >
                  {deleting === lead.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {lead.phone && (
                <div className="flex items-center gap-2 text-gray-400">
                  <Phone className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-300">{lead.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-gray-400">
                <Briefcase className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">{lead.service}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-gray-300">{new Date(lead.createdAt).toLocaleDateString()}</span>
              </div>
              {lead.projectDescription && (
                <div className="col-span-2 md:col-span-4">
                  <span className="text-gray-500">Project: </span>
                  <span className="text-gray-300">{lead.projectDescription}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
