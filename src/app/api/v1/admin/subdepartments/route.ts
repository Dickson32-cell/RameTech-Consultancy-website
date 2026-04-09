// src/app/api/v1/admin/subdepartments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { verifyAuth } from '@/lib/auth'

// GET /api/v1/admin/subdepartments - Get all subdepartments
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(errorResponse(authResult.error!), { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get('departmentId')

    const where = departmentId ? { departmentId } : {}

    const subdepartments = await prisma.subDepartment.findMany({
      where,
      orderBy: { order: 'asc' },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            services: true,
            projects: true
          }
        }
      }
    })

    return NextResponse.json(successResponse(subdepartments))
  } catch (error) {
    console.error('Error fetching subdepartments:', error)
    return NextResponse.json(errorResponse('Failed to fetch subdepartments'), { status: 500 })
  }
}

// POST /api/v1/admin/subdepartments - Create new subdepartment
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(errorResponse(authResult.error!), { status: 401 })
    }

    const body = await request.json()
    const { departmentId, name, slug, description, order, isActive } = body

    // Validation
    if (!departmentId || !name || !slug) {
      return NextResponse.json(errorResponse('Department ID, name and slug are required'), { status: 400 })
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    })

    if (!department) {
      return NextResponse.json(errorResponse('Department not found'), { status: 404 })
    }

    // Check for duplicate slug
    const existing = await prisma.subDepartment.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(errorResponse('SubDepartment with this slug already exists'), { status: 409 })
    }

    // Create subdepartment
    const subdepartment = await prisma.subDepartment.create({
      data: {
        departmentId,
        name,
        slug,
        description,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        department: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        },
        _count: {
          select: {
            services: true,
            projects: true
          }
        }
      }
    })

    return NextResponse.json(successResponse(subdepartment), { status: 201 })
  } catch (error) {
    console.error('Error creating subdepartment:', error)
    return NextResponse.json(errorResponse('Failed to create subdepartment'), { status: 500 })
  }
}
