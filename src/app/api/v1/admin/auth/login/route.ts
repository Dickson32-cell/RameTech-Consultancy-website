// Admin login
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
const COOKIE_NAME = 'rametech_token'

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ success: false, error: 'Email and password required' }, { status: 400 })
    }

    // Find user
    const user = await prisma.portalUser.findUnique({ where: { email } })

    if (!user) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Access denied. Admin only.' }, { status: 403 })
    }

    if (!user.isActive) {
      return NextResponse.json({ success: false, error: 'Account disabled' }, { status: 403 })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ success: false, error: 'Invalid credentials' }, { status: 401 })
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json({
      success: true,
      data: { token, user: { id: user.id, email: user.email, name: user.name, role: user.role } }
    })

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      maxAge: 60 * 60 * 24 * 7,
      path: '/'
    }

    response.cookies.set(COOKIE_NAME, token, cookieOptions)

    console.log('✅ Login successful:', {
      email: user.email,
      role: user.role,
      cookieName: COOKIE_NAME,
      cookieSet: true,
      cookieOptions: {
        httpOnly: cookieOptions.httpOnly,
        secure: cookieOptions.secure,
        sameSite: cookieOptions.sameSite,
        path: cookieOptions.path
      }
    })

    return response

  } catch (error: any) {
    console.error('Login error:', error?.message || error)

    // Handle database connection errors specifically
    if (error?.code === 'P1001' || error?.code === 'P1003') {
      return NextResponse.json(
        {
          success: false,
          error: 'Database connection error. Please contact support.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
