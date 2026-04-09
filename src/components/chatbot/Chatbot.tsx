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
    response: 'Hello! 👋 Welcome to RAME Tech Consultancy!\n\nI\'m your virtual assistant here to help you with:\n\n• Learning about our services\n• Getting pricing information\n• Understanding timelines\n• Contacting our team\n\nWhat can I help you with today?',
    followUp: 'Would you like to see our services or get a quote?'
  },
  goodbye: {
    response: 'Thank you for chatting with RAME Tech! 😊\n\nIf you have more questions later, don\'t hesitate to reach out.\n\n💬 WhatsApp: wa.me/233204249540\n📧 info.rametechconsultancy@gmail.com\n\nHave a great day!'
  },
  pricing: {
    response: '💰 Pricing at RAME Tech:\n\n🌐 Websites: From GHS 5,000\n📱 Mobile Apps: From GHS 15,000\n🎨 Logo Design: From GHS 800\n☁️ Cloud Services: Custom quote\n⚙️ Custom Software: From GHS 20,000\n\nEvery project is unique. Tell me about your needs for an accurate quote!',
    followUp: 'Would you like a detailed quote? Click WhatsApp to chat directly!'
  },
  timeline: {
    response: '⏱️ Typical Timelines:\n\n🌐 Basic Website: 2-4 weeks\n🛒 E-commerce: 6-8 weeks\n📱 Mobile App: 8-16 weeks\n⚙️ Custom Software: 8-12 weeks\n\nComplex projects may take longer. We\'ll give you exact timelines after our consultation.',
    followUp: 'Ready to start? Let\'s discuss your project timeline!'
  },
  services: {
    response: '📦 RAME Tech Services:\n\n🌐 **Technology Solutions**\nSoftware, Mobile Apps, Database, Cloud, Cybersecurity, AI\n\n🔧 **IT Solutions**\nHardware, Network Setup, IT Support\n\n🎨 **Creative Services**\nGraphic Design, Branding, UI/UX\n📦 Paper Craft: Custom bags, Gift bags, Shopping bags\n\n📊 **Data & Research Services**\nMarketing Research, Digital Marketing, Analytics, Academic Writing\n\nWe also have organized departments! Visit /departments to explore.\n\nWhich service interests you?',
    followUp: 'Ask about any department or service for details!'
  },
  web: {
    response: '🌐 Web Development Services:\n\n• Custom Websites: From GHS 5,000\n• E-commerce Platforms: From GHS 12,000\n• Web Applications: From GHS 20,000\n• CMS Integration\n• SEO Optimization\n• API Integration\n\nWe use modern technologies like Next.js, React, and Node.js.',
    followUp: 'What type of website do you need? E-commerce, business site, or web app?'
  },
  mobile: {
    response: '📱 Mobile App Development:\n\n• iOS Apps (Swift)\n• Android Apps (Kotlin)\n• Cross-platform (React Native, Flutter)\n• From GHS 15,000\n\nWe build apps for startups, businesses, and enterprises.',
    followUp: 'Do you need iOS, Android, or both? Let\'s discuss your app idea!'
  },
  design: {
    response: '🎨 Graphic Design Services:\n\n• Logo Design: From GHS 800\n• Brand Identity: From GHS 2,500\n• Business Cards & Letterheads\n• Social Media Graphics\n• Marketing Materials\n• UI/UX Design\n\nAll designs include revisions until you\'re happy!',
    followUp: 'What would you like designed? Logo, brand identity, or marketing materials?'
  },
  cloud: {
    response: '☁️ Cloud Services:\n\n• AWS Solutions\n• Azure Integration\n• Cloud Migration\n• DevOps & CI/CD\n• Serverless Architecture\n• Cloud Security\n\nWe help you leverage the full power of the cloud!',
    followUp: 'Already using cloud services, or starting fresh? We can help either way!'
  },
  analytics: {
    response: '📊 Advanced Analytics:\n\n• Business Intelligence Dashboards\n• Real-time Data Processing\n• Predictive Analytics\n• Custom KPI Tracking\n• ML-powered Insights\n• Data Visualization\n\nTurn your data into actionable business insights!',
    followUp: 'What kind of data do you want to analyze? Let\'s talk use cases!'
  },
  ai: {
    response: '🤖 AI & Automation Services:\n\n• Custom Chatbots (Web, WhatsApp)\n• Process Automation\n• Natural Language Processing\n• Computer Vision\n• AI Consulting\n• ML Model Development\n\nBring AI to your business workflows!',
    followUp: 'Interested in chatbots, automation, or custom AI solutions?'
  },
  security: {
    response: '🔒 Cybersecurity Services:\n\n• Security Audits\n• Penetration Testing\n• Compliance (GDPR, PCI-DSS)\n• Vulnerability Assessment\n• Incident Response\n• Security Training\n\nProtect your business from cyber threats!',
    followUp: 'Need a security audit or worried about specific threats?'
  },
  marketing: {
    response: '📈 Marketing & Research:\n\n• Market Research & Analysis\n• Competitor Analysis\n• Customer Segmentation\n• Brand Strategy\n• Trend Forecasting\n• Survey Design\n\nMake data-driven marketing decisions!',
    followUp: 'Looking for market research or marketing strategy help?'
  },
  contact: {
    response: '📞 Contact RAME Tech:\n\n💬 WhatsApp: wa.me/233204249540\n📱 Phone: +233 55 733 2615\n📧 Email: info.rametechconsultancy@gmail.com\n\nWe reply within 24 hours!',
    followUp: 'Click WhatsApp for instant response!'
  },
  payment: {
    response: '💳 Payment Options:\n\n• Bank Transfer\n• Mobile Money (MTN MoMo)\n• Card Payments\n\n**Payment Plan:**\n50% upfront → 30% mid-project → 20% on delivery',
    followUp: 'Need a custom payment arrangement? We\'re flexible!'
  },
  support: {
    response: '🛠️ Support & Maintenance:\n\n• 30-day warranty on all projects\n• Bug fixes included (30 days)\n• Maintenance from GHS 1,500/month\n• Security updates\n• 24/7 Monitoring available\n\nWe\'ve got you covered after launch!',
    followUp: 'Need ongoing support? Ask about our maintenance packages!'
  },
  portfolio: {
    response: '💼 Our Work:\n\nWe\'ve completed 50+ projects including:\n• E-commerce platforms\n• Inventory management systems\n• Mobile apps (iOS & Android)\n• Brand identity packages\n• Custom web applications\n• Analytics dashboards\n\nVisit our Portfolio page to see more!',
    followUp: 'Want to see examples of specific project types?'
  },
  company: {
    response: '🏢 RAME Tech Consultancy:\n\nBased in Ghana, we provide innovative tech solutions:\n• Software Development\n• Hardware & IT\n• Graphic Design\n• Emerging Technologies\n\nWe help businesses transform through technology. 5+ years experience, 50+ completed projects!',
    followUp: 'Would you like to know about specific services?'
  },
  location: {
    response: '📍 Based in Ghana, serving worldwide!\n\nWe specialize in remote collaboration and have worked with clients across:\n• Ghana\n• Other African countries\n• Europe\n• North America\n\nDistance isn\'t a barrier!',
    followUp: 'Where are you located? We can discuss your project!'
  },
  human: {
    response: '👤 I\'ll connect you with our team!\n\n💬 WhatsApp: wa.me/233204249540\n📱 Call: +233 55 733 2615\n\nA human will respond within 24 hours!',
    followUp: 'Click WhatsApp for the fastest response!'
  },
  departments: {
    response: '🏢 RAME Tech Departments:\n\n🌐 **Technology Solutions** (CEO)\nSoftware, Mobile, Database, Cloud, Cybersecurity, AI\n\n🔧 **IT Solutions** (IT Specialist)\nHardware & IT Support\n\n🎨 **Creative Services** (Creative Director)\nGraphic Design + Paper Craft\n\n📊 **Data & Research** (Lead Researcher)\nMarketing, Analytics, Academic Writing\n\nVisit /departments to explore each!',
    followUp: 'Which department interests you?'
  },
  papercraft: {
    response: '📦 Paper Craft Services:\n\nWe offer custom paper bags and craft solutions:\n\n• **Custom Paper Bags** - Full color printing, custom sizes\n• **Gift Bags** - Weddings, birthdays, corporate events\n• **Shopping Bags** - Reinforced handles, bulk orders\n• **Promotional Bags** - Trade shows, marketing campaigns\n\nAll eco-friendly with logo branding available!\n\nPart of our Creative Services department.',
    followUp: 'Need custom bags for your business or event? Let\'s talk!'
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
      content: 'Hello! 👋 I\'m the RAME Tech assistant.\n\nI can help you with:\n• Our services & pricing\n• Project timelines\n• Contact information\n• And more!\n\nWhat would you like to know?',
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
