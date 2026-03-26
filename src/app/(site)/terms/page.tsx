import Footer from '@/components/layout/Footer'
import Header from '@/components/layout/Header'

export default function TermsOfService() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-heading font-bold text-text mb-8">Terms of Service</h1>
          
          <div className="prose prose-lg max-w-none text-gray-600 space-y-6">
            <p className="lead text-lg">Last updated: March 2026</p>
            
            <h2 className="text-2xl font-semibold text-text mt-8 mb-4">1. Acceptance of Terms</h2>
            <p>By accessing and using RAME Tech Consultancy's website and services, you accept and agree to be bound by the terms and provisions of this agreement.</p>

            <h2 className="text-2xl font-semibold text-text mt-8 mb-4">2. Description of Services</h2>
            <p>RAME Tech Consultancy provides the following services:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Software Development</li>
              <li>Hardware & IT Solutions</li>
              <li>Graphic Design</li>
              <li>Mobile Development</li>
              <li>Cloud Services</li>
              <li>Data Science & Analytics</li>
              <li>Digital Marketing</li>
            </ul>

            <h2 className="text-2xl font-semibold text-text mt-8 mb-4">3. Project Engagement</h2>
            <p>All projects are subject to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>A signed project agreement</li>
              <li>Defined scope and deliverables</li>
              <li>Agreed upon timelines and milestones</li>
              <li>Payment terms as specified in the contract</li>
            </ul>

            <h2 className="text-2xl font-semibold text-text mt-8 mb-4">4. Payment Terms</h2>
            <p>Payment terms are defined in individual project contracts. Generally:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>50% advance payment required to begin work</li>
              <li>Remaining balance due upon project completion</li>
              <li>Payment due within 14 days of invoice</li>
            </ul>

            <h2 className="text-2xl font-semibold text-text mt-8 mb-4">5. Intellectual Property</h2>
            <p>Upon full payment, intellectual property rights for custom-developed solutions transfer to the client, unless otherwise agreed in writing.</p>

            <h2 className="text-2xl font-semibold text-text mt-8 mb-4">6. Limitation of Liability</h2>
            <p>RAME Tech Consultancy shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from the use of our services.</p>

            <h2 className="text-2xl font-semibold text-text mt-8 mb-4">7. Contact Information</h2>
            <p>For questions regarding these terms, please contact us:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Email: info.rametechconsultancy@gmail.com</li>
              <li>Phone: +233 55 733 2615</li>
              <li>Location: Ghana</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
