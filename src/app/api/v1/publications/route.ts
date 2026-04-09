// src/app/api/v1/publications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/publications - Get all active publications (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const featured = searchParams.get('featured')

    const where: any = { isActive: true }

    if (type) {
      where.type = type
    }

    if (featured === 'true') {
      where.isFeatured = true
    }

    const publications = await prisma.publication.findMany({
      where,
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(successResponse(publications))
  } catch (error) {
    console.error('Error fetching publications:', error)
    return NextResponse.json(errorResponse('Failed to fetch publications'), { status: 500 })
  }
}
