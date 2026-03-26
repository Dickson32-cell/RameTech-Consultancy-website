// PUT /api/v1/admin/faqs/[id]
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getAdminUser, unauthorizedResponse, notFoundResponse } from '@/lib/adminAuth'

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const admin = await getAdminUser(req)
  if (!admin) return unauthorizedResponse()

  const body = await req.json()
  const { question, answer, category, order, isActive } = body

  const faq = await prisma.fAQ.update({
    where: { id: params.id },
    data: { question, answer, category, order, isActive }
  }).catch(() => null)

  if (!faq) return notFoundResponse('FAQ not found')
  return NextResponse.json({ success: true, data: faq })
}

export async function GET(req: NextRequest, { params }: Params) {
  const admin = await getAdminUser(req)
  if (!admin) return unauthorizedResponse()

  const faq = await prisma.fAQ.findUnique({ where: { id: params.id } }).catch(() => null)
  if (!faq) return notFoundResponse('FAQ not found')
  return NextResponse.json({ success: true, data: faq })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const admin = await getAdminUser(req)
  if (!admin) return unauthorizedResponse()

  await prisma.fAQ.delete({ where: { id: params.id } }).catch(() => { throw new Error('Not found') })
  return NextResponse.json({ success: true })
}
