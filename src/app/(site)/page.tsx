import HeroSection from '@/components/homepage/HeroSection'
import ServicesOverview from '@/components/homepage/ServicesOverview'
import PortfolioPreview from '@/components/homepage/PortfolioPreview'
import BlogPreview from '@/components/homepage/BlogPreview'
import TestimonialCarousel from '@/components/homepage/TestimonialCarousel'
import CTASection from '@/components/homepage/CTASection'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ServicesOverview />
      <PortfolioPreview />
      <BlogPreview />
      <TestimonialCarousel />
      <CTASection />
    </div>
  )
}
