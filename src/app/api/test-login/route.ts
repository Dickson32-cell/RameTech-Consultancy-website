// Test login endpoint - shows exactly where login fails
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const steps: any[] = []

    steps.push({ step: 1, message: 'Received login request', email, passwordLength: password?.length })

    // Find user
    const user = await prisma.portalUser.findUnique({ where: { email } })

    if (!user) {
      steps.push({ step: 2, message: 'User NOT found', email })
      return NextResponse.json({ success: false, failedAt: 'User not found', steps })
    }

    steps.push({ step: 2, message: 'User found', email: user.email, name: user.name })

    // Check role
    if (user.role !== 'admin') {
      steps.push({ step: 3, message: 'User is not admin', role: user.role })
      return NextResponse.json({ success: false, failedAt: 'Not admin role', steps })
    }

    steps.push({ step: 3, message: 'User is admin', role: user.role })

    // Check active
    if (!user.isActive) {
      steps.push({ step: 4, message: 'User is not active', isActive: user.isActive })
      return NextResponse.json({ success: false, failedAt: 'Account disabled', steps })
    }

    steps.push({ step: 4, message: 'User is active', isActive: user.isActive })

    // Test password
    steps.push({
      step: 5,
      message: 'Testing password',
      passwordHashPreview: user.passwordHash.substring(0, 30) + '...',
      passwordProvided: password
    })

    const isValid = await bcrypt.compare(password, user.passwordHash)

    if (!isValid) {
      steps.push({ step: 6, message: 'Password does NOT match', isValid: false })

      // Test other common passwords
      const testResults: any = {}
      for (const testPwd of ['Admin@123', 'admin123', 'Admin123', 'admin@123']) {
        testResults[testPwd] = await bcrypt.compare(testPwd, user.passwordHash)
      }

      steps.push({ step: 7, message: 'Tested common passwords', results: testResults })

      return NextResponse.json({
        success: false,
        failedAt: 'Password mismatch',
        correctPassword: Object.keys(testResults).find(k => testResults[k]),
        steps
      })
    }

    steps.push({ step: 6, message: 'Password matches!', isValid: true })

    return NextResponse.json({
      success: true,
      message: 'Login would succeed',
      user: { email: user.email, name: user.name, role: user.role },
      steps
    })

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}
