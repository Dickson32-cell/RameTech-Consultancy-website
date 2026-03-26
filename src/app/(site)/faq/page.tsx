import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'FAQ | RAME Tech Consultancy',
  description: 'Frequently asked questions about our services, pricing, and project timelines.',
}

const faqs = [
  {
    question: 'How long does a website project take?',
    answer: 'A standard business website takes 4-6 weeks. Complex applications with custom features may take 8-12 weeks. We provide a detailed timeline during our free consultation.'
  },
  {
    question: 'Do you build mobile apps?',
    answer: 'Yes! We develop native and cross-platform mobile apps for iOS and Android using React Native and Flutter.'
  },
  {
    question: 'What are your payment terms?',
    answer: 'We typically structure payments as 50% upfront, 30% at mid-project, and 20% upon delivery. We accept bank transfer, MTN MoMo, and card payments.'
  },
  {
    question: 'Do you offer ongoing support?',
    answer: 'Yes, we offer monthly maintenance packages starting from basic security updates to full-service support with content updates and feature enhancements.'
  },
  {
    question: 'Can I see examples of your work?',
    answer: 'Visit our Portfolio page to see case studies of completed projects across software, hardware, and design.'
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Our refund policy depends on the project stage. We strive for transparency and will discuss terms before project commencement.'
  },
  {
    question: 'Can you work with our existing systems?',
    answer: 'Absolutely! We have experience integrating with legacy systems and can work alongside your existing tech stack.'
  },
  {
    question: 'What technologies do you use?',
    answer: 'We use modern, industry-standard technologies including React, Next.js, Node.js, Python, React Native, Flutter, and more. We recommend the best stack based on your project requirements.'
  }
]

export default function FAQPage() {
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
            <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
            <span className="text-sm font-medium">Help Center</span>
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Find answers to common questions about our services, pricing, and process.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bento-card">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-heading font-semibold text-text mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-primary via-secondary to-primary text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-white/80 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Get in touch with us.
          </p>
          <a href="/contact" className="btn-accent text-lg px-8 py-4 cursor-pointer">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}
