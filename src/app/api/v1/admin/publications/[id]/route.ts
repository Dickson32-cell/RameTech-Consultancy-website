// src/app/api/v1/admin/publications/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/admin/publications/:id - Get single publication
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const publication = await prisma.publication.findUnique({
      where: { id: params.id }
    })

    if (!publication) {
      return NextResponse.json(errorResponse('Publication not found'), { status: 404 })
    }

    return NextResponse.json(successResponse(publication))
  } catch (error) {
    console.error('Error fetching publication:', error)
    return NextResponse.json(errorResponse('Failed to fetch publication'), { status: 500 })
  }
}

// PUT /api/v1/admin/publications/:id - Update publication
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      type,
      description,
      url,
      authors,
      publicationDate,
      doi,
      journal,
      tags,
      thumbnailUrl,
      pdfUrl,
      isFeatured,
      order,
      isActive
    } = body

    // Check if publication exists
    const existing = await prisma.publication.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('Publication not found'), { status: 404 })
    }

    // Update publication
    const publication = await prisma.publication.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(type && { type }),
        ...(description !== undefined && { description }),
        ...(url && { url }),
        ...(authors && { authors }),
        ...(publicationDate !== undefined && { publicationDate: publicationDate ? new Date(publicationDate) : null }),
        ...(doi !== undefined && { doi }),
        ...(journal !== undefined && { journal }),
        ...(tags && { tags }),
        ...(thumbnailUrl !== undefined && { thumbnailUrl }),
        ...(pdfUrl !== undefined && { pdfUrl }),
        ...(isFeatured !== undefined && { isFeatured }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json(successResponse(publication))
  } catch (error) {
    console.error('Error updating publication:', error)
    return NextResponse.json(errorResponse('Failed to update publication'), { status: 500 })
  }
}

// DELETE /api/v1/admin/publications/:id - Delete publication
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if publication exists
    const existing = await prisma.publication.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('Publication not found'), { status: 404 })
    }

    // Delete publication
    await prisma.publication.delete({
      where: { id: params.id }
    })

    return NextResponse.json(successResponse({ message: 'Publication deleted successfully' }))
  } catch (error) {
    console.error('Error deleting publication:', error)
    return NextResponse.json(errorResponse('Failed to delete publication'), { status: 500 })
  }
}
