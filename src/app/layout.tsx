import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://ramedicconsultancyandcreativeltd.org'),
  title: 'RAMEDIC Consultancy and Creative LTD | Software Development, IT Solutions, Creative Services, Research',
  description: 'Professional consultancy offering software development, IT solutions, creative services including paper craft, and research services in Ghana.',
  keywords: 'software development, hardware IT, graphic design, paper craft, research, Ghana, website, mobile app, creative services',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'RAMEDIC',
    statusBarStyle: 'default',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'RAMEDIC Consultancy and Creative LTD',
    description: 'Professional consultancy offering software development, IT solutions, creative services including paper craft, and research services in Ghana.',
    url: 'https://ramedicconsultancyandcreativeltd.org',
    siteName: 'RAMEDIC Consultancy and Creative LTD',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'RAMEDIC Consultancy and Creative LTD Logo',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAMEDIC Consultancy and Creative LTD',
    description: 'Professional consultancy offering software development, IT solutions, creative services including paper craft, and research services in Ghana.',
    images: ['/logo.png'],
  },
}

export const viewport = {
  themeColor: '#1E40AF',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
