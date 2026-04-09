import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/academic-writing/document - Get active document
export async function GET(request: NextRequest) {
  try {
    const document = await prisma.academicWritingDocument.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(successResponse(document))
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      errorResponse('Failed to fetch document'),
      { status: 500 }
    )
  }
}
