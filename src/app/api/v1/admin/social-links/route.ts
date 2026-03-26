import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({ orderBy: { order: 'asc' } })
    return NextResponse.json({ success: true, data: links })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch social links' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { platform, url, icon, order, isActive } = await request.json()
    if (!platform || !url || !icon) {
      return NextResponse.json({ success: false, error: 'Platform, URL, and icon are required' }, { status: 400 })
    }
    const link = await prisma.socialLink.create({
      data: { platform, url, icon, order: order ?? 0, isActive: isActive ?? true }
    })
    return NextResponse.json({ success: true, data: link }, { status: 201 })
  } catch (error) {
    console.error('Error creating social link:', error)
    return NextResponse.json({ success: false, error: 'Failed to create social link' }, { status: 500 })
  }
}
