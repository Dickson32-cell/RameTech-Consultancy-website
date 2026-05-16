import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await prisma.portfolioProject.findUnique({
      where: { id }
    })

    if (!project) {
      return NextResponse.json(errorResponse('Portfolio project not found'), { status: 404 })
    }

    return NextResponse.json(successResponse(project))
  } catch (error) {
    console.error('Error fetching portfolio project:', error)
    return NextResponse.json(errorResponse('Failed to fetch portfolio project'), { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, slug, category, description, imageUrl, videoUrl, technologies, clientName, projectUrl, order, isActive } = body

    if (!title || !slug || !category || !description) {
      return NextResponse.json(errorResponse('Title, slug, category, and description are required'), { status: 400 })
    }

    // Check if slug already exists for another project
    const existing = await prisma.portfolioProject.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    })

    if (existing) {
      return NextResponse.json(errorResponse('A project with this slug already exists'), { status: 400 })
    }

    const project = await prisma.portfolioProject.update({
      where: { id },
      data: {
        title,
        slug,
        category,
        description,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
        technologies: technologies || [],
        clientName: clientName || null,
        projectUrl: projectUrl || null,
        order: order ?? 0,
        isActive: isActive ?? true
      }
    })

    // Revalidate relevant paths to clear cache
    try {
      revalidatePath('/portfolio')
      revalidatePath('/api/v1/portfolio')
      revalidatePath('/')
      console.log('✅ Cache revalidated for portfolio pages after update')
    } catch (revalidateError) {
      console.error('Warning: Failed to revalidate cache:', revalidateError)
    }

    return NextResponse.json(successResponse(project))
  } catch (error) {
    console.error('Error updating portfolio project:', error)
    return NextResponse.json(errorResponse('Failed to update portfolio project'), { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Allow partial updates (e.g., just toggling isActive)
    const project = await prisma.portfolioProject.update({
      where: { id },
      data: body
    })

    return NextResponse.json(successResponse(project))
  } catch (error) {
    console.error('Error updating portfolio project:', error)
    return NextResponse.json(errorResponse('Failed to update portfolio project'), { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    console.log(`🗑️ Deleting portfolio project: ${id}`)

    await prisma.portfolioProject.delete({
      where: { id }
    })

    console.log(`✅ Portfolio project deleted successfully: ${id}`)

    // Revalidate relevant paths to clear cache
    try {
      revalidatePath('/portfolio')
      revalidatePath('/api/v1/portfolio')
      revalidatePath('/')
      console.log('✅ Cache revalidated for portfolio pages')
    } catch (revalidateError) {
      console.error('Warning: Failed to revalidate cache:', revalidateError)
    }

    return NextResponse.json(successResponse({ message: 'Portfolio project deleted successfully' }))
  } catch (error) {
    console.error('Error deleting portfolio project:', error)
    return NextResponse.json(errorResponse('Failed to delete portfolio project'), { status: 500 })
  }
}
