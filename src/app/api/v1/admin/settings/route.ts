import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
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

export async function GET() {
    try {
        const admin = await checkAdmin()
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

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
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {
    try {
        const admin = await checkAdmin()
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { heroTitle, heroSubtitle, statsProjects, statsClients, statsExperience, statsSupport, businessRegistrationUrl } = body

        const settings = await prisma.siteSettings.upsert({
            where: { id: 'default' },
            update: {
                heroTitle,
                heroSubtitle,
                statsProjects,
                statsClients,
                statsExperience,
                statsSupport,
                businessRegistrationUrl
            },
            create: {
                id: 'default',
                heroTitle,
                heroSubtitle,
                statsProjects,
                statsClients,
                statsExperience,
                statsSupport,
                businessRegistrationUrl
            }
        })

        return NextResponse.json({ success: true, data: settings })
    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
