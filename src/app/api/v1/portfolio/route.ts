// src/app/api/v1/portfolio/route.ts
// GET /api/v1/portfolio - Get all portfolio projects (includes department projects)
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const active = searchParams.get('active') !== 'false'
    const department = searchParams.get('department')

    // Fetch old portfolio projects
    const portfolioProjects = await prisma.portfolioProject.findMany({
      where: {
        ...(category && { category }),
        ...(active && { isActive: true })
      },
      orderBy: { order: 'asc' }
    })

    // Fetch department projects
    const departmentProjects = await prisma.departmentProject.findMany({
      where: {
        ...(active && { isActive: true })
      },
      include: {
        department: {
          select: {
            name: true,
            slug: true
          }
        },
        subDepartment: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: { order: 'asc' }
    })

    // Transform department projects to match portfolio format
    const transformedDeptProjects = departmentProjects.map(proj => ({
      id: proj.id,
      title: proj.title,
      category: proj.department.name, // Use department name as category
      description: proj.description,
      imageUrl: proj.imageUrl,
      videoUrl: proj.videoUrl,
      projectUrl: proj.projectUrl,
      technologies: proj.technologies,
      clientName: proj.clientName,
      departmentSlug: proj.department.slug,
      subDepartmentSlug: proj.subDepartment?.slug || null,
      isDepartmentProject: true
    }))

    // Combine both types of projects
    const allProjects = [
      ...portfolioProjects.map(p => ({ ...p, isDepartmentProject: false })),
      ...transformedDeptProjects
    ]

    // Filter by department if specified
    const filteredProjects = department
      ? allProjects.filter((p: any) => p.departmentSlug === department || p.category === department)
      : allProjects

    // Filter by category if specified
    const finalProjects = category
      ? filteredProjects.filter((p: any) => p.category === category)
      : filteredProjects

    console.log(`Portfolio API: ${portfolioProjects.length} portfolio + ${departmentProjects.length} department = ${allProjects.length} total projects`)

    const response = NextResponse.json(successResponse(finalProjects))

    // Add no-cache headers
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(errorResponse('Failed to fetch portfolio'), { status: 500 })
  }
}
