import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/academic-writing - Get all phases with service items
export async function GET(request: NextRequest) {
  try {
    const phases = await prisma.academicWritingPhase.findMany({
      where: { isActive: true },
      include: {
        serviceItems: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(successResponse(phases))
  } catch (error) {
    console.error('Error fetching academic writing services:', error)
    return NextResponse.json(
      errorResponse('Failed to fetch academic writing services'),
      { status: 500 }
    )
  }
}
