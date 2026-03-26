import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/auth'

export async function GET() {
  try {
    const projects = await prisma.portfolioProject.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(successResponse(projects))
  } catch (error) {
    console.error('Error fetching portfolio projects:', error)
    return NextResponse.json(errorResponse('Failed to fetch portfolio projects'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, slug, category, description, imageUrl, technologies, clientName, projectUrl, order, isActive } = body

    if (!title || !slug || !category || !description) {
      return NextResponse.json(errorResponse('Title, slug, category, and description are required'), { status: 400 })
    }

    // Check if slug already exists
    const existing = await prisma.portfolioProject.findUnique({
      where: { slug }
    })

    if (existing) {
      return NextResponse.json(errorResponse('A project with this slug already exists'), { status: 400 })
    }

    const project = await prisma.portfolioProject.create({
      data: {
        title,
        slug,
        category,
        description,
        imageUrl: imageUrl || null,
        technologies: technologies || [],
        clientName: clientName || null,
        projectUrl: projectUrl || null,
        order: order ?? 0,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json(successResponse(project), { status: 201 })
  } catch (error) {
    console.error('Error creating portfolio project:', error)
    return NextResponse.json(errorResponse('Failed to create portfolio project'), { status: 500 })
  }
}
