'use client'

import { useState } from 'react'
import Link from 'next/link'

const packages = [
  {
    name: 'Starter',
    price: 'Custom',
    description: 'Perfect for small projects and startups',
    features: [
      'Single page website',
      'Up to 5 sections',
      'Mobile responsive',
      'Contact form',
      'Basic SEO setup',
      '2 weeks delivery'
    ]
  },
  {
    name: 'Professional',
    price: 'Custom',
    description: 'Ideal for growing businesses',
    features: [
      'Multi-page website (up to 8 pages)',
      'Custom design',
      'CMS integration',
      'Advanced SEO',
      'Analytics setup',
      'Social media integration',
      '4-6 weeks delivery'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale solutions for complex needs',
    features: [
      'Unlimited pages',
      'Custom functionality',
      'API integrations',
      'Database development',
      'Third-party integrations',
      'Dedicated support',
      'Ongoing maintenance',
      'Flexible timeline'
    ]
  }
]

const services = [
  {
    category: 'Web Development',
    items: [
      { name: 'Landing Page', price: 'From GHS 2,500' },
      { name: 'Business Website', price: 'From GHS 5,000' },
      { name: 'E-commerce Website', price: 'From GHS 12,000' },
      { name: 'Custom Web Application', price: 'From GHS 20,000' }
    ]
  },
  {
    category: 'Mobile Development',
    items: [
      { name: 'Simple Mobile App', price: 'From GHS 15,000' },
      { name: 'Cross-platform App', price: 'From GHS 25,000' },
      { name: 'Native iOS/Android', price: 'From GHS 40,000' }
    ]
  },
  {
    category: 'Design Services',
    items: [
      { name: 'Logo Design', price: 'From GHS 800' },
      { name: 'Brand Identity Package', price: 'From GHS 2,500' },
      { name: 'UI/UX Design', price: 'From GHS 3,000' },
      { name: 'Marketing Materials', price: 'From GHS 500' }
    ]
  },
  {
    category: 'IT & Support',
    items: [
      { name: 'IT Consultation', price: 'GHS 500/hour' },
      { name: 'Network Setup', price: 'From GHS 3,000' },
      { name: 'Monthly Maintenance', price: 'From GHS 1,500/month' }
    ]
  },
  {
    category: 'Analytics & Data',
    items: [
      { name: 'Analytics Setup', price: 'From GHS 2,000' },
      { name: 'Dashboard Development', price: 'From GHS 8,000' },
      { name: 'Data Science Consulting', price: 'From GHS 5,000' }
    ]
  }
]

export default function PricingPage() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null)

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
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            <span className="text-sm font-medium">Transparent Pricing</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">Pricing</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Clear, upfront pricing for all our services. Get a custom quote for your specific project needs.
          </p>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4">Website Packages</h2>
            <p className="text-gray-600">Choose the package that fits your needs</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {packages.map((pkg) => (
              <div 
                key={pkg.name}
                className={`bento-card relative cursor-pointer transition-all duration-300 ${pkg.popular ? 'ring-2 ring-accent shadow-xl' : ''}`}
                onClick={() => setSelectedPackage(selectedPackage === pkg.name ? null : pkg.name)}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-heading font-bold mb-2">{pkg.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{pkg.description}</p>
                  <p className="text-4xl font-bold text-primary">{pkg.price}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-600 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/contact" className={`w-full text-center ${pkg.popular ? 'btn-accent' : 'btn-primary'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Pricing */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4">Service Pricing Guide</h2>
            <p className="text-gray-600">Estimated prices for common services. Final pricing depends on project complexity.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.category} className="bento-card">
                <h3 className="text-xl font-heading font-bold mb-4 text-primary">{service.category}</h3>
                <ul className="space-y-3">
                  {service.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-gray-100 pb-3">
                      <span className="text-gray-700 text-sm">{item.name}</span>
                      <span className="text-sm font-semibold text-accent">{item.price}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-text mb-4">Pricing FAQ</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { q: "Why don't you show exact prices?", a: "Every project is unique. The price depends on your specific requirements, complexity, and timeline. We provide detailed quotes after understanding your needs." },
              { q: "Do you offer payment plans?", a: "Yes! We typically structure payments as 50% upfront, 30% at mid-project, and 20% upon delivery. Custom arrangements are available for larger projects." },
              { q: "What payment methods do you accept?", a: "We accept bank transfers, Mobile Money (MTN MoMo), and card payments through our secure payment gateway." },
              { q: "Is there a warranty?", a: "Yes, all projects come with a 30-day warranty period for bug fixes. We also offer ongoing maintenance packages." },
            ].map((faq, idx) => (
              <div key={idx} className="bento-card">
                <h3 className="font-heading font-semibold mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-secondary to-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Get a free consultation and custom quote for your project. No obligations!
          </p>
          <Link href="/contact" className="btn-accent text-lg px-8 py-4 cursor-pointer">
            Request a Quote
          </Link>
        </div>
      </section>
    </div>
  )
}
