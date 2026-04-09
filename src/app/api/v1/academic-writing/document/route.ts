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

    console.log('Active document fetch:', document ? `Found: ${document.fileName}` : 'No active document')

    const response = NextResponse.json(successResponse(document))

    // Add no-cache headers for real-time sync with admin panel
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Error fetching document:', error)
    return NextResponse.json(
      errorResponse('Failed to fetch document'),
      { status: 500 }
    )
  }
}
