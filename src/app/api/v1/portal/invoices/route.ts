// src/app/api/v1/portal/invoices/route.ts
// GET /api/v1/portal/invoices - Get user's invoices
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getCurrentUser, successResponse, errorResponse } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    const invoices = await prisma.invoice.findMany({
      where: {
        userId: user.userId,
        ...(status && { status })
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(successResponse(invoices))
  } catch (error) {
    console.error('Error fetching invoices:', error)
    return NextResponse.json(errorResponse('Failed to fetch invoices'), { status: 500 })
  }
}
