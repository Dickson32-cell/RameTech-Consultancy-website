'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'

interface PortfolioProject {
  id: string
  title: string
  slug: string
  category: string
  description: string
  imageUrl: string | null
  technologies: string[]
  clientName: string | null
  projectUrl: string | null
  order: number
  isActive: boolean
}

export default function AdminPortfolioPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<PortfolioProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [toggleId, setToggleId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchProjects()
  }, [router])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/v1/admin/portfolio')
      const data = await res.json()
      if (data.success) setProjects(data.data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleActive = async (id: string, current: boolean) => {
    setToggleId(id)
    try {
      await fetch(`/api/v1/admin/portfolio/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !current })
      })
      fetchProjects()
    } catch (e) { console.error(e) }
    setToggleId(null)
  }

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return
    setDeleteId(id)
    try {
      await fetch(`/api/v1/admin/portfolio/${id}`, { method: 'DELETE' })
      setProjects(projects.filter(p => p.id !== id))
    } catch (e) { console.error(e) }
    setDeleteId(null)
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
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Portfolio</h1>
          <p className="text-gray-500 mt-1">{projects.length} projects</p>
        </div>
        <Link href="/admin/portfolio/new" className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark">
          <FaPlus /> Add Project
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-500">{project.order}</td>
                <td className="px-6 py-4">
                  {project.imageUrl ? (
                    <img src={project.imageUrl} alt={project.title} className="w-16 h-12 object-cover rounded-lg" />
                  ) : (
                    <div className="w-16 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs">No img</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{project.title}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{project.category}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleActive(project.id, project.isActive)}
                    disabled={toggleId === project.id}
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      project.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {project.isActive ? <FaCheck size={10} /> : <FaTimes size={10} />}
                    {project.isActive ? 'Active' : 'Inactive'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/portfolio/${project.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => deleteProject(project.id)}
                      disabled={deleteId === project.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {projects.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No projects yet. <Link href="/admin/portfolio/new" className="text-primary hover:underline">Add one</Link>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
