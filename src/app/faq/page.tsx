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
      <section className="bg-gradient-to-br from-primary to-primaryDark text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-200 max-w-2xl">
            Find answers to common questions about our services, pricing, and process.
          </p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="card">
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Can't find the answer you're looking for? Get in touch with us.
          </p>
          <a href="/contact" className="btn-primary">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}
