'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaCheck, FaTimes, FaTrash, FaStar } from 'react-icons/fa'

interface Review {
    id: string
    clientName: string
    clientCompany: string | null
    content: string
    rating: number
    isApproved: boolean
    createdAt: string
}

export default function ReviewsPage() {
    const router = useRouter()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('admin_token')
        if (!token) {
            router.push('/admin/login')
            return
        }
        fetchReviews()
    }, [router])

    const fetchReviews = async () => {
        try {
            const token = localStorage.getItem('admin_token')
            const res = await fetch('/api/v1/admin/reviews', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                setReviews(data.data)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        setUpdating(id)
        try {
            const token = localStorage.getItem('admin_token')
            const res = await fetch(`/api/v1/admin/reviews/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ isApproved: !currentStatus })
            })
            const data = await res.json()
            if (data.success) {
                setReviews(reviews.map(r => r.id === id ? { ...r, isApproved: !currentStatus } : r))
            }
        } catch (e) {
            console.error(e)
        } finally {
            setUpdating(null)
        }
    }

    const deleteReview = async (id: string) => {
        if (!confirm('Are you sure you want to delete this review?')) return
        setUpdating(id)
        try {
            const token = localStorage.getItem('admin_token')
            const res = await fetch(`/api/v1/admin/reviews/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                setReviews(reviews.filter(r => r.id !== id))
            }
        } catch (e) {
            console.error(e)
        } finally {
            setUpdating(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Client Reviews</h1>
                <p className="text-gray-500 mt-1">Manage testimonials shown on the homepage</p>
            </div>

            {reviews.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
                    <p className="text-gray-500 font-medium">No reviews yet</p>
                    <p className="text-gray-400 text-sm mt-1">When clients submit reviews, they will appear here for approval.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <div key={review.id} className={`bg-white rounded-xl shadow-sm border p-6 transition-colors ${review.isApproved ? 'border-green-200' : 'border-yellow-200'}`}>
                            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
                                <div>
                                    <h3 className="font-semibold text-gray-900 text-lg">{review.clientName}</h3>
                                    {review.clientCompany && (
                                        <p className="text-sm text-gray-500">{review.clientCompany}</p>
                                    )}
                                    <div className="flex items-center gap-1 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${review.isApproved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {review.isApproved ? 'Approved (Visible)' : 'Pending (Hidden)'}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-2">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-700 italic mb-6">"{review.content}"</p>

                            <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => toggleApproval(review.id, review.isApproved)}
                                    disabled={updating === review.id}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${review.isApproved
                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                                        }`}
                                >
                                    {review.isApproved ? <FaTimes /> : <FaCheck />}
                                    {review.isApproved ? 'Hide from Website' : 'Approve & Publish'}
                                </button>
                                <button
                                    onClick={() => deleteReview(review.id)}
                                    disabled={updating === review.id}
                                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                    <FaTrash /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
