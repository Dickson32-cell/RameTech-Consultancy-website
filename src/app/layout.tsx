import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'RAMEDIC Consultancy and Creative LTD | Software Development, IT Solutions, Creative Services, Research',
  description: 'Professional consultancy offering software development, IT solutions, creative services including paper craft, and research services in Ghana.',
  keywords: 'software development, hardware IT, graphic design, paper craft, research, Ghana, website, mobile app, creative services',
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
      </head>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
