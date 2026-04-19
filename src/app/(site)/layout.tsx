import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ScrollProgress from '@/components/shared/ScrollProgress'
import Chatbot from '@/components/chatbot/Chatbot'
import NewsletterPopup from '@/components/shared/NewsletterPopup'
import NewsTicker from '@/components/NewsTicker'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ScrollProgress />
      <Header />
      <NewsTicker />
      {children}
      <Footer />
      <Chatbot />
      <NewsletterPopup />
    </>
  )
}
