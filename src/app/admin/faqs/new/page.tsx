'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewFAQPage() {
  const router = useRouter()
  const [form, setForm] = useState({ question: '', answer: '', category: 'general', order: 0, isActive: true })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/v1/admin/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    router.push('/admin/faqs')
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Add New FAQ</h1>
      <form onSubmit={handleSubmit} className="bg-slate-800 rounded-xl border border-slate-700 p-6 space-y-4 max-w-2xl">
        <div>
          <label className="block text-gray-300 mb-1 text-sm">Question *</label>
          <input type="text" required value={form.question} onChange={e => setForm({ ...form, question: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:border-blue-500" />
        </div>
        <div>
          <label className="block text-gray-300 mb-1 text-sm">Answer *</label>
          <textarea required rows={4} value={form.answer} onChange={e => setForm({ ...form, answer: e.target.value })}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2 focus:border-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Category</label>
            <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2" />
          </div>
          <div>
            <label className="block text-gray-300 mb-1 text-sm">Order</label>
            <input type="number" value={form.order} onChange={e => setForm({ ...form, order: Number(e.target.value) })}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-lg px-4 py-2" />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="isActive" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })}
            className="w-4 h-4 rounded" />
          <label htmlFor="isActive" className="text-gray-300">Active</label>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg disabled:opacity-50">
            {loading ? 'Saving...' : 'Save FAQ'}
          </button>
          <a href="/admin/faqs" className="bg-slate-700 hover:bg-slate-600 text-white px-6 py-2 rounded-lg">Cancel</a>
        </div>
      </form>
    </div>
  )
}
