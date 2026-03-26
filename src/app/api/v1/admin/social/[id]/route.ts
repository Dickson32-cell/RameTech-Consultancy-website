// GET /api/v1/admin/social/[id] - Get single social media
// PUT /api/v1/admin/social/[id] - Update social media
// DELETE /api/v1/admin/social/[id] - Delete social media
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const social = await prisma.socialMedia.findUnique({ where: { id: params.id } })
    if (!social) return NextResponse.json(errorResponse('Not found'), { status: 404 })
    return NextResponse.json(successResponse(social))
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to fetch'), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { name, url, icon, order, isActive } = body
    const social = await prisma.socialMedia.update({
      where: { id: params.id },
      data: { name, url, icon, order, isActive }
    })
    return NextResponse.json(successResponse(social))
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to update'), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.socialMedia.delete({ where: { id: params.id } })
    return NextResponse.json(successResponse({ deleted: true }))
  } catch (error) {
    return NextResponse.json(errorResponse('Failed to delete'), { status: 500 })
  }
}
