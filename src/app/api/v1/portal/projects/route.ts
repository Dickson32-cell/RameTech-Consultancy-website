// src/app/api/v1/portal/projects/route.ts
// GET /api/v1/portal/projects - Get user's projects
// POST /api/v1/portal/projects - Create new project (admin only in production)
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getCurrentUser, successResponse, errorResponse } from '@/lib/auth'

export async function GET() {
  try {
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 })
    }

    const projects = await prisma.project.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(successResponse(projects))
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(errorResponse('Failed to fetch projects'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = getCurrentUser()
    if (!user) {
      return NextResponse.json(errorResponse('Unauthorized'), { status: 401 })
    }

    const body = await request.json()
    const { title, description, budget, startDate, endDate } = body

    if (!title || !description) {
      return NextResponse.json(
        errorResponse('Title and description are required'),
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        budget,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        userId: user.userId
      }
    })

    return NextResponse.json(successResponse(project), { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(errorResponse('Failed to create project'), { status: 500 })
  }
}
