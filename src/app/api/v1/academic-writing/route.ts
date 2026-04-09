import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/v1/academic-writing - Get all phases with service items
export async function GET(request: NextRequest) {
  try {
    const phases = await prisma.academicWritingPhase.findMany({
      where: { isActive: true },
      include: {
        serviceItems: {
          where: { isActive: true },
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
    console.error('Error fetching academic writing services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch academic writing services' },
      { status: 500 }
    )
  }
}
