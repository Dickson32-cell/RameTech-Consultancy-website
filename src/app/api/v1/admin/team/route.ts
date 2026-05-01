import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/auth'

export async function GET() {
  try {
    const members = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' }
    })
    return NextResponse.json(successResponse(members))
  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(errorResponse('Failed to fetch team members'), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, role, bio, email, phone, photoUrl, order, isActive } = body

    if (!name || !role || !bio || !email) {
      return NextResponse.json(errorResponse('Name, role, bio, and email are required'), { status: 400 })
    }

    const member = await prisma.teamMember.create({
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

    return NextResponse.json(successResponse(member), { status: 201 })
  } catch (error: any) {
    console.error('Error creating team member:', error?.code, error?.message, error)

    if (error.code === 'P2002') {
      return NextResponse.json(errorResponse('This email is already in use by another team member'), { status: 409 })
    }

    if (error.code === 'P1001' || error.code === 'P1003') {
      return NextResponse.json(errorResponse('Database connection failed. Please check server configuration.'), { status: 503 })
    }

    return NextResponse.json(errorResponse('Failed to create team member'), { status: 500 })
  }
}
