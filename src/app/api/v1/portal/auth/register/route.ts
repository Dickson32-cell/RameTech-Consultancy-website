// src/app/api/v1/portal/auth/register/route.ts
// POST /api/v1/portal/auth/register - Register new portal user
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { hashPassword, generateToken, setAuthCookie, successResponse, errorResponse } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, password, company, phone } = body

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        errorResponse('Name, email, and password are required'),
        { status: 400 }
      )
    }

    // Check if user exists
    const existing = await prisma.portalUser.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json(
        errorResponse('Email already registered'),
        { status: 400 }
      )
    }

    // Create user
    const passwordHash = await hashPassword(password)
    const user = await prisma.portalUser.create({
      data: {
        name,
        email,
        passwordHash,
        company,
        phone,
        role: 'client'
      }
    })

    // Generate token and set cookie
    const token = generateToken({ userId: user.id, email: user.email, role: user.role as 'client' | 'admin' })
    setAuthCookie(token)

    return NextResponse.json(successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }), { status: 201 })
  } catch (error) {
    console.error('Error registering user:', error)
    return NextResponse.json(errorResponse('Failed to register'), { status: 500 })
  }
}
