// GET /api/v1/admin/social - Get all social media
// POST /api/v1/admin/social - Create social media
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const socials = await prisma.socialMedia.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(successResponse(socials))
  } catch (error) {
    console.error('Error fetching social media:', error)
    return NextResponse.json(errorResponse('Failed to fetch social media'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, url, icon, order } = body

    if (!name || !url || !icon) {
      return NextResponse.json(errorResponse('Name, URL, and icon are required'), { status: 400 })
    }

    const social = await prisma.socialMedia.create({
      data: { name, url, icon, order: order || 0 }
    })

    return NextResponse.json(successResponse(social), { status: 201 })
  } catch (error) {
    console.error('Error creating social media:', error)
    return NextResponse.json(errorResponse('Failed to create social media'), { status: 500 })
  }
}
