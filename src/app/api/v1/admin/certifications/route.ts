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

        const certifications = await prisma.certification.findMany({
            orderBy: { order: 'asc' }
        })
        return NextResponse.json({ success: true, data: certifications })
    } catch (error) {
        console.error('Error fetching certifications:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const admin = await checkAdmin(request)
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { title, issuer, description, icon, imageUrl, order, isActive } = body

        if (!title || !issuer || !description) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
        }

        const certification = await prisma.certification.create({
            data: {
                title,
                issuer,
                description,
                icon: icon || null,
                imageUrl: imageUrl || null,
                order: order || 0,
                isActive: isActive !== undefined ? isActive : true
            }
        })

        return NextResponse.json({ success: true, data: certification }, { status: 201 })
    } catch (error) {
        console.error('Error creating certification:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
