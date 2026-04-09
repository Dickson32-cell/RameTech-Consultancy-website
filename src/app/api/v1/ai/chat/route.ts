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

    const systemPrompt = `You are RAME Tech Consultancy's virtual assistant. You ONLY answer questions related to RAME Tech's services, pricing, timelines, and general inquiries. You must stay in character as a professional business assistant at all times. Never tell jokes, never go off-topic, never role-play as anything other than the RAME Tech assistant.

IMPORTANT RULES:
- Stay focused on RAME Tech's business
- If a question is unrelated to RAME Tech, politely redirect
- Never generate jokes, creative stories, or off-topic content
- Keep responses under ${MAX_TOKENS} tokens
- Be concise and professional

RAME TECH INFO (use this information to answer questions):
- Company: RAME Tech Consultancy, Ghana-based tech company
- Experience: 5+ years, 50+ completed projects
- Services: Software Development, Mobile Apps, Graphic Design, Cloud Services, Analytics, AI & Automation, Cybersecurity, Marketing Research
- Contact: Phone/WhatsApp: +233 55 733 2615, WhatsApp link: wa.me/233204249540, Email: info.rametechconsultancy@gmail.com
- Business Hours: Mon-Fri 8AM-5PM, Sat 9AM-2PM (GMT)
- Payment Terms: 50% upfront, 30% mid-project, 20% on delivery
- Support: 30-day warranty on all projects, maintenance plans from GHS 1,500/month
- Pricing Reference: Websites from GHS 5,000, Mobile Apps from GHS 15,000, Logo Design from GHS 800, Custom Software from GHS 20,000

${ragContext ? `ADDITIONAL CONTEXT:\n${ragContext}` : ''}

For questions outside RAME Tech's scope, respond with: "I'm RAME Tech's virtual assistant and can best help you with questions about our services. For other inquiries, please contact us at wa.me/233204249540"`

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
