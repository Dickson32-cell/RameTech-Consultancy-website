'use client'

import { useState, useEffect } from 'react'
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaMailBulk, FaFilter } from 'react-icons/fa'

interface Message {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  isRead: boolean
  createdAt: string
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [updating, setUpdating] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => { fetchMessages() }, [])

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/v1/admin/messages')
      const data = await res.json()
      if (data.success) setMessages(data.data)
    } catch (e) { console.error(e) }
    setLoading(false)
  }

  const markAsRead = async (id: string) => {
    setUpdating(id)
    try {
      await fetch(`/api/v1/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isRead: true })
      })
      fetchMessages()
    } catch (e) { console.error(e) }
    setUpdating(null)
  }

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return
    setDeleting(id)
    try {
      await fetch(`/api/v1/admin/messages/${id}`, {
        method: 'DELETE'
      })
      setMessages(messages.filter(m => m.id !== id))
    } catch (e) { console.error(e) }
    setDeleting(null)
  }

  const filtered = filter === 'unread' ? messages.filter(m => !m.isRead) : messages
  const unreadCount = messages.filter(m => !m.isRead).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 text-sm mt-1">
            {unreadCount} unread · {messages.length} total
          </p>
        </div>
        <div className="flex bg-gray-200 rounded-lg p-1">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              filter === 'all' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaMailBulk /> All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${
              filter === 'unread' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <FaEnvelope /> Unread ({unreadCount})
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
            <FaMailBulk className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {filter === 'unread' ? 'No unread messages' : 'No messages yet'}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Messages from your Contact Us page will appear here
            </p>
          </div>
        )}
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white rounded-xl shadow-sm border transition-colors ${
              msg.isRead ? 'border-gray-200' : 'border-primary/30 ring-1 ring-primary/10'
            }`}
          >
            <div className="p-6">
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    msg.isRead ? 'bg-gray-100' : 'bg-primary/10'
                  }`}>
                    {msg.isRead ? (
                      <FaEnvelopeOpen className="text-gray-400" />
                    ) : (
                      <FaEnvelope className="text-primary" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{msg.name}</h3>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full font-medium">New</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{msg.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric'
                    })}
                  </span>
                  {!msg.isRead && (
                    <button
                      onClick={() => markAsRead(msg.id)}
                      disabled={updating === msg.id}
                      className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors disabled:opacity-50"
                    >
                      Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => deleteMessage(msg.id)}
                    disabled={deleting === msg.id}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              </div>

              {/* Subject */}
              {msg.subject && (
                <p className="text-sm font-medium text-gray-800 mb-2">
                  Subject: {msg.subject}
                </p>
              )}

              {/* Message Body */}
              <p className="text-gray-600 text-sm whitespace-pre-wrap">{msg.message}</p>

              {/* Phone & Actions */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                {msg.phone ? (
                  <p className="text-sm text-gray-500">Phone: {msg.phone}</p>
                ) : <span />}
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${msg.email}?subject=Re: ${msg.subject || 'Your message'}`}
                    className="text-xs px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                  >
                    Reply via Email
                  </a>
                  {msg.phone && (
                    <a
                      href={`tel:${msg.phone}`}
                      className="text-xs px-3 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors"
                    >
                      Call {msg.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
