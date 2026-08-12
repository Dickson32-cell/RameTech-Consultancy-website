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

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const admin = await checkAdmin()
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        const body = await request.json()
        const { isApproved } = body

        const review = await prisma.review.update({
            where: { id: params.id },
            data: { isApproved }
        })

        return NextResponse.json({ success: true, data: review })
    } catch (error) {
        console.error('Error updating review:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    try {
        const admin = await checkAdmin()
        if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

        await prisma.review.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting review:', error)
        return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
    }
}
