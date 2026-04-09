'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaCode, FaLaptopCode, FaPalette, FaServer, FaMobileAlt, FaDatabase, FaCloud, FaShieldAlt, FaChartLine, FaSearch, FaBullhorn, FaRobot, FaChartBar, FaCheck, FaGraduationCap, FaFileWord, FaDownload } from 'react-icons/fa'

interface Service {
  id: string
  name: string
  slug: string
  description: string
  icon: string | null
  features: string[]
  order: number
  isActive: boolean
  link?: string | null
}

interface AcademicWritingItem {
  id: string
  name: string
  description: string
  bachelorPrice: number
  masterPrice: number
  phdPrice: number
}

interface AcademicWritingPhase {
  id: string
  name: string
  serviceItems: AcademicWritingItem[]
}

interface AcademicWritingDocument {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number | null
  isActive: boolean
}

// Icon mapping
const iconComponents: Record<string, React.ReactNode> = {
  FaCode: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  FaLaptopCode: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  FaPalette: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>,
  FaServer: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" /></svg>,
  FaMobileAlt: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  FaDatabase: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  FaCloud: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" /></svg>,
  FaShieldAlt: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  FaChartLine: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" /></svg>,
  FaSearch: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  FaBullhorn: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>,
  FaRobot: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  FaChartBar: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  FaGraduationCap: <FaGraduationCap className="w-8 h-8" />,
}

export default function ServicesPage() {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loadingServices, setLoadingServices] = useState(true)
  const [academicWritingPhases, setAcademicWritingPhases] = useState<AcademicWritingPhase[]>([])
  const [academicWritingDocument, setAcademicWritingDocument] = useState<AcademicWritingDocument | null>(null)
  const [loadingAcademic, setLoadingAcademic] = useState(false)
  const [academicDataFetched, setAcademicDataFetched] = useState(false)

  // Fetch all services from database on mount
  useEffect(() => {
    console.log('Component mounted, fetching all services from database...')
    fetchServices()
    fetchAcademicWriting()
  }, [])

  useEffect(() => {
    console.log('Active service changed to:', activeService)
    if (activeService === 'academic-writing' && !academicDataFetched) {
      console.log('Academic service active, fetching data...')
      fetchAcademicWriting()
    }
  }, [activeService])

  const fetchServices = async () => {
    try {
      console.log('Fetching services from API...')
      // Add cache-busting parameter
      const response = await fetch(`/api/v1/services?t=${Date.now()}`)
      const result = await response.json()

      console.log('Services API response:', result)

      if (result.success && result.data) {
        // Map services and add special link for academic writing
        const mappedServices = result.data.map((s: Service) => ({
          ...s,
          link: s.slug === 'academic-writing' ? '/services/academic-writing' : null
        }))
        setServices(mappedServices)
        console.log('Services loaded:', mappedServices.length)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoadingServices(false)
    }
  }

  const fetchAcademicWriting = async () => {
    console.log('fetchAcademicWriting() called')
    setLoadingAcademic(true)
    try {
      console.log('Services page: Fetching academic writing data...')

      // First check if there's an uploaded document (cache-busting)
      const docResponse = await fetch(`/api/v1/academic-writing/document?t=${Date.now()}`)
      const docResult = await docResponse.json()

      console.log('Services page - Document response:', docResult)

      if (docResult.success && docResult.data && docResult.data.fileUrl) {
        console.log('Services page: Document found, setting state')
        setAcademicWritingDocument(docResult.data)
      } else {
        console.log('Services page: No document, fetching phases...')
        // Fallback to database phases if no document
        const phasesResponse = await fetch(`/api/v1/academic-writing?t=${Date.now()}`)
        const phasesResult = await phasesResponse.json()

        console.log('Services page - Phases response:', phasesResult)

        if (phasesResult.success && phasesResult.data) {
          console.log('Services page: Phases found, setting state')
          setAcademicWritingPhases(phasesResult.data)
        }
      }

      setAcademicDataFetched(true)
      console.log('Academic data fetch complete')
    } catch (error) {
      console.error('Error fetching academic writing:', error)
    } finally {
      setLoadingAcademic(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-secondary to-primary text-white py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span className="text-sm font-medium">Expert Solutions</span>
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">Our Services</h1>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Comprehensive tech solutions to help your business grow and succeed in the digital age.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loadingServices ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No services available. Please add services in the admin panel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`bento-card cursor-pointer transition-all duration-300 ${activeService === service.slug ? 'ring-2 ring-primary' : ''}`}
                >
                  {service.slug === 'academic-writing' ? (
                  // Academic Writing - expandable
                  <div onClick={() => {
                    console.log('Academic Writing card clicked! Current active:', activeService)
                    const newActive = activeService === service.slug ? null : service.slug
                    console.log('Setting activeService to:', newActive)
                    setActiveService(newActive)
                  }}>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                      {iconComponents[service.icon || 'FaCode']}
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-text mb-3">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <p className="text-xs text-primary font-medium">
                      {activeService === service.slug ? '▼ Click to collapse' : '▶ Click to view pricing'}
                    </p>
                  </div>
                ) : service.link ? (
                  <Link href={service.link} className="block">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                      {iconComponents[service.icon || 'FaCode']}
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-text mb-3">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </Link>
                ) : (
                  <div onClick={() => setActiveService(activeService === service.slug ? null : service.slug)}>
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                      {iconComponents[service.icon || 'FaCode']}
                    </div>
                    <h3 className="text-xl font-heading font-semibold text-text mb-3">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                  </div>
                )}

                {/* Expandable Features */}
                {service.slug === 'academic-writing' ? (
                  // Special display for Academic Writing
                  <div
                    className={`overflow-hidden transition-all duration-300 ${activeService === service.slug ? 'max-h-[2000px] mt-4' : 'max-h-0'}`}
                  >
                    <div className="pt-4 border-t border-gray-100">
                      {/* Debug - shows what data was loaded */}
                      {!loadingAcademic && !academicWritingDocument && academicWritingPhases.length === 0 && (
                        <div className="bg-yellow-50 border border-yellow-300 p-3 rounded mb-3">
                          <p className="text-xs text-yellow-800 font-semibold mb-2">
                            Debug: No document or phases loaded
                          </p>
                          <p className="text-xs text-yellow-700">
                            • Document: {academicWritingDocument ? 'EXISTS' : 'NULL'}<br/>
                            • Phases: {academicWritingPhases.length}<br/>
                            • Data fetched: {academicDataFetched ? 'Yes' : 'No'}<br/>
                            • Loading: {loadingAcademic ? 'Yes' : 'No'}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              console.log('Manual refresh clicked')
                              fetchAcademicWriting()
                            }}
                            className="mt-2 text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700"
                          >
                            🔄 Refresh Data
                          </button>
                        </div>
                      )}

                      {loadingAcademic ? (
                        <div className="flex justify-center py-4">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                        </div>
                      ) : academicWritingDocument && academicWritingDocument.fileUrl ? (
                        // Show document download if available
                        <>
                          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                            <div className="flex items-center gap-3 mb-3">
                              <FaFileWord className="text-blue-600 text-3xl" />
                              <div className="flex-1">
                                <h4 className="text-sm font-semibold text-gray-800">Price List Document</h4>
                                <p className="text-xs text-gray-600">{academicWritingDocument.fileName}</p>
                                {academicWritingDocument.fileSize && (
                                  <p className="text-xs text-gray-500">
                                    {(academicWritingDocument.fileSize / 1024).toFixed(2)} KB
                                  </p>
                                )}
                              </div>
                            </div>
                            <a
                              href={academicWritingDocument.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                            >
                              <FaDownload /> Download Price List
                            </a>
                          </div>
                          <Link
                            href="/services/academic-writing"
                            className="mt-4 block w-full text-center bg-primary/10 text-primary py-2 rounded-lg text-xs font-medium hover:bg-primary/20 transition"
                          >
                            View Service Details
                          </Link>
                        </>
                      ) : academicWritingPhases.length > 0 ? (
                        // Fallback to showing phases if no document
                        <>
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-text">Service Phases & Pricing:</p>
                            <Link
                              href="/services/academic-writing"
                              className="text-xs text-primary hover:text-primary/80 underline"
                            >
                              View Full Details
                            </Link>
                          </div>

                          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {academicWritingPhases.map((phase) => (
                              <div key={phase.id} className="bg-gray-50 rounded-lg p-3">
                                <h4 className="text-xs font-semibold text-primary mb-2">{phase.name}</h4>
                                <div className="space-y-2">
                                  {phase.serviceItems.slice(0, 3).map((item) => (
                                    <div key={item.id} className="text-xs">
                                      <p className="font-medium text-gray-800 mb-1">{item.name}</p>
                                      <div className="flex gap-2 text-[10px]">
                                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                                          B: GHS {item.bachelorPrice}
                                        </span>
                                        <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded">
                                          M: GHS {item.masterPrice}
                                        </span>
                                        <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded">
                                          PhD: GHS {item.phdPrice}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                  {phase.serviceItems.length > 3 && (
                                    <p className="text-[10px] text-gray-500 italic">
                                      +{phase.serviceItems.length - 3} more items...
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <Link
                            href="/services/academic-writing"
                            className="mt-4 block w-full text-center bg-primary text-white py-2 rounded-lg text-xs font-medium hover:bg-primary/90 transition"
                          >
                            View Complete Pricing Table
                          </Link>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 text-center py-4">No pricing information available</p>
                      )}
                    </div>
                  </div>
                ) : (
                  // Regular features display for other services
                  <div
                    className={`overflow-hidden transition-all duration-300 ${activeService === service.slug ? 'max-h-48 mt-4' : 'max-h-0'}`}
                    onClick={() => setActiveService(activeService === service.slug ? null : service.slug)}
                  >
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-sm font-medium text-text mb-3">What we offer:</p>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <FaCheck className="w-4 h-4 text-primary flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <span className="text-accent font-semibold text-sm uppercase tracking-wider">How We Work</span>
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mt-3 mb-4">Our Process</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">A structured approach to delivering exceptional results for your business.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', desc: 'We learn about your business, goals, and challenges' },
              { step: '02', title: 'Strategy', desc: 'We create a tailored plan to achieve your objectives' },
              { step: '03', title: 'Implementation', desc: 'We build and deploy solutions with regular updates' },
              { step: '04', title: 'Support', desc: 'Ongoing maintenance and optimization' },
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="w-20 h-20 bg-primary text-white rounded-2xl flex items-center justify-center text-2xl font-heading font-bold mx-auto mb-6 shadow-lg shadow-primary/30">
                  {item.step}
                </div>
                <h3 className="text-xl font-heading font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-secondary to-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Let's discuss your project and create a tailored solution for your business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-accent text-lg px-8 py-4 cursor-pointer">
              Get a Free Quote
            </Link>
            <Link href="/portfolio" className="bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all duration-200 cursor-pointer text-lg">
              View Our Work
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
