// Setup endpoint to create/update admin user
// Visit this URL once to ensure admin user exists
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function GET() {
  try {
    console.log('Setup: Starting admin user creation...')

    // Check if admin exists
    const existingAdmin = await prisma.portalUser.findUnique({
      where: { email: 'admin@rametech.com' }
    })

    const password = 'Admin@123'
    const passwordHash = await bcrypt.hash(password, 12)

    if (existingAdmin) {
      // Update existing admin with new password
      const updated = await prisma.portalUser.update({
        where: { email: 'admin@rametech.com' },
        data: {
          passwordHash,
          name: 'RAME Tech Admin',
          role: 'admin',
          isActive: true
        }
      })

      console.log('Setup: Admin user updated:', updated.email)

      // Verify password works
      const isValid = await bcrypt.compare(password, updated.passwordHash)

      return NextResponse.json({
        success: true,
        message: 'Admin user updated successfully',
        data: {
          email: updated.email,
          name: updated.name,
          role: updated.role,
          passwordVerified: isValid
        }
      })
    } else {
      // Create new admin
      const created = await prisma.portalUser.create({
        data: {
          email: 'admin@rametech.com',
          passwordHash,
          name: 'RAME Tech Admin',
          role: 'admin',
          isActive: true
        }
      })

      console.log('Setup: Admin user created:', created.email)

      // Verify password works
      const isValid = await bcrypt.compare(password, created.passwordHash)

      return NextResponse.json({
        success: true,
        message: 'Admin user created successfully',
        data: {
          email: created.email,
          name: created.name,
          role: created.role,
          passwordVerified: isValid
        }
      })
    }

  } catch (error: any) {
    console.error('Setup error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to setup admin user',
        details: error.message
      },
      { status: 500 }
    )
  }
}
