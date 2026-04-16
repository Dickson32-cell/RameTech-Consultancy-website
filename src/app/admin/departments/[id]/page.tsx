'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaEdit, FaTrash, FaPlus, FaCheck, FaTimes, FaEye } from 'react-icons/fa'

interface SubDepartment {
  id: string
  name: string
  slug: string
  order: number
  isActive: boolean
}

interface Service {
  id: string
  title: string
  slug: string
  order: number
  isActive: boolean
}

interface Project {
  id: string
  title: string
  slug: string
  order: number
  isActive: boolean
}

interface PricingTable {
  id: string
  name: string
  isActive: boolean
}

interface Department {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  imageUrl: string | null
  order: number
  isActive: boolean
  subDepartments: SubDepartment[]
  services: Service[]
  projects: Project[]
  pricingTables: PricingTable[]
  _count: {
    subDepartments: number
    services: number
    projects: number
    pricingTables: number
  }
}

export default function DepartmentViewPage() {
  const router = useRouter()
  const params = useParams()
  const departmentId = params.id as string

  const [department, setDepartment] = useState<Department | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchDepartment()
  }, [departmentId, router])

  const fetchDepartment = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/departments/${departmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setDepartment(result.data)
        setError('')
      } else {
        setError(result.error || 'Failed to fetch department')
      }
    } catch (err: any) {
      setError(`Error: ${err.message || 'Unknown error'}`)
      console.error('Fetch department error:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteDepartment = async () => {
    if (!department) return

    if (!confirm(`Are you sure you want to delete "${department.name}"? This will also delete all related content.`)) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/departments/${departmentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        router.push('/admin/departments')
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

  if (error || !department) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg">
          <div className="flex items-center">
            <FaTimes className="h-5 w-5 text-red-500 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="mt-1 text-sm text-red-700">{error || 'Department not found'}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/admin/departments"
              className="text-sm text-red-800 hover:text-red-900 underline"
            >
              ← Back to Departments
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/departments"
            className="text-blue-600 hover:text-blue-800"
            title="Back to Departments"
          >
            <FaArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
            <p className="text-gray-600 mt-1">/{department.slug}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
            department.isActive
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {department.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/departments/${departmentId}/edit`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            <FaEdit className="mr-2" />
            Edit Department
          </Link>
          <button
            onClick={deleteDepartment}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            <FaTrash className="mr-2" />
            Delete
          </button>
        </div>
      </div>

      {/* Department Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Information</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <dt className="text-sm font-medium text-gray-500">Description</dt>
            <dd className="mt-1 text-sm text-gray-900">{department.description || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Icon</dt>
            <dd className="mt-1 text-sm text-gray-900">{department.icon || 'N/A'}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Display Order</dt>
            <dd className="mt-1 text-sm text-gray-900">{department.order}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Image URL</dt>
            <dd className="mt-1 text-sm text-gray-900 truncate">{department.imageUrl || 'N/A'}</dd>
          </div>
        </dl>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Sub-Departments</div>
          <div className="text-2xl font-bold text-blue-600">{department._count.subDepartments}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Services</div>
          <div className="text-2xl font-bold text-green-600">{department._count.services}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Projects</div>
          <div className="text-2xl font-bold text-purple-600">{department._count.projects}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-gray-600">Pricing Tables</div>
          <div className="text-2xl font-bold text-orange-600">{department._count.pricingTables}</div>
        </div>
      </div>

      {/* Sub-Departments */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Sub-Departments</h2>
            <Link
              href={`/admin/sub-departments/new?departmentId=${departmentId}`}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition"
            >
              <FaPlus className="mr-1" size={12} />
              Add Sub-Department
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          {department.subDepartments.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {department.subDepartments.map((subDept) => (
                  <tr key={subDept.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subDept.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{subDept.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/{subDept.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        subDept.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {subDept.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/admin/sub-departments/${subDept.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit className="inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No sub-departments yet. Add one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Services */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Services</h2>
            <Link
              href={`/admin/services/new?departmentId=${departmentId}`}
              className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition"
            >
              <FaPlus className="mr-1" size={12} />
              Add Service
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          {department.services.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {department.services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{service.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/{service.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {service.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/admin/services/${service.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit className="inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No services yet. Add one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Projects */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
            <Link
              href={`/admin/projects/new?departmentId=${departmentId}`}
              className="inline-flex items-center px-3 py-1.5 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition"
            >
              <FaPlus className="mr-1" size={12} />
              Add Project
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          {department.projects.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Slug</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {department.projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{project.order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{project.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">/{project.slug}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        project.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {project.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/admin/projects/${project.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit className="inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No projects yet. Add one to get started.
            </div>
          )}
        </div>
      </div>

      {/* Pricing Tables */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">Pricing Tables</h2>
            <Link
              href={`/admin/pricing-tables/new?departmentId=${departmentId}`}
              className="inline-flex items-center px-3 py-1.5 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 transition"
            >
              <FaPlus className="mr-1" size={12} />
              Add Pricing Table
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          {department.pricingTables.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {department.pricingTables.map((table) => (
                  <tr key={table.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{table.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        table.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {table.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <Link
                        href={`/admin/pricing-tables/${table.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                      >
                        <FaEdit className="inline" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-12 text-gray-500">
              No pricing tables yet. Add one to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
