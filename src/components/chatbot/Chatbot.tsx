'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { FaCommentDots, FaTimes, FaPaperPlane, FaUser, FaRobot, FaGripLines } from 'react-icons/fa'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const CHATBOT_SYSTEM_PROMPT = `You are the RAME Tech Consultancy virtual assistant on our website. You help visitors learn about our services (software development, hardware & IT, graphic design), provide general pricing guidance, answer FAQs, and qualify leads. Be friendly, professional, and concise. If a visitor asks about specific project pricing, collect their name, email, and project description, then tell them a team member will follow up within 24 hours. If you cannot answer a question, offer to connect them with the team via WhatsApp. Never make up information about RAME Tech's past projects or capabilities. Always respond in English.`

const FAQ_ANSWERS: Record<string, string> = {
  'how long': 'A standard business website takes 4-6 weeks. Complex applications with custom features may take 8-12 weeks. We provide a detailed timeline during our free consultation.',
  'mobile app': 'Yes! We develop native and cross-platform mobile apps for iOS and Android using React Native and Flutter.',
  'payment': 'We typically structure payments as 50% upfront, 30% at mid-project, and 20% upon delivery. We accept bank transfer, MTN MoMo, and card payments.',
  'support': 'Yes, we offer monthly maintenance packages starting from basic security updates to full-service support with content updates and feature enhancements.',
  'portfolio': 'Visit our Portfolio page to see case studies of completed projects across software, hardware, and design.',
  'pricing': 'Basic websites start from GHS X, custom applications from GHS Y. We provide detailed quotes during consultation.',
  'contact': 'You can reach us at +233 55 733 2615 or WhatsApp us at wa.me/233557332615',
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: 'assistant',
      content: 'Hi! I\'m the RAME Tech virtual assistant. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Drag state
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const chatWindowRef = useRef<HTMLDivElement>(null)

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
    
    // Keep within bounds
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

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    // Check for escalation triggers
    if (input.includes('speak to human') || input.includes('talk to person')) {
      return "I'll connect you with our team on WhatsApp. Click here: wa.me/2335573322615"
    }

    // Check FAQ
    for (const [key, answer] of Object.entries(FAQ_ANSWERS)) {
      if (input.includes(key)) {
        return answer
      }
    }

    // Default response
    return "Thank you for your question! To get more detailed information about your project, please provide your name, email, and a brief description of what you'd like to build. A team member will follow up within 24 hours. Or feel free to reach us directly on WhatsApp!"
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

    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        role: 'assistant',
        content: getBotResponse(input),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Chat Toggle Button - Also draggable */}
      {!isOpen && (
        <div
          onMouseDown={handleDragStart}
          onTouchStart={handleDragStart}
          className="fixed cursor-move touch-none select-none"
          style={{ 
            bottom: position.y > 0 ? `calc(${position.y}px + 420px)` : '1rem',
            right: position.x > 0 ? `calc(${position.x}px + 320px)` : '1rem'
          }}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-12 h-12 md:w-14 md:h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-50 hover:bg-primaryDark transition-colors"
          >
            <FaCommentDots className="text-[20px] md:text-[24px]" />
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          ref={chatWindowRef}
          onMouseMove={handleDrag}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchMove={handleDrag}
          onTouchEnd={handleDragEnd}
          className="fixed md:bottom-6 md:right-6 md:w-80 md:h-[450px] lg:w-96 lg:h-[500px] bg-white rounded-xl md:rounded-xl shadow-modal z-50 flex flex-col overflow-hidden"
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
                <p className="text-xs text-gray-200 hidden md:block">We reply within 24 hours</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FaGripLines className="text-white/60 text-xs" />
              <button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} className="hover:bg-white/20 p-2 rounded">
                <FaTimes />
              </button>
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
                    <p className="text-xs md:text-sm">{msg.content}</p>
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
                placeholder="Type your message..."
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
