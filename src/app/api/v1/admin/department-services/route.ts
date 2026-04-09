// src/app/api/v1/admin/department-services/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { verifyAuth } from '@/lib/auth'

// GET /api/v1/admin/department-services - Get all services
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(errorResponse(authResult.error!), { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get('departmentId')
    const subDepartmentId = searchParams.get('subDepartmentId')

    const where: any = {}
    if (departmentId) where.departmentId = departmentId
    if (subDepartmentId) where.subDepartmentId = subDepartmentId

    const services = await prisma.departmentService.findMany({
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
        subDepartment: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(successResponse(services))
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json(errorResponse('Failed to fetch services'), { status: 500 })
  }
}

// POST /api/v1/admin/department-services - Create new service
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    if (!authResult.authenticated) {
      return NextResponse.json(errorResponse(authResult.error!), { status: 401 })
    }

    const body = await request.json()
    const {
      departmentId,
      subDepartmentId,
      title,
      slug,
      description,
      price,
      features,
      imageUrl,
      order,
      isActive
    } = body

    // Validation
    if (!departmentId || !title || !slug || !description) {
      return NextResponse.json(errorResponse('Department ID, title, slug and description are required'), { status: 400 })
    }

    // Check if department exists
    const department = await prisma.department.findUnique({
      where: { id: departmentId }
    })

    if (!department) {
      return NextResponse.json(errorResponse('Department not found'), { status: 404 })
    }

    // Check if subdepartment exists (if provided)
    if (subDepartmentId) {
      const subDepartment = await prisma.subDepartment.findUnique({
        where: { id: subDepartmentId }
      })

      if (!subDepartment) {
        return NextResponse.json(errorResponse('SubDepartment not found'), { status: 404 })
      }
    }

    // Check for duplicate slug
    const existing = await prisma.departmentService.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(errorResponse('Service with this slug already exists'), { status: 409 })
    }

    // Create service
    const service = await prisma.departmentService.create({
      data: {
        departmentId,
        subDepartmentId: subDepartmentId || null,
        title,
        slug,
        description,
        price,
        features: features || [],
        imageUrl,
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
        subDepartment: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(successResponse(service), { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json(errorResponse('Failed to create service'), { status: 500 })
  }
}
