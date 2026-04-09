// src/app/api/v1/admin/departments/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { verifyAuth } from '@/lib/auth'

// GET /api/v1/admin/departments/:id - Get single department
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

    const department = await prisma.department.findUnique({
      where: { id: params.id },
      include: {
        subDepartments: {
          orderBy: { order: 'asc' }
        },
        services: {
          orderBy: { order: 'asc' }
        },
        projects: {
          orderBy: { order: 'asc' }
        },
        pricingTables: true,
        _count: {
          select: {
            subDepartments: true,
            services: true,
            projects: true,
            pricingTables: true
          }
        }
      }
    })

    if (!department) {
      return NextResponse.json(errorResponse('Department not found'), { status: 404 })
    }

    return NextResponse.json(successResponse(department))
  } catch (error) {
    console.error('Error fetching department:', error)
    return NextResponse.json(errorResponse('Failed to fetch department'), { status: 500 })
  }
}

// PUT /api/v1/admin/departments/:id - Update department
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
    const { name, slug, description, icon, imageUrl, order, isActive } = body

    // Check if department exists
    const existing = await prisma.department.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('Department not found'), { status: 404 })
    }

    // If slug is being changed, check for duplicates
    if (slug && slug !== existing.slug) {
      const duplicateSlug = await prisma.department.findUnique({
        where: { slug }
      })

      if (duplicateSlug) {
        return NextResponse.json(errorResponse('Department with this slug already exists'), { status: 409 })
      }
    }

    // Update department
    const department = await prisma.department.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        ...(description !== undefined && { description }),
        ...(icon !== undefined && { icon }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        _count: {
          select: {
            subDepartments: true,
            services: true,
            projects: true,
            pricingTables: true
          }
        }
      }
    })

    return NextResponse.json(successResponse(department))
  } catch (error) {
    console.error('Error updating department:', error)
    return NextResponse.json(errorResponse('Failed to update department'), { status: 500 })
  }
}

// DELETE /api/v1/admin/departments/:id - Delete department
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

    // Check if department exists
    const existing = await prisma.department.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('Department not found'), { status: 404 })
    }

    // Delete department (cascade will handle related records)
    await prisma.department.delete({
      where: { id: params.id }
    })

    return NextResponse.json(successResponse({ message: 'Department deleted successfully' }))
  } catch (error) {
    console.error('Error deleting department:', error)
    return NextResponse.json(errorResponse('Failed to delete department'), { status: 500 })
  }
}
