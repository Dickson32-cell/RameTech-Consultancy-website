import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { platform, url, icon, order, isActive } = await request.json()
    const link = await prisma.socialLink.update({
      where: { id: params.id },
      data: { platform, url, icon, order, isActive }
    })
    return NextResponse.json({ success: true, data: link })
  } catch (error) {
    console.error('Error updating social link:', error)
    return NextResponse.json({ success: false, error: 'Failed to update social link' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.socialLink.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting social link:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete social link' }, { status: 500 })
  }
}
