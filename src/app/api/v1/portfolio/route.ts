// src/app/api/v1/portfolio/route.ts
// GET /api/v1/portfolio - Get portfolio projects only (NOT department projects)
// Department projects are shown on their respective department pages
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const active = searchParams.get('active') !== 'false'

    // Fetch ONLY portfolio projects (managed in /admin/portfolio)
    const portfolioProjects = await prisma.portfolioProject.findMany({
      where: {
        ...(category && { category }),
        ...(active && { isActive: true })
      },
      orderBy: { order: 'asc' }
    })

    console.log(`✅ Portfolio API: Fetched ${portfolioProjects.length} portfolio projects`)

    const response = NextResponse.json(successResponse(portfolioProjects))

    // Add no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(errorResponse('Failed to fetch portfolio'), { status: 500 })
  }
}
