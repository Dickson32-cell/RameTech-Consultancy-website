// GET/POST /api/v1/admin/faqs
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getAdminUser, unauthorizedResponse } from '@/lib/adminAuth'

export async function GET(req: NextRequest) {
  const admin = await getAdminUser(req)
  if (!admin) return unauthorizedResponse()

  const faqs = await prisma.fAQ.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
  })

  return NextResponse.json({ success: true, data: faqs })
}

export async function POST(req: NextRequest) {
  const admin = await getAdminUser(req)
  if (!admin) return unauthorizedResponse()

  const body = await req.json()
  const { question, answer, category, order, isActive } = body

  if (!question || !answer) {
    return NextResponse.json({ error: 'Question and answer are required' }, { status: 400 })
  }

  const faq = await prisma.fAQ.create({
    data: { question, answer, category: category || 'general', order: order || 0, isActive: isActive !== false }
  })

  return NextResponse.json({ success: true, data: faq }, { status: 201 })
}
