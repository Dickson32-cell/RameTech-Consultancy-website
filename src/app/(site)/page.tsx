import HeroSection from '@/components/homepage/HeroSection'
import ServicesOverview from '@/components/homepage/ServicesOverview'
import DepartmentsSection from '@/components/homepage/DepartmentsSection'
import PortfolioPreview from '@/components/homepage/PortfolioPreview'
import BlogPreview from '@/components/homepage/BlogPreview'
import PublicationsSection from '@/components/homepage/PublicationsSection'
import TestimonialCarousel from '@/components/homepage/TestimonialCarousel'
import CTASection from '@/components/homepage/CTASection'

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'RAMEDIC Consultancy and Creative LTD',
    url: 'https://ramedicconsultancyandcreativeltd.org',
    logo: 'https://ramedicconsultancyandcreativeltd.org/logo.png',
    image: 'https://ramedicconsultancyandcreativeltd.org/logo.png',
    description: 'Professional consultancy offering software development, IT solutions, creative services including paper craft, and research services in Ghana.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Koforidua',
      addressRegion: 'Eastern Region',
      addressCountry: 'GH',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+233-24-123-4567', // Replace with actual phone number if available
      contactType: 'customer service',
    },
    sameAs: [
      // Add social media URLs here if available
    ],
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HeroSection />
      <ServicesOverview />
      <DepartmentsSection />
      <PortfolioPreview />
      <BlogPreview />
      <PublicationsSection />
      <TestimonialCarousel />
      <CTASection />
    </div>
  )
}
