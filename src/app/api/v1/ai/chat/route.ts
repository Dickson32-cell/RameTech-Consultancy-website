import { NextRequest, NextResponse } from 'next/server'
import { buildRAGContext } from '@/lib/knowledge-base'

// Custom AI Worker URL (Dickson's Cloudflare Worker)
const AI_WORKER_URL = process.env.AI_WORKER_URL || 'https://billowing-wood-0415.kojonyamekyedickson.workers.dev/'
const MAX_TOKENS = 250

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check if Worker URL exists
    if (!AI_WORKER_URL) {
      return NextResponse.json({ 
        response: 'AI service not configured. Please contact us via WhatsApp: wa.me/233204249540',
        error: 'Worker URL missing'
      }, { status: 500 })
    }

    // Build RAG context from company knowledge base (including dynamic data)
    const ragContext = await buildRAGContext(message)

    const systemPrompt = `You are a team member at RAME Tech Consultancy, our company's AI assistant. Speak in FIRST PERSON as part of the company - use "we", "our", "I work at RAME Tech", etc. You are representing RAME Tech directly, not as an external assistant.

YOUR IDENTITY:
- You ARE part of the RAME Tech team
- Speak as "we" when talking about the company
- Say "our services", "our departments", "our team", not "RAME Tech's services"
- Be friendly, professional, and helpful like a real employee
- You're here to help customers understand what WE offer

IMPORTANT RULES:
- Stay focused on OUR business (RAME Tech)
- Speak as a company representative, not an outside observer
- If a question is unrelated to our business, politely redirect
- Never generate jokes, creative stories, or off-topic content
- Keep responses under ${MAX_TOKENS} tokens
- Be warm, professional, and conversational
- ALWAYS use the CURRENT COMPANY INFORMATION below - it's OUR latest data

ABOUT OUR COMPANY (RAME Tech Consultancy):
- We're a Ghana-based tech company with 5+ years of experience
- We've completed 50+ projects for clients worldwide
- Contact: Phone/WhatsApp: +233 55 733 2615, WhatsApp: wa.me/233204249540, Email: info.rametechconsultancy@gmail.com
- Business Hours: Mon-Fri 8AM-5PM, Sat 9AM-2PM (GMT)
- Payment Terms: 50% upfront, 30% mid-project, 20% on delivery
- We offer 30-day warranty on all projects, maintenance plans from GHS 1,500/month
- Starting Prices: Websites from GHS 5,000, Mobile Apps from GHS 15,000, Logo Design from GHS 800, Custom Software from GHS 20,000

${ragContext ? `CURRENT INFORMATION ABOUT OUR COMPANY (USE THIS - IT'S OUR LATEST DATA):\n${ragContext}

IMPORTANT: This information is pulled directly from our current database and includes:
- Our 4 departments: Technology Solutions, IT Solutions, Creative Services, Data & Research Services
- All our department services including Paper Craft (Custom Paper Bags, Gift Bags, Shopping Bags, Promotional Bags)
- Our team members and department heads
- Our current pricing and service details
- Our latest projects and publications

ALWAYS use this current information when answering questions about our departments, services, team, and offerings! Speak as if YOU are providing these services as part of OUR team.` : ''}

For questions outside our business scope, respond with: "I'm part of the RAME Tech team and can best help you with questions about our services. For other inquiries, please contact us at wa.me/233204249540"`

    // Call your Cloudflare Worker
    const response = await fetch(AI_WORKER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.2,
        top_p: 0.9
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('AI Worker error:', response.status, errorText)
      throw new Error(`AI Worker error: ${response.status}`)
    }

    // Parse the response - format is: [{"response":{"response":"text","usage":{}}}]
    const data = await response.json()
    
    let aiResponse = ''
    if (data && data.length > 0 && data[0].response && data[0].response.response) {
      aiResponse = data[0].response.response
    } else if (data.response) {
      aiResponse = data.response
    } else if (typeof data === 'string') {
      aiResponse = data
    } else {
      aiResponse = "I'm here to help! Ask me about our services or click WhatsApp for instant support."
    }

    return NextResponse.json({
      response: aiResponse,
      source: ragContext ? 'RAG + AI' : 'AI'
    })

  } catch (error: any) {
    console.error('AI API Error:', error)
    
    return NextResponse.json({
      response: "I'm having trouble connecting to my AI brain right now. For immediate help, please WhatsApp us: wa.me/233204249540",
      error: error.message || 'Unknown error'
    })
  }
}
