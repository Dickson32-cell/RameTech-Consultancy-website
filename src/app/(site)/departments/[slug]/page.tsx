'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import PortfolioModal from '@/components/shared/PortfolioModal'

interface SubDepartment {
  id: string
  name: string
  slug: string
  description: string | null
  services: Service[]
  projects: Project[]
}

interface Service {
  id: string
  title: string
  description: string
  price: string | null
  features: string[]
  imageUrl: string | null
}

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
}

interface PricingPhase {
  name: string
  items: Array<{
    serviceItem: string
    description: string
    bachelor: number
    master: number
    phd: number
  }>
}

interface PricingTier {
  name: string
  price: string
  features: string[]
  highlighted: boolean
}

interface PricingTable {
  id: string
  name: string
  description: string | null
  tableType: string
  data: {
    phases?: PricingPhase[]
    items?: any[]
    tiers?: PricingTier[]
  }
}

interface Department {
  id: string
  name: string
  slug: string
  description: string | null
  imageUrl: string | null
  subDepartments: SubDepartment[]
  services: Service[]
  projects: Project[]
  pricingTables: PricingTable[]
}

function HeroImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false)
  if (failed) return null
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setFailed(true)}
    />
  )
}

export default function DepartmentDetailPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [department, setDepartment] = useState<Department | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'services' | 'projects' | 'pricing'>('services')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  useEffect(() => {
    if (slug) {
      fetchDepartment()
    }
  }, [slug])

  const fetchDepartment = async () => {
    try {
      const response = await fetch(`/api/v1/departments?slug=${slug}&t=${Date.now()}`, {
        cache: 'no-store'
      })
      const result = await response.json()

      if (result.success) {
        console.log('✅ Department data loaded:', {
          name: result.data.name,
          servicesCount: result.data.services?.length || 0,
          projectsCount: result.data.projects?.length || 0,
          pricingTablesCount: result.data.pricingTables?.length || 0,
        })

        if (result.data.pricingTables && result.data.pricingTables.length > 0) {
          console.log('📊 Pricing tables found:', result.data.pricingTables.map((pt: any) => ({
            name: pt.name,
            isActive: pt.isActive,
            tableType: pt.tableType,
            dataStructure: {
              hasTiers: !!pt.data?.tiers,
              hasItems: !!pt.data?.items,
              tiersCount: pt.data?.tiers?.length || 0,
              itemsCount: pt.data?.items?.length || 0
            }
          })))
        } else {
          console.log('⚠️ No pricing tables found for this department')
        }

        setDepartment(result.data)

        // Set default tab based on available content
        if (result.data.services.length > 0 || result.data.subDepartments.some((sd: SubDepartment) => sd.services.length > 0)) {
          setActiveTab('services')
        } else if (result.data.projects.length > 0 || result.data.subDepartments.some((sd: SubDepartment) => sd.projects.length > 0)) {
          setActiveTab('projects')
        } else if (result.data.pricingTables.length > 0) {
          setActiveTab('pricing')
        }
      }
    } catch (err) {
      console.error('❌ Error fetching department:', err)
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

  if (!department) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Department Not Found</h1>
          <Link href="/departments" className="text-blue-600 hover:text-blue-800">
            ← Back to Departments
          </Link>
        </div>
      </div>
    )
  }

  const hasServices = department.services.length > 0 || department.subDepartments.some(sd => sd.services.length > 0)
  const hasProjects = department.projects.length > 0 || department.subDepartments.some(sd => sd.projects.length > 0)
  const hasPricing = department.pricingTables.length > 0

  console.log('📑 Tab visibility:', {
    hasServices,
    hasProjects,
    hasPricing,
    pricingTablesCount: department.pricingTables.length
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="relative h-96 md:h-[500px] lg:h-[600px] overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        {department.imageUrl && (
          <div className="absolute inset-0">
            <HeroImage src={department.imageUrl} alt={department.name} />
          </div>
        )}
        {/* Dark gradient so text is always readable */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-12 md:pb-16">
            <Link href="/departments" className="text-white/90 hover:text-white mb-6 inline-block text-sm font-medium">
              ← Back to Departments
            </Link>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
              {department.name}
            </h1>
            {department.description && (
              <p className="text-lg md:text-xl text-white/95 max-w-3xl drop-shadow-lg">
                {department.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8 overflow-x-auto">
            {hasServices && (
              <button
                onClick={() => setActiveTab('services')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'services'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Services
              </button>
            )}
            {hasProjects && (
              <button
                onClick={() => setActiveTab('projects')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'projects'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Projects & Works
              </button>
            )}
            {hasPricing && (
              <button
                onClick={() => setActiveTab('pricing')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'pricing'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Pricing
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-12">
            {/* Department-level Services */}
            {department.services.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {department.services.map((service) => (
                    <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                      {service.imageUrl && (
                        <div className="h-48 mb-4 rounded-lg overflow-hidden">
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      {service.price && (
                        <div className="text-lg font-semibold text-blue-600 mb-4">
                          {service.price}
                        </div>
                      )}
                      {service.features.length > 0 && (
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-department Services */}
            {department.subDepartments.filter(sd => sd.services.length > 0).map((subDept) => (
              <div key={subDept.id}>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{subDept.name}</h2>
                {subDept.description && (
                  <p className="text-gray-600 mb-6">{subDept.description}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subDept.services.map((service) => (
                    <div key={service.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                      {service.imageUrl && (
                        <div className="h-48 mb-4 rounded-lg overflow-hidden">
                          <img
                            src={service.imageUrl}
                            alt={service.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-gray-600 mb-4">{service.description}</p>
                      {service.price && (
                        <div className="text-lg font-semibold text-blue-600 mb-4">
                          {service.price}
                        </div>
                      )}
                      {service.features.length > 0 && (
                        <ul className="space-y-2">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="space-y-12">
            {/* Department-level Projects */}
            {department.projects.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {department.projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer group"
                    >
                      <div className="relative h-56 bg-gray-200 overflow-hidden">
                        {project.videoUrl ? (
                          <video
                            src={project.videoUrl}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            muted
                            playsInline
                          />
                        ) : project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            No media
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sub-department Projects */}
            {department.subDepartments.filter(sd => sd.projects.length > 0).map((subDept) => (
              <div key={subDept.id}>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{subDept.name}</h2>
                {subDept.description && (
                  <p className="text-gray-600 mb-6">{subDept.description}</p>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {subDept.projects.map((project) => (
                    <div
                      key={project.id}
                      onClick={() => setSelectedProject(project)}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer group"
                    >
                      <div className="relative h-56 bg-gray-200 overflow-hidden">
                        {project.videoUrl ? (
                          <video
                            src={project.videoUrl}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            muted
                            playsInline
                          />
                        ) : project.imageUrl ? (
                          <img
                            src={project.imageUrl}
                            alt={project.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                            No media
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                        {project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.slice(0, 3).map((tech, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-12">
            {department.pricingTables.map((pricingTable) => {
              // Debug logging
              console.log('🔍 Rendering pricing table:', {
                name: pricingTable.name,
                tableType: pricingTable.tableType,
                hasTiers: !!pricingTable.data?.tiers,
                hasItems: !!pricingTable.data?.items,
                tiersLength: pricingTable.data?.tiers?.length,
                itemsLength: pricingTable.data?.items?.length,
                fullData: pricingTable.data
              })

              return (
              <div key={pricingTable.id}>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{pricingTable.name}</h2>
                {pricingTable.description && (
                  <p className="text-gray-600 mb-8">{pricingTable.description}</p>
                )}

                {/* Academic Pricing Table */}
                {pricingTable.tableType === 'academic' && pricingTable.data.phases && (
                  <div className="space-y-8">
                    {pricingTable.data.phases.map((phase, phaseIdx) => (
                      <div key={phaseIdx} className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="bg-blue-600 text-white px-6 py-4">
                          <h3 className="text-xl font-bold">{phase.name}</h3>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Service Item
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Description
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Bachelor
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Master
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  PhD
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {phase.items.map((item, itemIdx) => (
                                <tr key={itemIdx} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {item.serviceItem}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {item.description}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                                    GHS {item.bachelor.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                                    GHS {item.master.toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                                    GHS {item.phd.toLocaleString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Simple Pricing Table - Supports both "tiers" and "items" format */}
                {pricingTable.tableType === 'simple' && (pricingTable.data.tiers || pricingTable.data.items) && (
                  <div>
                    {/* Check if using tiers format (pricing plans) */}
                    {pricingTable.data.tiers && Array.isArray(pricingTable.data.tiers) && pricingTable.data.tiers.length > 0 && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pricingTable.data.tiers.map((tier: any, idx: number) => (
                          <div
                            key={idx}
                            className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${
                              tier.highlighted ? 'border-blue-500' : 'border-gray-200'
                            }`}
                          >
                            {tier.highlighted && (
                              <div className="bg-blue-500 text-white text-center py-2 px-4 text-sm font-semibold">
                                MOST POPULAR
                              </div>
                            )}
                            <div className="p-8">
                              <h3 className="text-2xl font-bold text-gray-900 mb-2">{tier.name}</h3>
                              <div className="text-4xl font-bold text-blue-600 mb-6">
                                {tier.price}
                              </div>
                              {tier.features && Array.isArray(tier.features) && tier.features.length > 0 ? (
                                <ul className="space-y-3">
                                  {tier.features.map((feature: string, fIdx: number) => (
                                    <li key={fIdx} className="flex items-start text-gray-600">
                                      <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                      </svg>
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="text-gray-500 text-sm italic">No features listed</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Check if using items format (simple list) */}
                    {pricingTable.data.items && Array.isArray(pricingTable.data.items) && pricingTable.data.items.length > 0 && (
                      <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Item
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Description
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {pricingTable.data.items.map((item: any, idx: number) => (
                                <tr key={idx} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                    {item.name}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-gray-600">
                                    {item.description}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-right font-semibold text-gray-900">
                                    {item.price}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Show message if no pricing data found */}
                    {!pricingTable.data.tiers && !pricingTable.data.items && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
                        <p className="text-gray-700">
                          No pricing information available for this table. Please contact admin to add pricing details.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Show message if table type is not recognized */}
                {pricingTable.tableType !== 'simple' && pricingTable.tableType !== 'academic' && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                    <p className="text-gray-700">
                      Pricing table type "{pricingTable.tableType}" is not yet supported.
                    </p>
                  </div>
                )}
              </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Project Modal */}
      <PortfolioModal
        project={selectedProject ? {
          ...selectedProject,
          category: department.name
        } : null}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </div>
  )
}
