// src/app/api/v1/admin/subscribers/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

async function checkAdmin() {
  const cookieStore = cookies()
  const token = cookieStore.get('rametech_token')?.value
  if (!token) return null
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return null
  return payload
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await checkAdmin()
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    
    const body = await request.json()
    const { isActive } = body
    
    const subscriber = await prisma.newsletterSubscriber.update({
      where: { id: params.id },
      data: {
        isActive: isActive !== false,
        unsubscribedAt: isActive === false ? new Date() : null
      }
    })
    
    return NextResponse.json({ success: true, data: subscriber })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
