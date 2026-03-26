// src/app/api/v1/portfolio/route.ts
// GET /api/v1/portfolio - Get all portfolio projects
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const active = searchParams.get('active') !== 'false'

    const projects = await prisma.portfolioProject.findMany({
      where: {
        ...(category && { category }),
        ...(active && { isActive: true })
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(successResponse(projects))
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(errorResponse('Failed to fetch portfolio'), { status: 500 })
  }
}
