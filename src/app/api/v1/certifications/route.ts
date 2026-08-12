import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const certifications = await prisma.certification.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        })
        return NextResponse.json({ success: true, data: certifications })
    } catch (error) {
        console.error('Error fetching certifications:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
