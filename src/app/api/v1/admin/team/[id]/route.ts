import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const member = await prisma.teamMember.findUnique({
      where: { id }
    })

    if (!member) {
      return NextResponse.json(errorResponse('Team member not found'), { status: 404 })
    }

    return NextResponse.json(successResponse(member))
  } catch (error) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(errorResponse('Failed to fetch team member'), { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { name, role, bio, email, phone, photoUrl, order, isActive } = body

    if (!name || !role || !bio || !email) {
      return NextResponse.json(errorResponse('Name, role, bio, and email are required'), { status: 400 })
    }

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name,
        role,
        bio,
        email,
        phone: phone || null,
        photoUrl: photoUrl || null,
        order: order ?? 0,
        isActive: isActive ?? true
      }
    })

    return NextResponse.json(successResponse(member))
  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(errorResponse('Failed to update team member'), { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.teamMember.delete({
      where: { id }
    })

    return NextResponse.json(successResponse({ message: 'Team member deleted successfully' }))
  } catch (error) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(errorResponse('Failed to delete team member'), { status: 500 })
  }
}
