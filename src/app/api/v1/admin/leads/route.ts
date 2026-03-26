// GET /api/v1/admin/leads - Combined leads from QuoteRequest and ChatbotLead
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getAdminUser, unauthorizedResponse } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(req)
  if (!admin) return unauthorizedResponse()

  const [quoteRequests, chatbotLeads] = await Promise.all([
    prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, phone: true, service: true, status: true, createdAt: true, source: true }
    }),
    prisma.chatbotLead.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true, email: true, phone: true, status: true, createdAt: true, source: true }
    })
  ])

  // Combine and label them
  const quotes = quoteRequests.map(q => ({ ...q, type: 'quote', createdAt: q.createdAt.toISOString() }))
  const leads = chatbotLeads.map(l => ({ ...l, type: 'chatbot', createdAt: l.createdAt.toISOString() }))
  const allLeads = [...quotes, ...leads].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return NextResponse.json({ success: true, data: allLeads })
}
