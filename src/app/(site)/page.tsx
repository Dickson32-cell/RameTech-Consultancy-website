import HomepageEditorial from '@/components/homepage/HomepageEditorial'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export default async function Home() {
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

  let initialData = null
  try {
    const [settings, services, departments, projects, posts, reviews, publications] = await Promise.all([
      prisma.siteSettings.findUnique({ where: { id: 'default' } }),
      prisma.service.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 8 }),
      prisma.department.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 6 }),
      prisma.portfolioProject.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 6 }),
      prisma.blogPost.findMany({ where: { isPublished: true }, orderBy: { publishedAt: 'desc' }, take: 3 }),
      prisma.review.findMany({ where: { isApproved: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
      prisma.publication.findMany({ where: { isActive: true }, orderBy: { order: 'asc' }, take: 6 }),
    ])
    initialData = {
      settings: settings ? JSON.parse(JSON.stringify(settings)) : null,
      services: JSON.parse(JSON.stringify(services)),
      departments: JSON.parse(JSON.stringify(departments)),
      projects: JSON.parse(JSON.stringify(projects)),
      posts: JSON.parse(JSON.stringify(posts)),
      reviews: JSON.parse(JSON.stringify(reviews)),
      publications: JSON.parse(JSON.stringify(publications)),
    }
  } catch {
    initialData = null // local/dev or DB blip: client fetch takes over
  }

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomepageEditorial initialData={initialData} />
    </div>
  )
}
