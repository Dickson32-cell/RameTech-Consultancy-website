// src/app/api/v1/admin/department-projects/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'


// GET /api/v1/admin/department-projects - Get all projects
export async function GET(request: NextRequest) {
  try {

    const { searchParams } = new URL(request.url)
    const departmentId = searchParams.get('departmentId')
    const subDepartmentId = searchParams.get('subDepartmentId')

    const where: any = {}
    if (departmentId) where.departmentId = departmentId
    if (subDepartmentId) where.subDepartmentId = subDepartmentId

    const projects = await prisma.departmentProject.findMany({
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

    return NextResponse.json(successResponse(projects))
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(errorResponse('Failed to fetch projects'), { status: 500 })
  }
}

// POST /api/v1/admin/department-projects - Create new project
export async function POST(request: NextRequest) {
  try {

    const body = await request.json()
    const {
      departmentId,
      subDepartmentId,
      title,
      slug,
      description,
      imageUrl,
      videoUrl,
      technologies,
      clientName,
      projectUrl,
      completedDate,
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
    const existing = await prisma.departmentProject.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(errorResponse('Project with this slug already exists'), { status: 409 })
    }

    // Create project
    const project = await prisma.departmentProject.create({
      data: {
        departmentId,
        subDepartmentId: subDepartmentId || null,
        title,
        slug,
        description,
        imageUrl,
        videoUrl,
        technologies: technologies || [],
        clientName,
        projectUrl,
        completedDate: completedDate ? new Date(completedDate) : null,
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

    return NextResponse.json(successResponse(project), { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(errorResponse('Failed to create project'), { status: 500 })
  }
}
