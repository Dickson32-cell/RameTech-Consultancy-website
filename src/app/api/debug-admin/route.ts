// Debug endpoint to check admin user
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    // Get all portal users
    const allUsers = await prisma.portalUser.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isActive: true,
        passwordHash: true
      }
    })

    // Test password for admin@rametech.com
    const adminUser = allUsers.find(u => u.email === 'admin@rametech.com')

    let passwordTests: any = {}

    if (adminUser) {
      // Test multiple possible passwords
      const testPasswords = ['Admin@123', 'admin123', 'admin', 'Admin123']

      for (const pwd of testPasswords) {
        const isValid = await bcrypt.compare(pwd, adminUser.passwordHash)
        passwordTests[pwd] = isValid
      }
    }

    return NextResponse.json({
      totalUsers: allUsers.length,
      users: allUsers.map(u => ({
        email: u.email,
        name: u.name,
        role: u.role,
        isActive: u.isActive,
        passwordHashPreview: u.passwordHash.substring(0, 20) + '...'
      })),
      adminExists: !!adminUser,
      passwordTests: adminUser ? passwordTests : 'No admin user found',
      correctPassword: adminUser ? Object.keys(passwordTests).find(k => passwordTests[k]) : null
    })

  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        code: error.code
      },
      { status: 500 }
    )
  }
}
