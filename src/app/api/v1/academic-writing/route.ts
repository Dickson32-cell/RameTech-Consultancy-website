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

    console.log(`Fetched ${phases.length} academic writing phases`)

    const response = NextResponse.json(successResponse(phases))

    // Add no-cache headers for real-time sync with admin panel
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Error fetching academic writing services:', error)
    return NextResponse.json(
      errorResponse('Failed to fetch academic writing services'),
      { status: 500 }
    )
  }
}
