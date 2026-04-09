// src/app/api/v1/admin/departments/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/admin/departments - Get all departments
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching departments...')

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

    console.log(`Found ${departments.length} departments`)

    const response = NextResponse.json(successResponse(departments))

    // Add no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error: any) {
    console.error('Error fetching departments:', error)

    // Check if it's a table not found error
    if (error.message?.includes('does not exist')) {
      return NextResponse.json(
        errorResponse('Database tables not created yet. Please run: npm run render:setup in Render shell'),
        { status: 500 }
      )
    }

    return NextResponse.json(
      errorResponse(`Failed to fetch departments: ${error.message || 'Unknown error'}`),
      { status: 500 }
    )
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
