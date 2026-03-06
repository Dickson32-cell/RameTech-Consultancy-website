'use client'

import Link from 'next/link'

export default function CTASection() {
  return (
    <section className="py-16 bg-accent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Transform Your Business?
        </h2>
        <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Let's discuss your project and how we can help you achieve your goals.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact" className="bg-white text-accent px-8 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors">
            Get a Free Quote
          </Link>
          <Link href="/contact" className="border-2 border-white text-white px-8 py-3 rounded-md font-semibold hover:bg-white/10 transition-colors">
            Schedule Consultation
          </Link>
        </div>
      </div>
    </section>
  )
}
