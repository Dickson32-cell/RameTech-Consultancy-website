// src/app/api/v1/team/route.ts
// GET /api/v1/team - Get all team members
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(successResponse(team))
  } catch (error) {
    console.error('Error fetching team:', error)
    return NextResponse.json(errorResponse('Failed to fetch team members'), { status: 500 })
  }
}
