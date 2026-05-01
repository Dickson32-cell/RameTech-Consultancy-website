// src/app/api/v1/team/route.ts
// GET /api/v1/team - Get all team members
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const team = await prisma.teamMember.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })

    const response = NextResponse.json(successResponse(team))

    // Prevent caching to ensure inactive members don't show
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')

    return response
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(errorResponse('Failed to fetch team members'), { status: 500 })
  }
}
