'use client'

import { useState, useEffect } from 'react'
import { FaFileContract, FaCode, FaCloud, FaCertificate } from 'react-icons/fa'

interface Certification {
    id: string
    title: string
    issuer: string
    description: string
    icon: string | null
    imageUrl: string | null
    order: number
    isActive: boolean
}

const iconMap: Record<string, React.ReactNode> = {
    FaFileContract: <FaFileContract className="w-8 h-8 text-primary" />,
    FaCode: <FaCode className="w-8 h-8 text-primary" />,
    FaCloud: <FaCloud className="w-8 h-8 text-primary" />,
    FaCertificate: <FaCertificate className="w-8 h-8 text-primary" />
}

export default function CertificationsPage() {
    const [certifications, setCertifications] = useState<Certification[]>([])
    const [businessCertUrl, setBusinessCertUrl] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch dynamic certifications
                const certsRes = await fetch(`/api/v1/certifications?t=${Date.now()}`)
                const certsData = await certsRes.json()
                if (certsData.success) {
                    setCertifications(certsData.data)
                }

                // Fetch business certificate from settings
                const settingsRes = await fetch(`/api/v1/settings?t=${Date.now()}`)
                const settingsData = await settingsRes.json()
                if (settingsData.success && settingsData.data?.businessRegistrationUrl) {
                    setBusinessCertUrl(settingsData.data.businessRegistrationUrl)
                }
            } catch (error) {
                console.error('Failed to fetch certifications data:', error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary via-secondary to-primary text-white py-20 md:py-28 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                    <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                        <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        <span className="text-sm font-medium">Accreditations</span>
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">Our Certifications</h1>
                    <p className="text-xl text-white/80 max-w-2xl mx-auto">
                        Professional accreditations and certifications that demonstrate our commitment to excellence and quality.
                    </p>
                </div>
            </section>

            {/* Certifications Content */}
            <section className="py-16 md:py-24 bg-background">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {isLoading ? (
                        <div className="flex justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Always show Business Registration if uploaded */}
                            {businessCertUrl && (
                                <div className="bento-card hover:shadow-card-hover transition-all duration-300">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                        <FaFileContract className="w-8 h-8 text-primary" />
                                    </div>
                                    <h3 className="text-xl font-heading font-semibold text-text mb-2">Business Registration</h3>
                                    <p className="text-sm font-medium text-primary mb-4">Registrar General's Department, Ghana</p>
                                    <p className="text-gray-600 mb-6">Officially registered and incorporated as a Limited Liability Company in Ghana.</p>
                                    <a
                                        href={businessCertUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-primary font-medium hover:text-primaryDark transition-colors"
                                    >
                                        View Certificate <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                    </a>
                                </div>
                            )}

                            {/* Dynamic Certifications */}
                            {certifications.map((cert) => (
                                <div key={cert.id} className="bento-card hover:shadow-card-hover transition-all duration-300">
                                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                        {cert.icon && iconMap[cert.icon] ? iconMap[cert.icon] : <FaCertificate className="w-8 h-8 text-primary" />}
                                    </div>
                                    <h3 className="text-xl font-heading font-semibold text-text mb-2">{cert.title}</h3>
                                    <p className="text-sm font-medium text-primary mb-4">{cert.issuer}</p>
                                    <p className="text-gray-600 mb-6">{cert.description}</p>
                                    {cert.imageUrl && (
                                        <a
                                            href={cert.imageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-primary font-medium hover:text-primaryDark transition-colors"
                                        >
                                            View Certificate <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-secondary to-primary text-white">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Work With Certified Professionals</h2>
                    <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
                        Ready to start your next project with a team you can trust?
                    </p>
                    <a href="/contact" className="btn-accent text-lg px-8 py-4 cursor-pointer">
                        Get a Quote
                    </a>
                </div>
            </section>
        </div>
    )
}
