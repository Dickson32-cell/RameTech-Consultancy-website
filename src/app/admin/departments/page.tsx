'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaEye, FaCheck, FaTimes } from 'react-icons/fa'

interface Department {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  imageUrl: string | null
  order: number
  isActive: boolean
  _count: {
    subDepartments: number
    services: number
    projects: number
    pricingTables: number
  }
}

export default function DepartmentsPage() {
  const router = useRouter()
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [settingUp, setSettingUp] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchDepartments()
  }, [router])

  const fetchDepartments = async () => {
    try {
      console.log('Fetching departments from admin API...')
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/departments?t=${Date.now()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        cache: 'no-store'
      })

      const result = await response.json()
      console.log('Departments API response:', result)

      if (result.success) {
        setDepartments(result.data || [])
        setError('')
        console.log('Departments loaded:', result.data?.length || 0)
      } else {
        const errorMsg = result.error || 'Failed to fetch departments'
        setError(errorMsg)
        console.error('Departments API error:', errorMsg)
      }
    } catch (err: any) {
      const errorMsg = `Network error: ${err.message || 'Unknown error'}`
      setError(errorMsg)
      console.error('Fetch departments error:', err)
    } finally {
      setLoading(false)
    }
  }

  const runQuickSetup = async () => {
    if (!confirm('This will create the default department structure (4 departments, 4 team heads, 17 services). Continue?')) {
      return
    }

    setSettingUp(true)
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/setup-departments', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      console.log('Setup result:', result)

      if (result.success) {
        alert(`Setup Successful!\n\n${result.log}\n\nRefreshing page...`)
        fetchDepartments()
        window.location.reload()
      } else {
        alert(`Setup Failed!\n\nError: ${result.error}\n\nLog:\n${result.log}`)
      }
    } catch (err: any) {
      alert(`Setup Error: ${err.message}`)
      console.error('Setup error:', err)
    } finally {
      setSettingUp(false)
    }
  }

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/departments/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      const result = await response.json()

      if (result.success) {
        fetchDepartments()
      } else {
        alert(result.error || 'Failed to update department status')
      }
    } catch (err) {
      alert('An error occurred while updating department status')
      console.error(err)
    }
  }

  const deleteDepartment = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This will also delete all related sub-departments, services, projects, and pricing tables.`)) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/departments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        fetchDepartments()
      } else {
        alert(result.error || 'Failed to delete department')
      }
    } catch (err) {
      alert('An error occurred while deleting department')
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
          <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
          <p className="text-gray-600 mt-1">Manage your departments and their content</p>
        </div>
        <div className="flex gap-2">
          {departments.length === 0 && !error && (
            <button
              onClick={runQuickSetup}
              disabled={settingUp}
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
            >
              {settingUp ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Setting Up...
                </>
              ) : (
                <>
                  <FaCheck className="mr-2" />
                  Quick Setup
                </>
              )}
            </button>
          )}
          <Link
            href="/admin/departments/new"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus className="mr-2" />
            Add Department
          </Link>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <FaTimes className="h-5 w-5 text-red-500" />
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">Error Loading Departments</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              {error.includes('Database tables not created') && (
                <div className="mt-4 bg-white/50 p-4 rounded">
                  <p className="font-semibold text-sm text-red-900 mb-2">To fix this:</p>
                  <ol className="list-decimal ml-5 text-sm space-y-1 text-red-800">
                    <li>Go to your Render dashboard</li>
                    <li>Open your web service</li>
                    <li>Click "Shell" tab</li>
                    <li>Run: <code className="bg-gray-800 text-white px-2 py-1 rounded">npm run render:setup</code></li>
                    <li>Wait for completion (creates departments and sample data)</li>
                    <li>Refresh this page</li>
                  </ol>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Departments</div>
          <div className="text-2xl font-bold text-gray-900">{departments.length}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Active Departments</div>
          <div className="text-2xl font-bold text-green-600">
            {departments.filter(d => d.isActive).length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Total Content</div>
          <div className="text-2xl font-bold text-blue-600">
            {departments.reduce((sum, d) => sum + d._count.services + d._count.projects, 0)}
          </div>
        </div>
      </div>

      {/* Departments List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
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
              {departments.map((dept) => (
                <tr key={dept.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {dept.order}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                      <div className="text-sm text-gray-500">/{dept.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div>{dept._count.subDepartments} sub-departments</div>
                      <div>{dept._count.services} services</div>
                      <div>{dept._count.projects} projects</div>
                      <div>{dept._count.pricingTables} pricing tables</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => toggleActive(dept.id, dept.isActive)}
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        dept.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {dept.isActive ? <FaCheck className="mr-1" /> : <FaTimes className="mr-1" />}
                      {dept.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/departments/${dept.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        title="View & Manage"
                      >
                        <FaEye size={18} />
                      </Link>
                      <Link
                        href={`/admin/departments/${dept.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="Edit"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button
                        onClick={() => deleteDepartment(dept.id, dept.name)}
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

        {departments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No departments found. Create your first department to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}
