import HomepageEditorial from '@/components/homepage/HomepageEditorial'

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    name: 'RAMEDIC Consultancy and Creative LTD',
    url: 'https://ramedicconsultancyandcreativeltd.org',
    logo: 'https://ramedicconsultancyandcreativeltd.org/logo.png',
    image: 'https://ramedicconsultancyandcreativeltd.org/logo.png',
    description:
      'Professional consultancy offering software development, IT solutions, creative services including paper craft, and research services in Ghana.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Koforidua',
      addressRegion: 'Eastern Region',
      addressCountry: 'GH',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+233-24-123-4567',
      contactType: 'customer service',
    },
    sameAs: [],
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomepageEditorial />
    </div>
  )
}