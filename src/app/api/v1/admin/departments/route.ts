// src/app/api/v1/admin/departments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/admin/departments - Get all departments
export async function GET(request: NextRequest) {
  try {

    const departments = await prisma.department.findMany({
      orderBy: { order: 'asc' },
      include: {
        subDepartments: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        services: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        projects: {
          where: { isActive: true },
          orderBy: { order: 'asc' }
        },
        pricingTables: {
          where: { isActive: true }
        },
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

    return NextResponse.json(successResponse(departments))
  } catch (error) {
    console.error('Error fetching departments:', error)
    return NextResponse.json(errorResponse('Failed to fetch departments'), { status: 500 })
  }
}

// POST /api/v1/admin/departments - Create new department
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, slug, description, icon, imageUrl, order, isActive } = body

    // Validation
    if (!name || !slug) {
      return NextResponse.json(errorResponse('Name and slug are required'), { status: 400 })
    }

    // Check for duplicate slug
    const existing = await prisma.department.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(errorResponse('Department with this slug already exists'), { status: 409 })
    }

    // Create department
    const department = await prisma.department.create({
      data: {
        name,
        slug,
        description,
        icon,
        imageUrl,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
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

    return NextResponse.json(successResponse(department), { status: 201 })
  } catch (error) {
    console.error('Error creating department:', error)
    return NextResponse.json(errorResponse('Failed to create department'), { status: 500 })
  }
}
