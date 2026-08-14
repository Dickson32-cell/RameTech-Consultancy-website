'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaEye, FaImage, FaVideo } from 'react-icons/fa'

interface Project {
  id: string
  title: string
  slug: string
  description: string
  imageUrl: string | null
  videoUrl: string | null
  technologies: string[]
  clientName: string | null
  projectUrl: string | null
  order: number
  isActive: boolean
  department: { id: string; name: string } | null
  subDepartment: { id: string; name: string } | null
}

export default function ProjectsListPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/v1/admin/department-projects', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await res.json()
      if (result.success) {
        setProjects(result.data || [])
      } else {
        setError(result.error || 'Failed to load projects')
      }
    } catch (err) {
      setError('Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    try {
      const token = localStorage.getItem('admin_token')
      await fetch(`/api/v1/admin/department-projects/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      fetchProjects()
    } catch (err) {
      alert('Failed to delete project')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Projects &amp; Works</h1>
          <p className="text-gray-600 mt-1">Upload images and videos for department projects — visible on the public website</p>
        </div>
        <a
          href="/admin/projects/new"
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition no-underline"
          style={{ display: 'inline-flex', textDecoration: 'none', backgroundColor: '#7B2D8E', color: 'white', padding: '8px 16px', borderRadius: '8px', fontWeight: 600 }}
        >
          <FaPlus className="mr-2" />
          Add Project
        </a>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Projects</div>
          <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Active</div>
          <div className="text-2xl font-bold text-green-600">{projects.filter(p => p.isActive).length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">With Images</div>
          <div className="text-2xl font-bold text-blue-600">{projects.filter(p => p.imageUrl).length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">With Videos</div>
          <div className="text-2xl font-bold text-purple-600">{projects.filter(p => p.videoUrl).length}</div>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
              {/* Preview */}
              <div className="h-40 bg-gray-100 relative">
                {project.imageUrl ? (
                  <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
                ) : project.videoUrl ? (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <video src={project.videoUrl} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <FaImage className="w-10 h-10 mb-2" />
                    <span className="text-sm">No media uploaded</span>
                  </div>
                )}
                {/* Status badge */}
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${project.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {project.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                {/* Media type badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {project.imageUrl && (
                    <span className="bg-blue-500 text-white p-1.5 rounded-full" title="Has image">
                      <FaImage className="w-3 h-3" />
                    </span>
                  )}
                  {project.videoUrl && (
                    <span className="bg-purple-500 text-white p-1.5 rounded-full" title="Has video">
                      <FaVideo className="w-3 h-3" />
                    </span>
                  )}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                <p className="text-xs text-gray-500 mb-2">/{project.slug}</p>
                {project.department && (
                  <p className="text-sm text-blue-600 mb-2">{project.department.name}</p>
                )}
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{project.description}</p>

                {/* Technologies */}
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{tech}</span>
                    ))}
                    {project.technologies.length > 3 && (
                      <span className="px-2 py-0.5 text-gray-400 text-xs">+{project.technologies.length - 3} more</span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700 transition"
                  >
                    <FaEdit className="w-3 h-3" />
                    Edit
                  </Link>
                  {project.department && (
                    <Link
                      href={`/admin/departments/${project.department.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition"
                    >
                      <FaEye className="w-3 h-3" />
                      Department
                    </Link>
                  )}
                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200 transition ml-auto"
                  >
                    <FaTrash className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              <FaImage className="w-8 h-8 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">No projects yet</h3>
              <p className="text-gray-500 mt-1">Add your first project with images and videos to showcase your work.</p>
            </div>
            <a
              href="/admin/projects/new"
              className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition no-underline"
              style={{ display: 'inline-flex', textDecoration: 'none', backgroundColor: '#7B2D8E', color: 'white', padding: '12px 24px', borderRadius: '8px', fontWeight: 600 }}
            >
              <FaPlus className="mr-2" />
              Add Your First Project
            </a>
          </div>
        </div>
      )}
    </div>
  )
}