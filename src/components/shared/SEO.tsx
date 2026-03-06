// src/components/shared/SEO.tsx
// SEO Component for metadata

import { Metadata } from 'next'

interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article'
  publishedTime?: string
  author?: string
}

const SITE_NAME = 'RAME Tech Consultancy'
const SITE_URL = 'https://rametech.com'
const DEFAULT_DESCRIPTION = 'Professional tech consultancy offering software development, hardware & IT solutions, and graphic design services in Ghana.'

export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  image,
  url,
  type = 'website'
}: SEOProps): Metadata {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
  const imageUrl = image || `${SITE_URL}/og-image.png`

  return {
    title: fullTitle,
    description,
    keywords: [...keywords, 'software development', 'hardware', 'IT', 'graphic design', 'Ghana'].join(', '),

    // Open Graph
    openGraph: {
      title: fullTitle,
      description,
      type,
      url: url || SITE_URL,
      siteName: SITE_NAME,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: fullTitle
        }
      ]
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [imageUrl]
    },

    // Canonical
    alternates: {
      canonical: url || SITE_URL
    }
  }
}

// JSON-LD structured data helpers
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'RAME Tech Consultancy',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+233-55-733-2615',
      contactType: 'customer service',
      availableLanguage: 'English'
    },
    sameAs: [
      'https://www.instagram.com/rametech_consultancy?igsh=MTJyOXhic2F4Z2Fhcw%3D%3D&utm_source=qr'
    ]
  }
}

export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'RAME Tech Consultancy',
    image: `${SITE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'GH',
      addressRegion: 'Greater Accra'
    },
    priceRange: '$$',
    openingHours: 'Mo-Fr 08:00-18:00'
  }
}
