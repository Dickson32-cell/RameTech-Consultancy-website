import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  try {
    const links = await prisma.socialLink.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    return NextResponse.json({ success: true, data: links })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch social links' }, { status: 500 })
  }
}
