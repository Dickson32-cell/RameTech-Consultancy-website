// src/app/api/v1/admin/subdepartments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { verifyAuth } from '@/lib/auth'

// GET /api/v1/admin/subdepartments/:id - Get single subdepartment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(errorResponse(authResult.error!), { status: 401 })
    }

    const subdepartment = await prisma.subDepartment.findUnique({
      where: { id: params.id },
      include: {
        department: true,
        services: {
          orderBy: { order: 'asc' }
        },
        projects: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            services: true,
            projects: true
          }
        }
      }
    })

    if (!subdepartment) {
      return NextResponse.json(errorResponse('SubDepartment not found'), { status: 404 })
    }

    return NextResponse.json(successResponse(subdepartment))
  } catch (error) {
    console.error('Error fetching subdepartment:', error)
    return NextResponse.json(errorResponse('Failed to fetch subdepartment'), { status: 500 })
  }
}

// PUT /api/v1/admin/subdepartments/:id - Update subdepartment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(errorResponse(authResult.error!), { status: 401 })
    }

    const body = await request.json()
    const { name, slug, description, order, isActive } = body

    // Check if subdepartment exists
    const existing = await prisma.subDepartment.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('SubDepartment not found'), { status: 404 })
    }

    // If slug is being changed, check for duplicates
    if (slug && slug !== existing.slug) {
      const duplicateSlug = await prisma.subDepartment.findUnique({
        where: { slug }
      })

      if (duplicateSlug) {
        return NextResponse.json(errorResponse('SubDepartment with this slug already exists'), { status: 409 })
      }
    }

    // Update subdepartment
    const subdepartment = await prisma.subDepartment.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        department: true,
        _count: {
          select: {
            services: true,
            projects: true
          }
        }
      }
    })

    return NextResponse.json(successResponse(subdepartment))
  } catch (error) {
    console.error('Error updating subdepartment:', error)
    return NextResponse.json(errorResponse('Failed to update subdepartment'), { status: 500 })
  }
}

// DELETE /api/v1/admin/subdepartments/:id - Delete subdepartment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(errorResponse(authResult.error!), { status: 401 })
    }

    // Check if subdepartment exists
    const existing = await prisma.subDepartment.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('SubDepartment not found'), { status: 404 })
    }

    // Delete subdepartment (cascade will handle related records)
    await prisma.subDepartment.delete({
      where: { id: params.id }
    })

    return NextResponse.json(successResponse({ message: 'SubDepartment deleted successfully' }))
  } catch (error) {
    console.error('Error deleting subdepartment:', error)
    return NextResponse.json(errorResponse('Failed to delete subdepartment'), { status: 500 })
  }
}
