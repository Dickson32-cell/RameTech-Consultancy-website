import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

async function checkAdmin(request?: NextRequest) {
    let token: string | null = null

    if (request) {
        const authHeader = request.headers.get('authorization')
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7)
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const admin = await checkAdmin(request)
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const certification = await prisma.certification.findUnique({
            where: { id: params.id }
        })

        if (!certification) {
            return NextResponse.json({ success: false, error: 'Certification not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, data: certification })
    } catch (error) {
        console.error('Error fetching certification:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const admin = await checkAdmin(request)
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { title, issuer, description, icon, imageUrl, order, isActive } = body

        const certification = await prisma.certification.update({
            where: { id: params.id },
            data: {
                title,
                issuer,
                description,
                icon,
                imageUrl,
                order,
                isActive
            }
        })

        return NextResponse.json({ success: true, data: certification })
    } catch (error) {
        console.error('Error updating certification:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const admin = await checkAdmin(request)
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        await prisma.certification.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true, data: null })
    } catch (error) {
        console.error('Error deleting certification:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
