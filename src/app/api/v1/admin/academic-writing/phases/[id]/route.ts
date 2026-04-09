import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/v1/admin/academic-writing/phases/[id] - Get a single phase
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const phase = await prisma.academicWritingPhase.findUnique({
      where: { id: params.id },
      include: {
        serviceItems: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!phase) {
      return NextResponse.json(
        { success: false, error: 'Phase not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: phase
    })
  } catch (error) {
    console.error('Error fetching phase:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch phase' },
      { status: 500 }
    )
  }
}

// PUT /api/v1/admin/academic-writing/phases/[id] - Update a phase
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, order, isActive } = body

    const phase = await prisma.academicWritingPhase.update({
      where: { id: params.id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(order !== undefined && { order }),
        ...(isActive !== undefined && { isActive })
      }
    })

    return NextResponse.json({
      success: true,
      data: phase,
      message: 'Phase updated successfully'
    })
  } catch (error) {
    console.error('Error updating phase:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update phase' },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/admin/academic-writing/phases/[id] - Delete a phase
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.academicWritingPhase.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Phase deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting phase:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete phase' },
      { status: 500 }
    )
  }
}
