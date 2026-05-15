'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
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
    services: number
    projects: number
  }
}

export default function DepartmentsSection() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch(`/api/v1/departments?t=${Date.now()}`, {
          cache: 'no-store'
        })
        const data = await res.json()
        if (data.success && data.data) {
          setDepartments(data.data.slice(0, 6)) // Show first 6 departments
        }
      } catch (error) {
        console.error('Error fetching departments:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchDepartments()
  }, [])

  if (loading || departments.length === 0) return null

  return (
    <section className="relative py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 rounded-full px-5 py-2 mb-4">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Our Departments</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mt-3 mb-4">
            Explore Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Expertise</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover our specialized departments offering comprehensive solutions for your needs.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {departments.map((dept) => (
            <Link
              href={`/departments/${dept.slug}`}
              key={dept.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600">
                {dept.imageUrl ? (
                  <>
                    <img
                      src={dept.imageUrl}
                      alt={dept.name}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                  </>
                ) : dept.icon ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {dept.icon.startsWith('http') ? (
                      <img src={dept.icon} alt={dept.name} className="w-20 h-20 object-contain opacity-90" />
                    ) : (
                      <span className="text-6xl text-white opacity-80">{dept.icon}</span>
                    )}
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl text-white opacity-80">📁</span>
                  </div>
                )}

                {/* Department Name */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-4 z-10">
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">
                    {dept.name}
                  </h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {dept.description || 'Explore our services in this department'}
                </p>

                {/* Stats */}
                <div className="flex gap-4 text-sm text-gray-500 mb-4">
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
                </div>

                {/* Arrow */}
                <div className="flex items-center text-blue-600 font-semibold group-hover:text-blue-700">
                  <span>Learn More</span>
                  <svg
                    className="w-5 h-5 ml-2 transform group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link
            href="/departments"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <span>View All Departments</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
