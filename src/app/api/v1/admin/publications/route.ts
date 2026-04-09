// src/app/api/v1/admin/publications/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/admin/publications - Get all publications
export async function GET(request: NextRequest) {
  try {
    const publications = await prisma.publication.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json(successResponse(publications))
  } catch (error) {
    console.error('Error fetching publications:', error)
    return NextResponse.json(errorResponse('Failed to fetch publications'), { status: 500 })
  }
}

// POST /api/v1/admin/publications - Create new publication
export async function POST(request: NextRequest) {
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

    // Validation
    if (!title || !type || !url) {
      return NextResponse.json(errorResponse('Title, type, and URL are required'), { status: 400 })
    }

    // Create publication
    const publication = await prisma.publication.create({
      data: {
        title,
        type,
        description,
        url,
        authors: authors || [],
        publicationDate: publicationDate ? new Date(publicationDate) : null,
        doi,
        journal,
        tags: tags || [],
        thumbnailUrl,
        pdfUrl,
        isFeatured: isFeatured !== undefined ? isFeatured : false,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(successResponse(publication), { status: 201 })
  } catch (error) {
    console.error('Error creating publication:', error)
    return NextResponse.json(errorResponse('Failed to create publication'), { status: 500 })
  }
}
