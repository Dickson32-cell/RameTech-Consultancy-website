'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaExternalLinkAlt, FaCheck, FaTimes, FaStar } from 'react-icons/fa'

interface Publication {
  id: string
  title: string
  type: string
  description: string | null
  url: string
  authors: string[]
  publicationDate: string | null
  doi: string | null
  journal: string | null
  tags: string[]
  thumbnailUrl: string | null
  pdfUrl: string | null
  isFeatured: boolean
  order: number
  isActive: boolean
}

export default function PublicationsPage() {
  const router = useRouter()
  const [publications, setPublications] = useState<Publication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchPublications()
  }, [router])

  const fetchPublications = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/publications', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setPublications(result.data)
      } else {
        setError(result.error || 'Failed to fetch publications')
      }
    } catch (err) {
      setError('An error occurred while fetching publications')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/publications/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      const result = await response.json()

      if (result.success) {
        fetchPublications()
      } else {
        alert(result.error || 'Failed to update publication status')
      }
    } catch (err) {
      alert('An error occurred while updating publication status')
      console.error(err)
    }
  }

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/publications/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isFeatured: !currentStatus })
      })

      const result = await response.json()

      if (result.success) {
        fetchPublications()
      } else {
        alert(result.error || 'Failed to update featured status')
      }
    } catch (err) {
      alert('An error occurred while updating featured status')
      console.error(err)
    }
  }

  const deletePublication = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/publications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        fetchPublications()
      } else {
        alert(result.error || 'Failed to delete publication')
      }
    } catch (err) {
      alert('An error occurred while deleting publication')
      console.error(err)
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
          <h1 className="text-2xl font-bold text-gray-900">Publications</h1>
          <p className="text-gray-600 mt-1">Manage Zenodo publications, articles, and research papers</p>
        </div>
        <Link
          href="/admin/publications/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus className="mr-2" />
          Add Publication
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Publications</div>
          <div className="text-2xl font-bold text-gray-900">{publications.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Active Publications</div>
          <div className="text-2xl font-bold text-green-600">
            {publications.filter(p => p.isActive).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Featured</div>
          <div className="text-2xl font-bold text-blue-600">
            {publications.filter(p => p.isFeatured).length}
          </div>
        </div>
      </div>

      {/* Publications List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Authors
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Featured
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {publications.map((pub) => (
                <tr key={pub.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {pub.order}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{pub.title}</div>
                      {pub.journal && (
                        <div className="text-sm text-gray-500">{pub.journal}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {pub.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {pub.authors.length > 0 ? pub.authors.join(', ') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleFeatured(pub.id, pub.isFeatured)}
                      className={`inline-flex items-center ${
                        pub.isFeatured ? 'text-yellow-500' : 'text-gray-300'
                      } hover:text-yellow-600 transition`}
                    >
                      <FaStar size={18} />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(pub.id, pub.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        pub.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {pub.isActive ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                      {pub.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={pub.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-900"
                        title="View Publication"
                      >
                        <FaExternalLinkAlt size={16} />
                      </a>
                      <Link
                        href={`/admin/publications/${pub.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button
                        onClick={() => deletePublication(pub.id, pub.title)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <FaTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {publications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No publications found. Add your first publication to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
