import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ScrollProgress from '@/components/shared/ScrollProgress'
import Chatbot from '@/components/chatbot/Chatbot'
import NewsletterPopup from '@/components/shared/NewsletterPopup'
import PWAInstallPrompt from '@/components/shared/PWAInstallPrompt'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ScrollProgress />
      <Header />
      {children}
      <Footer />
      <Chatbot />
      <NewsletterPopup />
      <PWAInstallPrompt />
    </>
  )
}
