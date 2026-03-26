// GET /api/v1/social - Get all active social media links
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const socials = await prisma.socialMedia.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(successResponse(socials))
  } catch (error) {
    console.error('Error fetching social media:', error)
    return NextResponse.json(errorResponse('Failed to fetch social media'), { status: 500 })
  }
}
