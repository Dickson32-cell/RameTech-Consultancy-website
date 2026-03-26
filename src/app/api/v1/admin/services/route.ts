import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/auth'

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(successResponse(services))
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(errorResponse('Failed to fetch services'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, icon, features, order, isActive } = body

    if (!name || !slug || !description) {
      return NextResponse.json(errorResponse('Name, slug, and description are required'), { status: 400 })
    }

    // Check if slug already exists
    const existing = await prisma.service.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(errorResponse('A service with this slug already exists'), { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        name,
        slug,
        description,
        icon: icon || null,
        features: features || [],
        order: order ?? 0,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json(successResponse(service), { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(errorResponse('Failed to create service'), { status: 500 })
  }
}
