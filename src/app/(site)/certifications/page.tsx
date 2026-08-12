import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Certifications | RAME Tech Consultancy',
    description: 'Our professional certifications and accreditations.',
}

const certifications = [
    {
        title: 'Business Registration',
        issuer: 'Registrar General\'s Department, Ghana',
        description: 'Officially registered and incorporated as a Limited Liability Company in Ghana.',
        icon: 'FaFileContract'
    },
    {
        title: 'Software Engineering Professional',
        issuer: 'Industry Standard',
        description: 'Certified professionals in modern software engineering practices and methodologies.',
        icon: 'FaCode'
    },
    {
        title: 'Cloud Architecture',
        issuer: 'Cloud Providers',
        description: 'Certified in designing and implementing scalable cloud solutions.',
        icon: 'FaCloud'
    }
]

export default function CertificationsPage() {
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {certifications.map((cert, index) => (
                            <div key={index} className="bento-card hover:shadow-card-hover transition-all duration-300">
                                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-heading font-semibold text-text mb-2">{cert.title}</h3>
                                <p className="text-sm font-medium text-primary mb-4">{cert.issuer}</p>
                                <p className="text-gray-600">{cert.description}</p>
                            </div>
                        ))}
                    </div>
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
