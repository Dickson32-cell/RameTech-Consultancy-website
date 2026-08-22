import { NextRequest, NextResponse } from 'next/server'
import { buildRAGContext } from '@/lib/knowledge-base'

// NVIDIA AI API (OpenAI-compatible endpoint)
const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions'
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || ''
const NVIDIA_MODEL = process.env.NVIDIA_MODEL || 'meta/llama-3.1-8b-instruct'
const MAX_TOKENS = 150

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Check if NVIDIA API key exists
    if (!NVIDIA_API_KEY) {
      return NextResponse.json({
        response: 'AI service not configured. Please contact us via WhatsApp: wa.me/233537400179',
        error: 'NVIDIA API key missing'
      }, { status: 500 })
    }

    // Simple intent detection — skip RAG for basic questions (faster)
    const lowerMessage = message.toLowerCase()
    const isSimpleGreeting = /^(hi|hello|hey|good (morning|afternoon|evening)|howdy|yo|what's up)\b/i.test(lowerMessage)
    const isSimpleGoodbye = /^(bye|goodbye|thanks|thank you|see you)\b/i.test(lowerMessage)
    const isContact = /contact|phone|email|whatsapp|reach|call/i.test(lowerMessage)

    // Only build RAG context for complex questions (saves 5-10 seconds)
    let ragContext = ''
    if (!isSimpleGreeting && !isSimpleGoodbye && !isContact) {
      try {
        ragContext = await buildRAGContext(message)
      } catch (e) {
        console.error('RAG fetch failed, continuing without:', e)
      }
    }

    const systemPrompt = `You are a team member at RAMEDIC Consultancy and Creative LTD in Ghana. Speak as "we" and "our". Be friendly, professional, and brief (under 150 tokens). Stay focused on RAMEDIC services only. Contact: WhatsApp wa.me/233537400179, Phone +233 55 733 2615, Email info@ramedic.com. For off-topic questions, redirect to WhatsApp.${ragContext ? `\n\nCompany data:\n${ragContext}` : ''}`

    // Call NVIDIA AI API (OpenAI-compatible)
    const response = await fetch(NVIDIA_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`
      },
      body: JSON.stringify({
        model: NVIDIA_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: MAX_TOKENS,
        temperature: 0.3,
        top_p: 0.9,
        stream: false
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('NVIDIA API error:', response.status, errorText)
      throw new Error(`NVIDIA API error: ${response.status}`)
    }

    // Parse OpenAI-compatible response
    const data = await response.json()
    
    let aiResponse = ''
    if (data.choices && data.choices[0] && data.choices[0].message) {
      aiResponse = data.choices[0].message.content
    } else if (data.response) {
      aiResponse = data.response
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
      response: "I'm having trouble connecting right now. For immediate help, please WhatsApp us: wa.me/233537400179",
      error: error.message || 'Unknown error'
    })
  }
}
