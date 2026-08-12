'use client'

import { useState, useEffect } from 'react'
import { FaStar, FaTimes } from 'react-icons/fa'

interface Review {
  id: string
  clientName: string
  clientCompany: string | null
  content: string
  rating: number
}

const defaultTestimonials: Review[] = [
  {
    id: '1',
    clientName: 'Kwame Asante',
    clientCompany: 'TechStart Ghana',
    content: 'RAME Tech transformed our outdated systems into a modern, efficient platform. Their analytics solutions helped us increase revenue by 40% in just 6 months.',
    rating: 5
  },
  {
    id: '2',
    clientName: 'Ama Serwaa',
    clientCompany: 'MKT Solutions',
    content: 'The marketing research from RAME Tech gave us insights we never knew existed. Their data-driven approach revolutionized our entire marketing strategy.',
    rating: 5
  }
]

export default function TestimonialCarousel() {
  const [testimonials, setTestimonials] = useState<Review[]>(defaultTestimonials)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ clientName: '', clientCompany: '', content: '', rating: 5 })
  const [submitting, setSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/v1/reviews')
        const data = await res.json()
        if (data.success && data.data && data.data.length > 0) {
          setTestimonials(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      }
    }
    fetchReviews()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitMessage(null)

    try {
      const res = await fetch('/api/v1/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      const data = await res.json()

      if (data.success) {
        setSubmitMessage({ type: 'success', text: 'Thank you! Your review has been submitted and is pending approval.' })
        setFormData({ clientName: '', clientCompany: '', content: '', rating: 5 })
        setTimeout(() => {
          setShowModal(false)
          setSubmitMessage(null)
        }, 3000)
      } else {
        setSubmitMessage({ type: 'error', text: data.error || 'Failed to submit review.' })
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-background to-secondary/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16 relative">
          <span className="text-accent font-semibold text-sm uppercase tracking-wider">Testimonials</span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-text mt-3 mb-4">
            What Our Clients Say
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4 mb-6">
            Don't just take our word for it. Here's what our clients have to say about working with RAME Tech.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primaryDark transition-colors shadow-md"
          >
            <FaStar className="text-yellow-400" /> Leave a Review
          </button>
        </div>

        {/* Carousel */}
        {testimonials.length > 0 && (
          <div className="relative max-w-4xl mx-auto">
            {/* Navigation Arrows */}
            {testimonials.length > 1 && (
              <>
                <button
                  onClick={goToPrev}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-200 z-10 cursor-pointer"
                  aria-label="Previous testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={goToNext}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white shadow-lg rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all duration-200 z-10 cursor-pointer"
                  aria-label="Next testimonial"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Testimonial Card */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl md:text-4xl font-bold shadow-lg">
                    {testimonials[currentIndex].clientName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  {/* Quote Icon */}
                  <svg className="w-10 h-10 text-primary/20 mb-4 mx-auto md:mx-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>

                  {/* Star Rating */}
                  <div className="flex justify-center md:justify-start gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-lg md:text-xl text-gray-700 mb-6 leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </p>

                  {/* Author Info */}
                  <div>
                    <p className="font-heading font-bold text-lg text-text">{testimonials[currentIndex].clientName}</p>
                    {testimonials[currentIndex].clientCompany && (
                      <p className="text-gray-500 text-sm">{testimonials[currentIndex].clientCompany}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Dots Navigation */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`h-3 rounded-full transition-all duration-300 cursor-pointer ${index === currentIndex
                        ? 'bg-primary w-8'
                        : 'bg-gray-300 hover:bg-gray-400 w-3'
                      }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Leave a Review</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6">
              {submitMessage ? (
                <div className={`p-4 rounded-lg text-center ${submitMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                  {submitMessage.text}
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.clientName}
                      onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company / Role (Optional)</label>
                    <input
                      type="text"
                      value={formData.clientCompany}
                      onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFormData({ ...formData, rating: star })}
                          className="focus:outline-none"
                        >
                          <FaStar className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Review *</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primaryDark transition-colors disabled:opacity-50"
                  >
                    {submitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
