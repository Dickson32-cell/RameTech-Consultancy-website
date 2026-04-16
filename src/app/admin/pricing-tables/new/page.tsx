'use client'

import { useState, useEffect, FormEvent, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa'

interface Department {
  id: string
  name: string
}

interface PricingTier {
  name: string
  price: string
  features: string[]
  highlighted: boolean
}

function NewPricingTableForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const departmentIdFromUrl = searchParams.get('departmentId')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [departments, setDepartments] = useState<Department[]>([])

  const [formData, setFormData] = useState({
    departmentId: departmentIdFromUrl || '',
    name: '',
    description: '',
    tableType: 'simple',
    isActive: true
  })

  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    { name: 'Basic', price: '0', features: [''], highlighted: false }
  ])

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
      const token = localStorage.getItem('admin_token')
      const response = await fetch('/api/v1/admin/departments', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const result = await response.json()
      if (result.success) {
        setDepartments(result.data || [])
      }
    } catch (err) {
      console.error('Error fetching departments:', err)
    }
  }

  const addPricingTier = () => {
    setPricingTiers([
      ...pricingTiers,
      { name: '', price: '', features: [''], highlighted: false }
    ])
  }

  const removePricingTier = (index: number) => {
    setPricingTiers(pricingTiers.filter((_, i) => i !== index))
  }

  const updateTier = (index: number, field: keyof PricingTier, value: any) => {
    const updated = [...pricingTiers]
    updated[index] = { ...updated[index], [field]: value }
    setPricingTiers(updated)
  }

  const addFeature = (tierIndex: number) => {
    const updated = [...pricingTiers]
    updated[tierIndex].features.push('')
    setPricingTiers(updated)
  }

  const removeFeature = (tierIndex: number, featureIndex: number) => {
    const updated = [...pricingTiers]
    updated[tierIndex].features = updated[tierIndex].features.filter((_, i) => i !== featureIndex)
    setPricingTiers(updated)
  }

  const updateFeature = (tierIndex: number, featureIndex: number, value: string) => {
    const updated = [...pricingTiers]
    updated[tierIndex].features[featureIndex] = value
    setPricingTiers(updated)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const submitData = {
        ...formData,
        data: {
          tiers: pricingTiers.map(tier => ({
            ...tier,
            features: tier.features.filter(f => f.trim() !== '')
          }))
        }
      }

      const response = await fetch('/api/v1/admin/pricing-tables', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()

      if (result.success) {
        router.push(`/admin/departments/${formData.departmentId}`)
      } else {
        setError(result.error || 'Failed to create pricing table')
      }
    } catch (err) {
      setError('An error occurred while creating the pricing table')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          href={departmentIdFromUrl ? `/admin/departments/${departmentIdFromUrl}` : '/admin/departments'}
          className="text-blue-600 hover:text-blue-800 text-sm inline-flex items-center gap-2"
        >
          <FaArrowLeft /> Back
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Add New Pricing Table</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Department */}
          <div>
            <label htmlFor="departmentId" className="block text-sm font-medium text-gray-700 mb-2">
              Department *
            </label>
            <select
              id="departmentId"
              value={formData.departmentId}
              onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Table Name *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Standard Pricing, Enterprise Pricing"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Brief description of this pricing table..."
            />
          </div>

          {/* Table Type */}
          <div>
            <label htmlFor="tableType" className="block text-sm font-medium text-gray-700 mb-2">
              Table Type
            </label>
            <select
              id="tableType"
              value={formData.tableType}
              onChange={(e) => setFormData({ ...formData, tableType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="simple">Simple</option>
              <option value="academic">Academic</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          {/* Pricing Tiers */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Pricing Tiers</h3>
              <button
                type="button"
                onClick={addPricingTier}
                className="inline-flex items-center px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
              >
                <FaPlus className="mr-1" size={12} />
                Add Tier
              </button>
            </div>

            <div className="space-y-6">
              {pricingTiers.map((tier, tierIndex) => (
                <div key={tierIndex} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">Tier {tierIndex + 1}</h4>
                    {pricingTiers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePricingTier(tierIndex)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <FaTrash size={14} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tier Name *
                      </label>
                      <input
                        type="text"
                        value={tier.name}
                        onChange={(e) => updateTier(tierIndex, 'name', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., Basic, Pro, Enterprise"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price *
                      </label>
                      <input
                        type="text"
                        value={tier.price}
                        onChange={(e) => updateTier(tierIndex, 'price', e.target.value)}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., $99/month, Free, Contact us"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={tier.highlighted}
                        onChange={(e) => updateTier(tierIndex, 'highlighted', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-900">Highlight this tier (most popular)</span>
                    </label>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Features
                      </label>
                      <button
                        type="button"
                        onClick={() => addFeature(tierIndex)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        + Add Feature
                      </button>
                    </div>

                    <div className="space-y-2">
                      {tier.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex gap-2">
                          <input
                            type="text"
                            value={feature}
                            onChange={(e) => updateFeature(tierIndex, featureIndex, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                            placeholder="e.g., 10GB Storage, 24/7 Support"
                          />
                          {tier.features.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeFeature(tierIndex, featureIndex)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <FaTrash size={14} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Status */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Active (visible to public)
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Creating...' : 'Create Pricing Table'}
            </button>
            <Link
              href={departmentIdFromUrl ? `/admin/departments/${departmentIdFromUrl}` : '/admin/departments'}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function NewPricingTablePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    }>
      <NewPricingTableForm />
    </Suspense>
  )
}
