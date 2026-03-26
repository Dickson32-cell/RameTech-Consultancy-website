// Combined route for leads - handles both quote and chatbot leads
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getAdminUser, unauthorizedResponse, notFoundResponse } from '@/lib/adminAuth'

type Params = { params: { id: string } }

// GET - fetch a single lead by id
export async function GET(req: NextRequest, { params }: Params) {
  const admin = await getAdminUser(req)
  if (!admin) return unauthorizedResponse()

  // Try QuoteRequest first, then ChatbotLead
  try {
    const lead = await prisma.quoteRequest.findUnique({ where: { id: params.id } })
    if (lead) return NextResponse.json({ success: true, data: lead, type: 'quote' })
  } catch {}

  try {
    const lead = await prisma.chatbotLead.findUnique({ where: { id: params.id } })
    if (lead) return NextResponse.json({ success: true, data: lead, type: 'chatbot' })
  } catch {}

  return notFoundResponse('Lead not found')
}

// PATCH - update a lead
export async function PATCH(req: NextRequest, { params }: Params) {
  const admin = await getAdminUser(req)
  if (!admin) return unauthorizedResponse()

  const body = await req.json()

  // Try to update QuoteRequest first, then ChatbotLead
  try {
    let lead = await prisma.quoteRequest.update({
      where: { id: params.id },
      data: body
    })
    return NextResponse.json({ success: true, data: lead })
  } catch {
    try {
      let lead = await prisma.chatbotLead.update({
        where: { id: params.id },
        data: body
      })
      return NextResponse.json({ success: true, data: lead })
    } catch {
      return notFoundResponse('Lead not found')
    }
  }
}

// DELETE - delete a lead
export async function DELETE(req: NextRequest, { params }: Params) {
  const admin = await getAdminUser(req)
  if (!admin) return unauthorizedResponse()

  // Try QuoteRequest first, then ChatbotLead
  try {
    await prisma.quoteRequest.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch {
    try {
      await prisma.chatbotLead.delete({ where: { id: params.id } })
      return NextResponse.json({ success: true })
    } catch {
      return notFoundResponse('Lead not found')
    }
  }
}
