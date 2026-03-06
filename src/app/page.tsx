import HeroSection from '@/components/homepage/HeroSection'
import ServicesOverview from '@/components/homepage/ServicesOverview'
import PortfolioPreview from '@/components/homepage/PortfolioPreview'
import CTASection from '@/components/homepage/CTASection'

export default function Home() {
  return (
    <div>
      <HeroSection />
      <ServicesOverview />
      <PortfolioPreview />
      <CTASection />
    </div>
  )
}
