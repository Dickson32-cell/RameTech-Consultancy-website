// src/app/api/v1/webhooks/chatbot/route.ts
// Webhook for chatbot LLM API status monitoring
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, message, sessionId, timestamp } = body

    // Log the event for monitoring
    console.log(`[Chatbot Webhook] ${type}:`, { message: message?.substring(0, 100), sessionId, timestamp })

    // Handle different webhook events
    switch (type) {
      case 'rate_limit_exceeded':
        // Handle rate limiting - could notify admin
        console.warn(`Rate limit exceeded for session: ${sessionId}`)
        break

      case 'api_error':
        // Log API errors for debugging
        console.error(`Chatbot API error: ${message}`)
        break

      case 'session_start':
        // Track new chatbot sessions
        console.log(`New chatbot session: ${sessionId}`)
        break

      case 'session_end':
        // Track session completion
        console.log(`Chatbot session ended: ${sessionId}`)
        break

      case 'lead_captured':
        // Lead was captured from chatbot
        if (body.leadId) {
          await prisma.chatbotLead.update({
            where: { id: body.leadId },
            data: { status: 'qualified' }
          })
        }
        break

      default:
        console.log(`Unknown webhook event: ${type}`)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Chatbot webhook error:', error)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 500 })
  }
}
