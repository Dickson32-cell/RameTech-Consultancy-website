// src/app/api/v1/services/route.ts
// GET /api/v1/services - Get all services
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const active = searchParams.get('active') !== 'false'

    const services = await prisma.service.findMany({
      where: active ? { isActive: true } : undefined,
      orderBy: { order: 'asc' }
    })

    console.log(`Fetched ${services.length} services (active: ${active})`)

    const response = NextResponse.json(successResponse(services))

    // Add no-cache headers for real-time sync with admin panel
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(errorResponse('Failed to fetch services'), { status: 500 })
  }
}
