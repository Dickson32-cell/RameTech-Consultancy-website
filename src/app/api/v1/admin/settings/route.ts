import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

async function checkAdmin(request?: NextRequest) {
    let token: string | null = null

    if (request) {
        const authHeader = request.headers.get('authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const extracted = authHeader.substring(7)
            if (extracted !== 'null' && extracted !== 'undefined') {
                token = extracted
            }
        }
    }

    if (!token) {
        const cookieStore = cookies()
        token = cookieStore.get('rametech_token')?.value || null
    }

    if (!token) return null
    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') return null
    return payload
}

export async function GET(request: NextRequest) {
    try {
        const admin = await checkAdmin(request)
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
        const admin = await checkAdmin(request)
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { heroTitle, heroSubtitle, statsProjects, statsClients, statsExperience, statsSupport, businessRegistrationUrl, logoUrl, flyer1Url, flyer2Url, flyer3Url, flyer4Url, flyer5Url, quoteBgUrl, statementBgUrl, heroBgUrl} = body

        const settings = await prisma.siteSettings.upsert({
            where: { id: 'default' },
            update: {
                heroTitle,
                heroSubtitle,
                statsProjects,
                statsClients,
                statsExperience,
                statsSupport,
                businessRegistrationUrl,
                logoUrl,
                flyer1Url,
                flyer2Url,
                flyer3Url,
                flyer4Url,
                flyer5Url,
                quoteBgUrl,
                statementBgUrl,
                heroBgUrl
            },
            create: {
                id: 'default',
                heroTitle,
                heroSubtitle,
                statsProjects,
                statsClients,
                statsExperience,
                statsSupport,
                businessRegistrationUrl,
                logoUrl,
                flyer1Url,
                flyer2Url,
                flyer3Url,
                flyer4Url,
                flyer5Url,
                quoteBgUrl,
                statementBgUrl,
                heroBgUrl
            }
        })

        return NextResponse.json({ success: true, data: settings })
    } catch (error) {
        console.error('Error updating settings:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
