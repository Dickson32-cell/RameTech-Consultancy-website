'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { FaCommentDots, FaTimes, FaPaperPlane, FaUser, FaRobot, FaGripLines, FaWhatsapp } from 'react-icons/fa'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Smart intent patterns
const INTENT_PATTERNS = {
  greeting: /^(hi|hello|hey|good morning|good afternoon|good evening|howdy|yo|what's up|whassup|greetings)/i,
  goodbye: /(bye|goodbye|see you|later|thanks|thank you|catch you)/i,
  pricing: /(price|pricing|cost|how much|charge|fee|quote|estimate|budget|afford|expensive|cheap)/i,
  timeline: /(how long|time|weeks|days|when|schedule|timeline|deadline|turnaround|duration)/i,
  services: /(service|services|what do you do|offer|provide|help with|specialize|capabilities)/i,
  departments: /(department|departments|division|divisions|organized|structure)/i,
  papercraft: /(paper|bag|bags|craft|gift bag|shopping bag|paper bag|promotional bag|custom bag)/i,
  web: /(web|website|site|webpage|landing page|frontend|backend|fullstack|wordpress|shopify)/i,
  mobile: /(mobile|app|iphone|android|ios|android|react native|flutter|native app)/i,
  design: /(design|logo|brand|graphic|visual|ui|ux|interface|aesthetic|artwork|banner|brochure)/i,
  cloud: /(cloud|aws|azure|server|hosting|deployment|devops|infrastructure|ec2|s3)/i,
  analytics: /(analytics|data|dashboard|kpi|metrics|tracking|insights|report|business intelligence|bi)/i,
  ai: /(ai|artificial intelligence|machine learning|ml|automation|chatbot|bot|nlp|natural language)/i,
  security: /(security|cyber|hack|breach|protect|ssl|certificate|encrypt|malware|virus)/i,
  marketing: /(marketing|seo|advertising|social media|facebook|instagram|ads|campaign|brand)/i,
  contact: /(contact|call|phone|email|reach|talk|whatsapp|message|connect|email us|reach us)/i,
  payment: /(payment|pay|bank|transfer|momo|mobile money|card|installment|credit)/i,
  support: /(support|maintenance|help|issue|problem|bug|error|fix|update|maintain)/i,
  portfolio: /(portfolio|work|project|example|case study|reference|previous|completed)/i,
  company: /(about|company|who are you|yourself|rame tech|business|enterprise|team|your company)/i,
  location: /(where|location|address|office|ghana|accra|located|country)/i,
  human: /(human|person|real|agent|someone|speak to|talk to|operator|live agent|staff)/i,
}

const RESPONSES: Record<string, { response: string; followUp?: string }> = {
  greeting: {
    response: 'Hello! 👋 Welcome to RAME Tech Consultancy!\n\nI\'m part of the RAME Tech team, here to help you with:\n\n• Learning about our services and departments\n• Getting pricing information\n• Understanding project timelines\n• Connecting with our team\n\nWhat can I help you with today?',
    followUp: 'Would you like to see our services or get a quote?'
  },
  goodbye: {
    response: 'Thank you for chatting with us! 😊\n\nIf you have more questions later, feel free to reach out anytime.\n\n💬 WhatsApp: wa.me/233204249540\n📧 info.rametechconsultancy@gmail.com\n\nWe look forward to working with you! Have a great day!'
  },
  pricing: {
    response: '💰 Our Pricing:\n\n🌐 Websites: From GHS 5,000\n📱 Mobile Apps: From GHS 15,000\n🎨 Logo Design: From GHS 800\n📦 Paper Bags: Custom pricing\n☁️ Cloud Services: Custom quote\n⚙️ Custom Software: From GHS 20,000\n\nEvery project is unique! Tell me about your needs and we\'ll provide an accurate quote.',
    followUp: 'Ready for a detailed quote? Let\'s discuss your project!'
  },
  timeline: {
    response: '⏱️ Our Typical Project Timelines:\n\n🌐 Basic Website: 2-4 weeks\n🛒 E-commerce: 6-8 weeks\n📱 Mobile App: 8-16 weeks\n📦 Paper Bags: 1-2 weeks\n⚙️ Custom Software: 8-12 weeks\n\nComplex projects may take longer. We\'ll give you exact timelines after our consultation!',
    followUp: 'Ready to start? Let\'s discuss your project timeline!'
  },
  services: {
    response: '📦 Our Services & Departments:\n\n🌐 **Technology Solutions**\nWe build software, mobile apps, databases, cloud solutions, cybersecurity systems, and AI solutions\n\n🔧 **IT Solutions**\nWe provide hardware support, network setup, and IT infrastructure\n\n🎨 **Creative Services**\nWe create graphic designs, branding, UI/UX designs\n📦 Paper Craft: We make custom paper bags, gift bags, shopping bags, promotional bags\n\n📊 **Data & Research Services**\nWe offer marketing research, digital marketing, data analytics, and academic writing support\n\nVisit /departments to explore each department in detail!\n\nWhich of our services interests you?',
    followUp: 'I\'d be happy to tell you more about any of our departments or services!'
  },
  web: {
    response: '🌐 Our Web Development Services:\n\n• Custom Websites: From GHS 5,000\n• E-commerce Platforms: From GHS 12,000\n• Web Applications: From GHS 20,000\n• CMS Integration\n• SEO Optimization\n• API Integration\n\nWe use modern technologies like Next.js, React, and Node.js to build fast, reliable websites!',
    followUp: 'What type of website are you looking for? E-commerce, business site, or web app?'
  },
  mobile: {
    response: '📱 Our Mobile App Development:\n\n• iOS Apps (Swift)\n• Android Apps (Kotlin)\n• Cross-platform (React Native, Flutter)\n• Starting from GHS 15,000\n\nWe build apps for startups, businesses, and enterprises. Our team handles everything from design to app store submission!',
    followUp: 'Do you need iOS, Android, or both? I\'d love to discuss your app idea!'
  },
  design: {
    response: '🎨 Our Graphic Design Services:\n\n• Logo Design: From GHS 800\n• Brand Identity: From GHS 2,500\n• Business Cards & Letterheads\n• Social Media Graphics\n• Marketing Materials\n• UI/UX Design\n\nAll our designs include revisions until you\'re completely happy!',
    followUp: 'What would you like us to design for you? Logo, brand identity, or marketing materials?'
  },
  cloud: {
    response: '☁️ Our Cloud Services:\n\n• AWS Solutions\n• Azure Integration\n• Cloud Migration\n• DevOps & CI/CD\n• Serverless Architecture\n• Cloud Security\n\nWe help you leverage the full power of the cloud! Our team has extensive experience with both AWS and Azure.',
    followUp: 'Already using cloud services, or starting fresh? We can help either way!'
  },
  analytics: {
    response: '📊 Our Advanced Analytics:\n\n• Business Intelligence Dashboards\n• Real-time Data Processing\n• Predictive Analytics\n• Custom KPI Tracking\n• ML-powered Insights\n• Data Visualization\n\nWe turn your data into actionable business insights!',
    followUp: 'What kind of data would you like us to analyze? I\'d love to discuss use cases!'
  },
  ai: {
    response: '🤖 Our AI & Automation Services:\n\n• Custom Chatbots (Web, WhatsApp)\n• Process Automation\n• Natural Language Processing\n• Computer Vision\n• AI Consulting\n• ML Model Development\n\nWe bring AI to your business workflows! Our team specializes in practical AI solutions.',
    followUp: 'Interested in chatbots, automation, or custom AI solutions? We can help!'
  },
  security: {
    response: '🔒 Our Cybersecurity Services:\n\n• Security Audits\n• Penetration Testing\n• Compliance (GDPR, PCI-DSS)\n• Vulnerability Assessment\n• Incident Response\n• Security Training\n\nWe protect your business from cyber threats with comprehensive security solutions!',
    followUp: 'Need a security audit or worried about specific threats? Let us help!'
  },
  marketing: {
    response: '📈 Our Marketing & Research:\n\n• Market Research & Analysis\n• Competitor Analysis\n• Customer Segmentation\n• Brand Strategy\n• Trend Forecasting\n• Survey Design\n\nWe help you make data-driven marketing decisions!',
    followUp: 'Looking for market research or marketing strategy help? We\'re here for you!'
  },
  contact: {
    response: '📞 How to Reach Us:\n\n💬 WhatsApp: wa.me/233204249540\n📱 Phone: +233 55 733 2615\n📧 Email: info.rametechconsultancy@gmail.com\n\nWe typically reply within 24 hours, often much faster!',
    followUp: 'Click WhatsApp for the quickest response from our team!'
  },
  payment: {
    response: '💳 Our Payment Options:\n\n• Bank Transfer\n• Mobile Money (MTN MoMo)\n• Card Payments\n\n**Our Payment Plan:**\n50% upfront → 30% mid-project → 20% on delivery\n\nThis ensures smooth project flow and protects both parties!',
    followUp: 'Need a custom payment arrangement? We\'re flexible and can work with you!'
  },
  support: {
    response: '🛠️ Our Support & Maintenance:\n\n• 30-day warranty on all our projects\n• Bug fixes included (30 days)\n• Maintenance packages from GHS 1,500/month\n• Security updates\n• 24/7 Monitoring available\n\nWe\'ve got you covered after launch! We don\'t just build and disappear.',
    followUp: 'Need ongoing support? Ask me about our maintenance packages!'
  },
  portfolio: {
    response: '💼 Our Work:\n\nWe\'ve completed 50+ projects including:\n• E-commerce platforms\n• Inventory management systems\n• Mobile apps (iOS & Android)\n• Brand identity packages\n• Custom web applications\n• Analytics dashboards\n• Custom paper bags for retail stores\n\nVisit /portfolio to see our completed projects across all departments!',
    followUp: 'Want to see examples from a specific department or project type?'
  },
  company: {
    response: '🏢 About Us:\n\nWe\'re RAME Tech Consultancy, based in Ghana! We provide innovative tech solutions through our 4 specialized departments:\n\n• Technology Solutions\n• IT Solutions\n• Creative Services (including Paper Craft)\n• Data & Research Services\n\nWe\'ve been helping businesses transform through technology for 5+ years with 50+ completed projects!',
    followUp: 'Would you like to know about our specific departments or services?'
  },
  location: {
    response: '📍 We\'re Based in Ghana, Serving the World!\n\nOur team specializes in remote collaboration and we\'ve successfully worked with clients across:\n• Ghana\n• Other African countries\n• Europe\n• North America\n\nDistance isn\'t a barrier for us - we collaborate seamlessly with clients worldwide!',
    followUp: 'Where are you located? We\'d love to discuss how we can work together!'
  },
  human: {
    response: '👤 I\'ll connect you with my colleagues!\n\n💬 WhatsApp: wa.me/233204249540\n📱 Call: +233 55 733 2615\n\nOur team will respond within 24 hours - usually much faster!',
    followUp: 'Click WhatsApp for the fastest response from our team!'
  },
  departments: {
    response: '🏢 Our Departments:\n\nWe\'re organized into 4 specialized departments:\n\n🌐 **Technology Solutions** (Led by our CEO)\nWe build software, mobile apps, databases, cloud solutions, cybersecurity systems, and AI\n\n🔧 **IT Solutions** (Led by our IT Specialist)\nWe handle hardware, network setup, and IT infrastructure\n\n🎨 **Creative Services** (Led by our Creative Director)\nWe design graphics, brands, UI/UX, and create custom paper bags\n\n📊 **Data & Research** (Led by our Lead Researcher)\nWe conduct marketing research, digital marketing, analytics, and academic writing\n\nVisit /departments to explore each department!',
    followUp: 'Which of our departments interests you? I can tell you more about any of them!'
  },
  papercraft: {
    response: '📦 Our Paper Craft Services:\n\nWe create custom paper bags and craft solutions:\n\n• **Custom Paper Bags** - We print in full color with custom sizes\n• **Gift Bags** - Perfect for weddings, birthdays, corporate events\n• **Shopping Bags** - Reinforced handles, available in bulk\n• **Promotional Bags** - Great for trade shows and marketing campaigns\n\nAll our bags are eco-friendly and we can add your logo branding!\n\nThis is part of our Creative Services department.',
    followUp: 'Need custom bags for your business or event? We\'d love to help!'
  },
}

const QUICK_REPLIES = [
  { label: '📦 Services', response: 'services' },
  { label: '💰 Pricing', response: 'pricing' },
  { label: '📞 Contact', response: 'contact' },
  { label: '⏱️ Timeline', response: 'timeline' },
  { label: '💬 WhatsApp', response: 'human' },
]

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hello! 👋 I\'m part of the RAME Tech team!\n\nI can help you with:\n• Our services & departments\n• Pricing & quotes\n• Project timelines\n• Connecting with our team\n• Paper Craft services\n• And more!\n\nWhat would you like to know about us?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [conversationContext, setConversationContext] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const chatWindowRef = useRef<HTMLDivElement>(null)

  // Smart intent detection
  const detectIntent = (input: string): string | null => {
    const lowerInput = input.toLowerCase().trim()
    
    // Check greeting first
    if (INTENT_PATTERNS.greeting.test(lowerInput)) {
      return 'greeting'
    }
    
    // Check goodbye
    if (INTENT_PATTERNS.goodbye.test(lowerInput)) {
      return 'goodbye'
    }
    
    // Check intents in order of specificity
    const intentOrder = [
      'human', 'contact', 'pricing', 'timeline', 'papercraft', 'departments', 'services',
      'web', 'mobile', 'design', 'cloud', 'analytics', 'ai',
      'security', 'marketing', 'payment', 'support', 'portfolio',
      'company', 'location'
    ]
    
    for (const intent of intentOrder) {
      if (INTENT_PATTERNS[intent as keyof typeof INTENT_PATTERNS].test(lowerInput)) {
        return intent
      }
    }
    
    // Check for multiple keywords in a single message
    const keywords = lowerInput.split(/\s+/)
    const matchedIntents = intentOrder.filter(intent => 
      INTENT_PATTERNS[intent as keyof typeof INTENT_PATTERNS].test(lowerInput)
    )
    
    if (matchedIntents.length > 0) {
      // Return the most specific match (usually the first in order)
      return matchedIntents[0]
    }
    
    return null
  }

  // Context-aware response selection
  const getResponse = (userInput: string): string => {
    const intent = detectIntent(userInput)
    
    if (intent && RESPONSES[intent]) {
      // Add context for follow-ups
      setConversationContext(prev => [...prev.slice(-3), intent])
      
      const response = RESPONSES[intent]
      return response.response
    }
    
    // Default response with suggestions
    return `Thanks for your question! 🤔\n\nI can help you with:\n• 📦 Our services\n• 💰 Pricing & quotes\n• ⏱️ Project timelines\n• 📞 Contact info\n\nOr click WhatsApp for instant support:\nwa.me/233204249540`
  }

  // Handle drag
  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    if (chatWindowRef.current) {
      const rect = chatWindowRef.current.getBoundingClientRect()
      setDragOffset({
        x: clientX - rect.left,
        y: clientY - rect.top
      })
    }
    setIsDragging(true)
  }, [])

  const handleDrag = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    
    const newX = clientX - dragOffset.x
    const newY = clientY - dragOffset.y
    
    const maxX = window.innerWidth - (window.innerWidth < 768 ? 300 : 380)
    const maxY = window.innerHeight - (window.innerWidth < 768 ? 400 : 480)
    
    setPosition({
      x: Math.max(0, Math.min(newX, maxX)),
      y: Math.max(0, Math.min(newY, maxY))
    })
  }, [isDragging, dragOffset])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleQuickReply = (responseKey: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: QUICK_REPLIES.find(r => r.response === responseKey)?.label || responseKey,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setIsTyping(true)

    setTimeout(() => {
      const response = RESPONSES[responseKey]
      const botResponse: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: response?.response || 'Thanks for your question! How else can I help?',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 800)
  }

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: messages.length + 1,
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    try {
      // Call AI API (Ollama)
      const response = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      })
      
      const data = await response.json()
      
      const botResponse: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: data.response || getResponse(input), // Fallback to local if API fails
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      // Fallback to local responses if API fails
      const botResponse: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: getResponse(input),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }
    
    setIsTyping(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-12 h-12 md:w-14 md:h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primaryDark transition-transform hover:scale-110"
      >
        <FaCommentDots className="text-[20px] md:text-[24px]" />
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={handleDrag}
          onTouchEnd={handleDragEnd}
          className="fixed md:bottom-6 md:right-6 md:w-80 md:h-[500px] lg:w-96 lg:h-[550px] bg-white rounded-xl md:rounded-xl shadow-modal z-50 flex flex-col overflow-hidden"
          style={{ 
            bottom: position.y > 0 ? undefined : '1rem',
            right: position.x > 0 ? undefined : '1rem',
            left: position.x > 0 ? position.x : undefined,
            top: position.y > 0 ? position.y : undefined,
            maxWidth: 'calc(100vw - 2rem)',
            maxHeight: 'calc(100vh - 5rem)'
          }}
        >
          {/* Draggable Header */}
          <div 
            className="bg-primary text-white p-3 md:p-4 flex items-center justify-between cursor-move touch-none select-none"
            onMouseDown={handleDragStart}
            onTouchStart={handleDragStart}
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <div className="flex items-center gap-2 md:gap-3">
              <FaRobot className="text-[20px] md:text-[24px]" />
              <div>
                <h3 className="font-semibold text-sm md:text-base">RAME Tech Assistant</h3>
                <p className="text-xs text-gray-200 hidden md:block">Smart help 24/7</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="https://wa.me/233204249540" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-colors"
                title="Chat on WhatsApp"
              >
                <FaWhatsapp className="text-sm" />
              </a>
              <FaGripLines className="text-white/60 text-xs" />
              <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:bg-white/20 p-2 rounded">
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Quick Reply Buttons */}
          <div className="px-3 py-2 border-b bg-gray-50 overflow-x-auto">
            <div className="flex gap-2">
              {QUICK_REPLIES.map((reply) => (
                <button
                  key={reply.response}
                  onClick={() => handleQuickReply(reply.response)}
                  className="flex-shrink-0 px-3 py-1.5 bg-white border border-primary/20 rounded-full text-xs font-medium text-primary hover:bg-primary hover:text-white transition-colors"
                >
                  {reply.label}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-2 md:p-4 space-y-2 md:space-y-4 bg-gray-50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-1 md:gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-accent' : 'bg-primary'}`}>
                    {msg.role === 'user' ? <FaUser className="text-[10px] md:text-[14px]" /> : <FaRobot className="text-[10px] md:text-[14px]" />}
                  </div>
                  <div className={`p-2 md:p-3 rounded-lg ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white shadow-sm'}`}>
                    <p className="text-xs md:text-sm whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-1 md:gap-2">
                  <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-primary flex items-center justify-center">
                    <FaRobot className="text-[10px] md:text-[14px]" />
                  </div>
                  <div className="bg-white shadow-sm p-2 md:p-3 rounded-lg">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                      <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 md:p-4 border-t bg-white">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 input-field text-sm"
              />
              <button
                onClick={handleSend}
                className="btn-primary px-3 md:px-4"
              >
                <FaPaperPlane className="text-[12px] md:text-[14px]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
