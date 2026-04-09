import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/admin/academic-writing/service-items/[id] - Get a single service item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const serviceItem = await prisma.academicWritingServiceItem.findUnique({
      where: { id: params.id },
      include: {
        phase: true
      }
    })

    if (!serviceItem) {
      return NextResponse.json(
        { success: false, error: 'Service item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: serviceItem
    })
  } catch (error) {
    console.error('Error fetching service item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch service item' },
      { status: 500 }
    )
  }
}

// PUT /api/v1/admin/academic-writing/service-items/[id] - Update a service item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { phaseId, name, description, bachelorPrice, masterPrice, phdPrice, order, isActive } = body

    const updateData: any = {}

    if (phaseId !== undefined) updateData.phaseId = phaseId
    if (name !== undefined) updateData.name = name
    if (description !== undefined) updateData.description = description
    if (bachelorPrice !== undefined) updateData.bachelorPrice = parseInt(bachelorPrice)
    if (masterPrice !== undefined) updateData.masterPrice = parseInt(masterPrice)
    if (phdPrice !== undefined) updateData.phdPrice = parseInt(phdPrice)
    if (order !== undefined) updateData.order = order
    if (isActive !== undefined) updateData.isActive = isActive

    const serviceItem = await prisma.academicWritingServiceItem.update({
      where: { id: params.id },
      data: updateData,
      include: {
        phase: true
      }
    })

    return NextResponse.json({
      success: true,
      data: serviceItem,
      message: 'Service item updated successfully'
    })
  } catch (error) {
    console.error('Error updating service item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update service item' },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/admin/academic-writing/service-items/[id] - Delete a service item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.academicWritingServiceItem.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Service item deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting service item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete service item' },
      { status: 500 }
    )
  }
}
