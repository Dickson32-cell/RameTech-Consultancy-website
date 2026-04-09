'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes, FaChevronDown, FaChevronUp, FaFileWord, FaDownload, FaUpload } from 'react-icons/fa'

interface ServiceItem {
  id: string
  name: string
  description: string
  bachelorPrice: number
  masterPrice: number
  phdPrice: number
  order: number
  isActive: boolean
}

interface Phase {
  id: string
  name: string
  description: string | null
  order: number
  isActive: boolean
  serviceItems: ServiceItem[]
}

interface Document {
  id: string
  fileName: string
  fileUrl: string
  fileSize: number | null
  description: string | null
  createdAt: string
  isActive: boolean
}

export default function AcademicWritingPage() {
  const router = useRouter()
  const [phases, setPhases] = useState<Phase[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set())

  // Document management state
  const [documents, setDocuments] = useState<Document[]>([])
  const [uploadingDocument, setUploadingDocument] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Phase form state
  const [showPhaseForm, setShowPhaseForm] = useState(false)
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null)
  const [phaseForm, setPhaseForm] = useState({
    name: '',
    description: '',
    order: 0,
    isActive: true
  })

  // Service Item form state
  const [showServiceItemForm, setShowServiceItemForm] = useState(false)
  const [editingServiceItem, setEditingServiceItem] = useState<ServiceItem | null>(null)
  const [selectedPhaseId, setSelectedPhaseId] = useState('')
  const [serviceItemForm, setServiceItemForm] = useState({
    name: '',
    description: '',
    bachelorPrice: 0,
    masterPrice: 0,
    phdPrice: 0,
    order: 0,
    isActive: true
  })

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    fetchPhases()
    fetchDocuments()
  }, [router])

  const fetchPhases = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/academic-writing/phases', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setPhases(result.data)
      } else {
        setError(result.error || 'Failed to fetch phases')
      }
    } catch (err) {
      setError('An error occurred while fetching phases')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const togglePhaseExpansion = (phaseId: string) => {
    setExpandedPhases(prev => {
      const newSet = new Set(prev)
      if (newSet.has(phaseId)) {
        newSet.delete(phaseId)
      } else {
        newSet.add(phaseId)
      }
      return newSet
    })
  }

  // Phase CRUD operations
  const openPhaseForm = (phase?: Phase) => {
    if (phase) {
      setEditingPhase(phase)
      setPhaseForm({
        name: phase.name,
        description: phase.description || '',
        order: phase.order,
        isActive: phase.isActive
      })
    } else {
      setEditingPhase(null)
      setPhaseForm({
        name: '',
        description: '',
        order: phases.length,
        isActive: true
      })
    }
    setShowPhaseForm(true)
  }

  const savePhase = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const url = editingPhase
        ? `/api/v1/admin/academic-writing/phases/${editingPhase.id}`
        : '/api/v1/admin/academic-writing/phases'

      const response = await fetch(url, {
        method: editingPhase ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(phaseForm)
      })

      const result = await response.json()

      if (result.success) {
        setShowPhaseForm(false)
        fetchPhases()
      } else {
        alert(result.error || 'Failed to save phase')
      }
    } catch (err) {
      alert('An error occurred while saving phase')
      console.error(err)
    }
  }

  const deletePhase = async (id: string) => {
    if (!confirm('Are you sure you want to delete this phase? All associated service items will also be deleted.')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/academic-writing/phases/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        fetchPhases()
      } else {
        alert(result.error || 'Failed to delete phase')
      }
    } catch (err) {
      alert('An error occurred while deleting phase')
      console.error(err)
    }
  }

  // Service Item CRUD operations
  const openServiceItemForm = (phaseId: string, serviceItem?: ServiceItem) => {
    setSelectedPhaseId(phaseId)

    if (serviceItem) {
      setEditingServiceItem(serviceItem)
      setServiceItemForm({
        name: serviceItem.name,
        description: serviceItem.description,
        bachelorPrice: serviceItem.bachelorPrice,
        masterPrice: serviceItem.masterPrice,
        phdPrice: serviceItem.phdPrice,
        order: serviceItem.order,
        isActive: serviceItem.isActive
      })
    } else {
      setEditingServiceItem(null)
      const phase = phases.find(p => p.id === phaseId)
      setServiceItemForm({
        name: '',
        description: '',
        bachelorPrice: 0,
        masterPrice: 0,
        phdPrice: 0,
        order: phase?.serviceItems.length || 0,
        isActive: true
      })
    }
    setShowServiceItemForm(true)
  }

  const saveServiceItem = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const url = editingServiceItem
        ? `/api/v1/admin/academic-writing/service-items/${editingServiceItem.id}`
        : '/api/v1/admin/academic-writing/service-items'

      const body = editingServiceItem
        ? serviceItemForm
        : { ...serviceItemForm, phaseId: selectedPhaseId }

      const response = await fetch(url, {
        method: editingServiceItem ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.success) {
        setShowServiceItemForm(false)
        fetchPhases()
      } else {
        alert(result.error || 'Failed to save service item')
      }
    } catch (err) {
      alert('An error occurred while saving service item')
      console.error(err)
    }
  }

  const deleteServiceItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this service item?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/academic-writing/service-items/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        fetchPhases()
      } else {
        alert(result.error || 'Failed to delete service item')
      }
    } catch (err) {
      alert('An error occurred while deleting service item')
      console.error(err)
    }
  }

  // Document Management Functions
  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/academic-writing/document', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        setDocuments(result.data)
      }
    } catch (err) {
      console.error('Error fetching documents:', err)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Check if file is a Word document
      const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword' // .doc
      ]

      if (!allowedTypes.includes(file.type)) {
        alert('Please upload a Word document (.doc or .docx)')
        return
      }

      setSelectedFile(file)
    }
  }

  const uploadDocument = async () => {
    if (!selectedFile) {
      alert('Please select a file first')
      return
    }

    setUploadingDocument(true)

    try {
      const token = localStorage.getItem('admin_token')
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/v1/admin/academic-writing/document', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        alert('Document uploaded successfully!')
        setSelectedFile(null)
        fetchDocuments()
      } else {
        alert(result.error || 'Failed to upload document')
      }
    } catch (err) {
      alert('An error occurred while uploading document')
      console.error(err)
    } finally {
      setUploadingDocument(false)
    }
  }

  const deleteDocument = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) {
      return
    }

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`/api/v1/admin/academic-writing/document/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (result.success) {
        alert('Document deleted successfully')
        fetchDocuments()
      } else {
        alert(result.error || 'Failed to delete document')
      }
    } catch (err) {
      alert('An error occurred while deleting document')
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Academic Writing Services</h1>
        <button
          onClick={() => openPhaseForm()}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <FaPlus /> Add Phase
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Document Upload Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaFileWord className="text-blue-600" />
          Price List Document
        </h2>
        <p className="text-gray-600 text-sm mb-4">
          Upload a Word document (.doc or .docx) containing the Academic Writing service price list.
          Only one document can be active at a time.
        </p>

        {/* Upload Form */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <input
              type="file"
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileSelect}
              className="flex-1 text-sm"
              disabled={uploadingDocument}
            />
            <button
              onClick={uploadDocument}
              disabled={!selectedFile || uploadingDocument}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {uploadingDocument ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Uploading...
                </>
              ) : (
                <>
                  <FaUpload /> Upload
                </>
              )}
            </button>
          </div>
          {selectedFile && (
            <p className="text-sm text-gray-600 mt-2">
              Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Current Documents */}
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-3">Current Documents</h3>
          {documents.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No documents uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    doc.isActive ? 'border-green-300 bg-green-50' : 'border-gray-300 bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FaFileWord className="text-blue-600 text-2xl flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{doc.fileName}</p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-1">
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        {doc.fileSize && <span>{(doc.fileSize / 1024).toFixed(2)} KB</span>}
                        {doc.isActive && (
                          <span className="text-green-600 font-semibold">● ACTIVE</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                      title="Download"
                    >
                      <FaDownload />
                    </a>
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Phases List */}
      <div className="space-y-4">
        {phases.map((phase) => (
          <div key={phase.id} className="bg-white rounded-lg shadow-md">
            {/* Phase Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePhaseExpansion(phase.id)}
                      className="text-gray-600 hover:text-gray-800"
                    >
                      {expandedPhases.has(phase.id) ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{phase.name}</h3>
                      {phase.description && (
                        <p className="text-gray-600 text-sm mt-1">{phase.description}</p>
                      )}
                      <p className="text-gray-500 text-xs mt-1">
                        {phase.serviceItems.length} service item(s) | Order: {phase.order}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    phase.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {phase.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <button
                    onClick={() => openPhaseForm(phase)}
                    className="text-blue-600 hover:text-blue-800 p-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => deletePhase(phase.id)}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>

            {/* Service Items (Expandable) */}
            {expandedPhases.has(phase.id) && (
              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold text-gray-700">Service Items</h4>
                  <button
                    onClick={() => openServiceItemForm(phase.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm"
                  >
                    <FaPlus size={12} /> Add Service Item
                  </button>
                </div>

                {phase.serviceItems.length === 0 ? (
                  <p className="text-gray-500 text-sm">No service items yet.</p>
                ) : (
                  <div className="space-y-3">
                    {phase.serviceItems.map((item) => (
                      <div key={item.id} className="bg-white p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h5 className="font-semibold text-gray-800">{item.name}</h5>
                            <p className="text-gray-600 text-sm mt-1">{item.description}</p>
                            <div className="flex gap-4 mt-2 text-sm">
                              <span className="text-blue-600 font-medium">
                                Bachelor: GHS {item.bachelorPrice}
                              </span>
                              <span className="text-purple-600 font-medium">
                                Master: GHS {item.masterPrice}
                              </span>
                              <span className="text-indigo-600 font-medium">
                                PhD: GHS {item.phdPrice}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <button
                              onClick={() => openServiceItemForm(phase.id, item)}
                              className="text-blue-600 hover:text-blue-800 p-1.5"
                            >
                              <FaEdit size={14} />
                            </button>
                            <button
                              onClick={() => deleteServiceItem(item.id)}
                              className="text-red-600 hover:text-red-800 p-1.5"
                            >
                              <FaTrash size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {phases.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No phases yet. Click "Add Phase" to get started.
        </div>
      )}

      {/* Phase Form Modal */}
      {showPhaseForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {editingPhase ? 'Edit Phase' : 'Add Phase'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={phaseForm.name}
                  onChange={(e) => setPhaseForm({ ...phaseForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={phaseForm.description}
                  onChange={(e) => setPhaseForm({ ...phaseForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={phaseForm.order}
                  onChange={(e) => setPhaseForm({ ...phaseForm, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={phaseForm.isActive}
                  onChange={(e) => setPhaseForm({ ...phaseForm, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Active</label>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={savePhase}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowPhaseForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Service Item Form Modal */}
      {showServiceItemForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">
              {editingServiceItem ? 'Edit Service Item' : 'Add Service Item'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={serviceItemForm.name}
                  onChange={(e) => setServiceItemForm({ ...serviceItemForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={serviceItemForm.description}
                  onChange={(e) => setServiceItemForm({ ...serviceItemForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bachelor Price (GHS)</label>
                <input
                  type="number"
                  value={serviceItemForm.bachelorPrice}
                  onChange={(e) => setServiceItemForm({ ...serviceItemForm, bachelorPrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Master Price (GHS)</label>
                <input
                  type="number"
                  value={serviceItemForm.masterPrice}
                  onChange={(e) => setServiceItemForm({ ...serviceItemForm, masterPrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">PhD Price (GHS)</label>
                <input
                  type="number"
                  value={serviceItemForm.phdPrice}
                  onChange={(e) => setServiceItemForm({ ...serviceItemForm, phdPrice: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <input
                  type="number"
                  value={serviceItemForm.order}
                  onChange={(e) => setServiceItemForm({ ...serviceItemForm, order: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={serviceItemForm.isActive}
                  onChange={(e) => setServiceItemForm({ ...serviceItemForm, isActive: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">Active</label>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={saveServiceItem}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setShowServiceItemForm(false)}
                className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
