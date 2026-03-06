// src/app/api/v1/portal/auth/login/route.ts
// POST /api/v1/portal/auth/login - Login portal user
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyPassword, generateToken, setAuthCookie, successResponse, errorResponse } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        errorResponse('Email and password are required'),
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.portalUser.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json(
        errorResponse('Invalid email or password'),
        { status: 401 }
      )
    }

    // Check password
    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json(
        errorResponse('Invalid email or password'),
        { status: 401 }
      )
    }

    // Generate token and set cookie
    const token = generateToken({ userId: user.id, email: user.email, role: user.role as 'client' | 'admin' })
    setAuthCookie(token)

    return NextResponse.json(successResponse({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }))
  } catch (error) {
    console.error('Error logging in:', error)
    return NextResponse.json(errorResponse('Failed to login'), { status: 500 })
  }
}
