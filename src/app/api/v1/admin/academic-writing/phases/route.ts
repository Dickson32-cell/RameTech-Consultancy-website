import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/v1/admin/academic-writing/phases - Get all phases
export async function GET(request: NextRequest) {
  try {
    const phases = await prisma.academicWritingPhase.findMany({
      include: {
        serviceItems: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: phases
    })
  } catch (error) {
    console.error('Error fetching phases:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch phases' },
      { status: 500 }
    )
  }
}

// POST /api/v1/admin/academic-writing/phases - Create a new phase
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, order, isActive } = body

    // Validation
    if (!name) {
      return NextResponse.json(
        { success: false, error: 'Phase name is required' },
        { status: 400 }
      )
    }

    const phase = await prisma.academicWritingPhase.create({
      data: {
        name,
        description,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json({
      success: true,
      data: phase,
      message: 'Phase created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating phase:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create phase' },
      { status: 500 }
    )
  }
}
