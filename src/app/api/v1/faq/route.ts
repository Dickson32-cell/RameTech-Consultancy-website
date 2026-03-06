// src/app/api/v1/faq/route.ts
// GET /api/v1/faq - Get all FAQs
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const active = searchParams.get('active') !== 'false'

    const faqs = await prisma.fAQ.findMany({
      where: {
        ...(category && { category }),
        ...(active && { isActive: true })
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(successResponse(faqs))
  } catch (error) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(errorResponse('Failed to fetch FAQs'), { status: 500 })
  }
}
