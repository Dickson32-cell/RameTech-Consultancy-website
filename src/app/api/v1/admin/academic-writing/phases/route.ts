import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/admin/academic-writing/phases - Get all phases
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching academic writing phases...')

    const phases = await prisma.academicWritingPhase.findMany({
      include: {
        serviceItems: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    })

    console.log(`Found ${phases.length} phases`)

    return NextResponse.json(successResponse(phases))
  } catch (error: any) {
    console.error('Error fetching phases:', error)

    // Check if it's a table not found error
    if (error.message?.includes('does not exist')) {
      return NextResponse.json(
        errorResponse('Database tables not created yet. Please run: npm run db:push in Render shell'),
        { status: 500 }
      )
    }

    return NextResponse.json(
      errorResponse(`Failed to fetch phases: ${error.message || 'Unknown error'}`),
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
      return NextResponse.json(errorResponse('Phase name is required'), { status: 400 })
    }

    const phase = await prisma.academicWritingPhase.create({
      data: {
        name,
        description,
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      }
    })

    return NextResponse.json(successResponse(phase), { status: 201 })
  } catch (error) {
    console.error('Error creating phase:', error)
    return NextResponse.json(errorResponse('Failed to create phase'), { status: 500 })
  }
}
