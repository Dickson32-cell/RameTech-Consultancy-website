'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface Department {
  id: string
  name: string
  slug: string
  description: string | null
  icon: string | null
  imageUrl: string | null
  order: number
  _count: {
    subDepartments: number
    services: number
    projects: number
  }
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/v1/departments')
      const result = await response.json()

      if (result.success) {
        setDepartments(result.data)
      }
    } catch (err) {
      console.error('Error fetching departments:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Our Departments
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our diverse range of services across multiple departments
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              href={`/departments/${dept.slug}`}
              className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Department Image/Icon */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-indigo-600 overflow-hidden">
                {dept.imageUrl ? (
                  <Image
                    src={dept.imageUrl}
                    alt={dept.name}
                    fill
                    className="object-cover opacity-90 group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl text-white opacity-80">
                      {dept.icon || '📁'}
                    </div>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-2xl font-bold text-white">{dept.name}</h2>
                </div>
              </div>

              {/* Department Info */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {dept.description || 'Explore our services in this department'}
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                  {dept._count.services > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-blue-600">{dept._count.services}</span>
                      <span>Services</span>
                    </div>
                  )}
                  {dept._count.projects > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-green-600">{dept._count.projects}</span>
                      <span>Projects</span>
                    </div>
                  )}
                  {dept._count.subDepartments > 0 && (
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-indigo-600">{dept._count.subDepartments}</span>
                      <span>Sub-departments</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>Explore Department</span>
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {departments.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No Departments Yet
            </h3>
            <p className="text-gray-500">
              Check back soon for our departments and services
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
