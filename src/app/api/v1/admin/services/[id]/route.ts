import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const service = await prisma.service.findUnique({
      where: { id }
    })

    if (!service) {
      return NextResponse.json(errorResponse('Service not found'), { status: 404 })
    }

    return NextResponse.json(successResponse(service))
  } catch (error) {
    console.error('Error fetching service:', error)
    return NextResponse.json(errorResponse('Failed to fetch service'), { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, slug, description, icon, features, order, isActive } = body

    if (!name || !slug || !description) {
      return NextResponse.json(errorResponse('Name, slug, and description are required'), { status: 400 })
    }

    // Check if slug already exists for another service
    const existing = await prisma.service.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    })

    if (existing) {
      return NextResponse.json(errorResponse('A service with this slug already exists'), { status: 400 })
    }

    const service = await prisma.service.update({
      where: { id },
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

    return NextResponse.json(successResponse(service))
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(errorResponse('Failed to update service'), { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.service.delete({
      where: { id }
    })

    return NextResponse.json(successResponse({ message: 'Service deleted successfully' }))
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(errorResponse('Failed to delete service'), { status: 500 })
  }
}
