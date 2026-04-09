// src/app/api/v1/admin/department-projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'
import { verifyAuth } from '@/lib/auth'

// GET /api/v1/admin/department-projects/:id - Get single project
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

    const project = await prisma.departmentProject.findUnique({
      where: { id: params.id },
      include: {
        department: true,
        subDepartment: true
      }
    })

    if (!project) {
      return NextResponse.json(errorResponse('Project not found'), { status: 404 })
    }

    return NextResponse.json(successResponse(project))
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(errorResponse('Failed to fetch project'), { status: 500 })
  }
}

// PUT /api/v1/admin/department-projects/:id - Update project
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
    const {
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

    // Check if project exists
    const existing = await prisma.departmentProject.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('Project not found'), { status: 404 })
    }

    // If slug is being changed, check for duplicates
    if (slug && slug !== existing.slug) {
      const duplicateSlug = await prisma.departmentProject.findUnique({
        where: { slug }
      })

      if (duplicateSlug) {
        return NextResponse.json(errorResponse('Project with this slug already exists'), { status: 409 })
      }
    }

    // Update project
    const project = await prisma.departmentProject.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(slug && { slug }),
        ...(description && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(videoUrl !== undefined && { videoUrl }),
        ...(technologies && { technologies }),
        ...(clientName !== undefined && { clientName }),
        ...(projectUrl !== undefined && { projectUrl }),
        ...(completedDate !== undefined && { completedDate: completedDate ? new Date(completedDate) : null }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      },
      include: {
        department: true,
        subDepartment: true
      }
    })

    return NextResponse.json(successResponse(project))
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json(errorResponse('Failed to update project'), { status: 500 })
  }
}

// DELETE /api/v1/admin/department-projects/:id - Delete project
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

    // Check if project exists
    const existing = await prisma.departmentProject.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(errorResponse('Project not found'), { status: 404 })
    }

    // Delete project
    await prisma.departmentProject.delete({
      where: { id: params.id }
    })

    return NextResponse.json(successResponse({ message: 'Project deleted successfully' }))
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(errorResponse('Failed to delete project'), { status: 500 })
  }
}
