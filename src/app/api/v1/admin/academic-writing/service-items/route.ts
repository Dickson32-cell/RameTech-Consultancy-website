import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/admin/academic-writing/service-items - Get all service items
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phaseId = searchParams.get('phaseId')

    const where = phaseId ? { phaseId } : {}

    const serviceItems = await prisma.academicWritingServiceItem.findMany({
      where,
      include: {
        phase: true
      },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: serviceItems
    })
  } catch (error) {
    console.error('Error fetching service items:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service items' },
      { status: 500 }
    )
  }
}

// POST /api/v1/admin/academic-writing/service-items - Create a new service item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { phaseId, name, description, bachelorPrice, masterPrice, phdPrice, order, isActive } = body

    // Validation
    if (!phaseId || !name || !description) {
      return NextResponse.json(
        { success: false, error: 'Phase ID, name, and description are required' },
        { status: 400 }
      )
    }

    if (bachelorPrice === undefined || masterPrice === undefined || phdPrice === undefined) {
      return NextResponse.json(
        { success: false, error: 'All pricing tiers are required' },
        { status: 400 }
      )
    }

    const serviceItem = await prisma.academicWritingServiceItem.create({
      data: {
        phaseId,
        name,
        description,
        bachelorPrice: parseInt(bachelorPrice),
        masterPrice: parseInt(masterPrice),
        phdPrice: parseInt(phdPrice),
        order: order || 0,
        isActive: isActive !== undefined ? isActive : true
      },
      include: {
        phase: true
      }
    })

    return NextResponse.json({
      success: true,
      data: serviceItem,
      message: 'Service item created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating service item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create service item' },
      { status: 500 }
    )
  }
}
