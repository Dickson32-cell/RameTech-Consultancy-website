import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Chatbot from '@/components/chatbot/Chatbot'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'RAME Tech Consultancy | Software Development, Hardware & IT, Graphic Design',
  description: 'Professional tech consultancy offering software development, hardware & IT solutions, and graphic design services in Ghana.',
  keywords: 'software development, hardware IT, graphic design, Ghana, website, mobile app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} pt-16`}>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Chatbot />
      </body>
    </html>
  )
}
