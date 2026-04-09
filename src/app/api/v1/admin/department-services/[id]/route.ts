// src/app/api/v1/admin/department-services/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'


// GET /api/v1/admin/department-services/:id - Get single service
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const service = await prisma.departmentService.findUnique({
      where: { id: params.id },
      include: {
        department: true,
        subDepartment: true
      }
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

// PUT /api/v1/admin/department-services/:id - Update service
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    const body = await request.json()
    const {
      title,
      slug,
      description,
      price,
      features,
      imageUrl,
      order,
      isActive
    } = body

    // Check if service exists
    const existing = await prisma.departmentService.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('Service not found'), { status: 404 })
    }

    // If slug is being changed, check for duplicates
    if (slug && slug !== existing.slug) {
      const duplicateSlug = await prisma.departmentService.findUnique({
        where: { slug }
      })

      if (duplicateSlug) {
        return NextResponse.json(errorResponse('Service with this slug already exists'), { status: 409 })
      }
    }

    // Update service
    const service = await prisma.departmentService.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(price !== undefined && { price }),
        ...(features && { features }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        department: true,
        subDepartment: true
      }
    })

    return NextResponse.json(successResponse(service))
  } catch (error) {
    console.error('Error updating service:', error)
    return NextResponse.json(errorResponse('Failed to update service'), { status: 500 })
  }
}

// DELETE /api/v1/admin/department-services/:id - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {

    // Check if service exists
    const existing = await prisma.departmentService.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('Service not found'), { status: 404 })
    }

    // Delete service
    await prisma.departmentService.delete({
      where: { id: params.id }
    })

    return NextResponse.json(successResponse({ message: 'Service deleted successfully' }))
  } catch (error) {
    console.error('Error deleting service:', error)
    return NextResponse.json(errorResponse('Failed to delete service'), { status: 500 })
  }
}
