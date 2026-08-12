import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        let settings = await prisma.siteSettings.findUnique({
            where: { id: 'default' }
        })

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: { id: 'default' }
            })
        }

        return NextResponse.json({ success: true, data: settings })
    } catch (error) {
        console.error('Error fetching settings:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
    }
}
