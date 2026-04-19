'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

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

function DeptCardImage({ src, alt, icon }: { src: string | null; alt: string; icon: string | null }) {
  const [failed, setFailed] = useState(false)

  if (src && !failed) {
    return (
      <>
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
          onError={() => setFailed(true)}
        />
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </>
    )
  }

  // Fallback: gradient with icon
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-6xl text-white opacity-80">{icon || '📁'}</span>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
    </>
  )
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`/api/v1/departments?t=${Date.now()}`, { cache: 'no-store' })
      const result = await response.json()
      if (result.success) setDepartments(result.data || [])
    } catch (err: any) {
      console.error('Error fetching departments:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Departments</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our diverse range of services across multiple departments
          </p>
        </div>

        {departments.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🏢</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Departments Yet</h3>
            <p className="text-gray-600 mb-6">Departments are being set up. Please check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {departments.map((dept) => (
              <Link
                key={dept.id}
                href={`/departments/${dept.slug}`}
                className="group bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Image area */}
                <div className="relative h-48 overflow-hidden">
                  <DeptCardImage src={dept.imageUrl} alt={dept.name} icon={dept.icon} />
                  {/* Department name pinned to bottom of image */}
                  <div className="absolute bottom-0 left-0 right-0 px-4 pb-3 z-10">
                    <h2 className="text-xl font-bold text-white drop-shadow">{dept.name}</h2>
                  </div>
                </div>

                {/* Info */}
                <div className="p-6">
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {dept.description || 'Explore our services in this department'}
                  </p>

                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    {dept._count.services > 0 && (
                      <span>
                        <span className="font-semibold text-blue-600">{dept._count.services}</span> Services
                      </span>
                    )}
                    {dept._count.projects > 0 && (
                      <span>
                        <span className="font-semibold text-green-600">{dept._count.projects}</span> Projects
                      </span>
                    )}
                    {dept._count.subDepartments > 0 && (
                      <span>
                        <span className="font-semibold text-indigo-600">{dept._count.subDepartments}</span> Sub-departments
                      </span>
                    )}
                  </div>

                  <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                    <span>Explore Department</span>
                    <svg
                      className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
