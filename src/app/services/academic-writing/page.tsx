'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaArrowLeft, FaGraduationCap, FaCheckCircle, FaFileWord, FaDownload } from 'react-icons/fa'

interface ServiceItem {
  id: string
  name: string
  description: string
  bachelorPrice: number
  masterPrice: number
  phdPrice: number
  order: number
}

interface Phase {
  id: string
  name: string
  description: string | null
  order: number
  serviceItems: ServiceItem[]
}

interface AcademicWritingDocument {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number | null
  isActive: boolean
}

export default function AcademicWritingPage() {
  const [phases, setPhases] = useState<Phase[]>([])
  const [document, setDocument] = useState<AcademicWritingDocument | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // First check for uploaded document
      console.log('Fetching Academic Writing document...')
      const docResponse = await fetch('/api/v1/academic-writing/document')
      const docResult = await docResponse.json()

      console.log('Document API response:', docResult)

      if (docResult.success && docResult.data) {
        console.log('Document found:', docResult.data)
        setDocument(docResult.data)
      } else {
        console.log('No document found or API error')
      }

      // Also fetch phases for fallback display
      console.log('Fetching Academic Writing phases...')
      const phasesResponse = await fetch('/api/v1/academic-writing')
      const phasesResult = await phasesResponse.json()

      console.log('Phases API response:', phasesResult)

      if (phasesResult.success) {
        console.log('Phases found:', phasesResult.data?.length || 0)
        setPhases(phasesResult.data || [])
      }
    } catch (error) {
      console.error('Error fetching academic writing services:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6 transition"
          >
            <FaArrowLeft />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <FaGraduationCap className="text-5xl" />
            <h1 className="text-4xl md:text-5xl font-bold">
              Academic Writing Services
            </h1>
          </div>
          <p className="text-xl text-blue-100 max-w-3xl">
            Professional academic writing support for Bachelor, Master, and PhD level research
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Debug Info - Remove after testing */}
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-yellow-100 border border-yellow-400 p-4 rounded-lg mb-4">
            <p className="font-semibold">Debug Info:</p>
            <p className="text-sm">Document state: {document ? 'EXISTS' : 'NULL'}</p>
            <p className="text-sm">Phases count: {phases.length}</p>
            {document && (
              <p className="text-sm truncate">Document URL: {document.fileUrl}</p>
            )}
          </div>
        )}

        {/* Introduction */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Item Price List</h2>
          <p className="text-gray-600 mb-4">
            Our comprehensive academic writing services are structured in phases to support your research journey from inception to defense. Each service is priced according to the academic level of your project.
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Expert academic writers</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Plagiarism-free content</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Timely delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <FaCheckCircle className="text-green-500" />
              <span>Unlimited revisions</span>
            </div>
          </div>
        </div>

        {/* Document Download (Priority Display) */}
        {document && document.fileUrl ? (
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center flex-shrink-0">
                <FaFileWord className="text-white text-4xl" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-bold text-white mb-2">Download Our Complete Price List</h3>
                <p className="text-blue-100 mb-1">{document.fileName}</p>
                {document.fileSize && (
                  <p className="text-blue-200 text-sm">
                    File size: {(document.fileSize / 1024).toFixed(2)} KB
                  </p>
                )}
              </div>
              <a
                href={document.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition font-semibold shadow-lg"
              >
                <FaDownload className="text-xl" />
                <span>Download Document</span>
              </a>
            </div>
          </div>
        ) : null}

        {/* Phases and Services (Fallback or Additional Info) */}
        {!document && phases.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-600 text-lg">No services available at the moment. Please check back later.</p>
          </div>
        ) : !document && phases.length > 0 ? (
          <div className="space-y-8">
            {phases.map((phase, phaseIndex) => (
              <div key={phase.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
                {/* Phase Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
                  <h3 className="text-2xl font-bold mb-2">{phase.name}</h3>
                  {phase.description && (
                    <p className="text-blue-100">{phase.description}</p>
                  )}
                </div>

                {/* Service Items Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3">
                          Service Item
                        </th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 w-1/3">
                          Description
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 w-1/12">
                          Bachelor
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 w-1/12">
                          Master
                        </th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 w-1/12">
                          PhD
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {phase.serviceItems.map((item, itemIndex) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{item.name}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600">{item.description}</div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 rounded-full font-semibold">
                              GHS {item.bachelorPrice.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center justify-center px-3 py-1 bg-purple-100 text-purple-800 rounded-full font-semibold">
                              GHS {item.masterPrice.toLocaleString()}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="inline-flex items-center justify-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full font-semibold">
                              GHS {item.phdPrice.toLocaleString()}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-8 mt-12 text-center text-white">
          <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Get Started?</h3>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Contact us today to discuss your academic writing needs and get a customized quote for your project.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition font-semibold"
            >
              Contact Us
            </Link>
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition font-semibold border-2 border-white"
            >
              Get a Quote
            </Link>
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-3xl mb-3">📝</div>
            <h4 className="font-bold text-gray-900 mb-2">Custom Packages</h4>
            <p className="text-gray-600 text-sm">
              Need multiple services? We offer discounted package deals for comprehensive project support.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-3xl mb-3">⚡</div>
            <h4 className="font-bold text-gray-900 mb-2">Fast Turnaround</h4>
            <p className="text-gray-600 text-sm">
              Urgent deadline? We offer expedited services with rush delivery options available.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-blue-600 text-3xl mb-3">🎓</div>
            <h4 className="font-bold text-gray-900 mb-2">Expert Support</h4>
            <p className="text-gray-600 text-sm">
              Our team includes PhD holders and experienced academic writers across various disciplines.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
