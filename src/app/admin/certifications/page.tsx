'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FaPlus, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa'

interface Certification {
    id: string
    title: string
    issuer: string
    description: string
    icon: string | null
    order: number
    isActive: boolean
}

export default function AdminCertificationsPage() {
    const router = useRouter()
    const [certifications, setCertifications] = useState<Certification[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const token = localStorage.getItem('admin_token')
        if (!token) {
            router.push('/admin/login')
            return
        }
        fetchCertifications()
    }, [router])

    const fetchCertifications = async () => {
        try {
            const token = localStorage.getItem('admin_token')
            const res = await fetch('/api/v1/admin/certifications', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) setCertifications(data.data)
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this certification?')) return
        try {
            const token = localStorage.getItem('admin_token')
            await fetch(`/api/v1/admin/certifications/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            setCertifications(certifications.filter(c => c.id !== id))
        } catch (e) { console.error(e) }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Certifications</h1>
                    <p className="text-gray-500 mt-1">{certifications.length} certifications</p>
                </div>
                <Link href="/admin/certifications/new" className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark whitespace-nowrap">
                    <FaPlus /> Add Certification
                </Link>
            </div>

            {certifications.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <p className="text-gray-500">No certifications yet.</p>
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Order</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Issuer</th>
                                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                                    <th className="text-right px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {certifications.map((cert) => (
                                    <tr key={cert.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-500">{cert.order}</td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{cert.title}</div>
                                            <div className="text-sm text-gray-500 truncate max-w-xs">{cert.description}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{cert.issuer}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1 text-sm ${cert.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                                {cert.isActive ? <FaCheck /> : <FaTimes />} {cert.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/admin/certifications/${cert.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"><FaEdit /></Link>
                                                <button onClick={() => handleDelete(cert.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg"><FaTrash /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {certifications.map((cert) => (
                            <div key={cert.id} className="bg-white rounded-xl shadow-sm p-4">
                                <div className="flex items-start justify-between gap-3 mb-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-medium text-gray-900">{cert.title}</h3>
                                        <p className="text-sm text-gray-500 line-clamp-2 mt-1">{cert.description}</p>
                                        <p className="text-xs text-gray-400 mt-1">{cert.issuer}</p>
                                    </div>
                                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded flex-shrink-0">
                                        #{cert.order}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 mb-4">
                                    <span className={`inline-flex items-center gap-1 text-sm ${cert.isActive ? 'text-green-600' : 'text-red-500'}`}>
                                        {cert.isActive ? <FaCheck /> : <FaTimes />} {cert.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                                <div className="flex gap-2 pt-3 border-t">
                                    <Link href={`/admin/certifications/${cert.id}`} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                                        <FaEdit /> Edit
                                    </Link>
                                    <button onClick={() => handleDelete(cert.id)} className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
