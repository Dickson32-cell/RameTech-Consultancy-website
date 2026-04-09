'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'

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

export default function AdminTeamPage() {
  const router = useRouter()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchMembers()
  }, [router])

  const fetchMembers = async () => {
    try {
      console.log('Fetching team members...')
      const token = localStorage.getItem('admin_token')
      const res = await fetch(`/api/v1/admin/team?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      })
      const data = await res.json()
      console.log('Team API response:', data)
      if (data.success) {
        setMembers(data.data || [])
        console.log('Team members loaded:', data.data?.length || 0)
      } else {
        console.error('Team API error:', data.error)
        alert(`Failed to load team members: ${data.error || 'Unknown error'}`)
      }
    } catch (e: any) {
      console.error('Team fetch error:', e)
      alert(`Error loading team: ${e.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMember = async (id: string) => {
    if (!confirm('Delete this team member?')) return
    setDeleteId(id)
    try {
      await fetch(`/api/v1/admin/team/${id}`, { method: 'DELETE' })
      setMembers(members.filter(m => m.id !== id))
    } catch (e) { console.error(e) }
    setDeleteId(null)
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500 mt-1">{members.length} members</p>
        </div>
        <Link href="/admin/team/new" className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark whitespace-nowrap">
          <FaPlus /> Add Member
        </Link>
      </div>

      {members.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500">No team members yet.</p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Photo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {members.map((member) => (
                  <tr key={member.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-500">{member.order}</td>
                    <td className="px-6 py-4">
                      {member.photoUrl ? (
                        <img src={member.photoUrl} alt={member.name} className="w-12 h-12 object-cover rounded-full" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-gray-400 text-sm">{member.name[0]}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{member.name}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{member.role}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{member.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 text-sm ${member.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {member.isActive ? <FaCheck /> : <FaTimes />} {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/team/${member.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEdit /></Link>
                        <button onClick={() => deleteMember(member.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {members.map((member) => (
              <div key={member.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex gap-4">
                  {member.photoUrl ? (
                    <img src={member.photoUrl} alt={member.name} className="w-16 h-16 object-cover rounded-full flex-shrink-0" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-gray-400 text-lg font-medium">{member.name[0]}</span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900">{member.name}</h3>
                    <p className="text-sm text-gray-600">{member.role}</p>
                    <p className="text-sm text-gray-500 truncate">{member.email}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">Order: {member.order}</span>
                      <span className={`inline-flex items-center gap-1 text-xs ${member.isActive ? 'text-green-600' : 'text-red-500'}`}>
                        {member.isActive ? <FaCheck /> : <FaTimes />} {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Link href={`/admin/team/${member.id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    <FaEdit /> Edit
                  </Link>
                  <button onClick={() => deleteMember(member.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50">
                    <FaTrash /> Delete
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
