import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const reviews = await prisma.review.findMany({
            where: { isApproved: true },
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json({ success: true, data: reviews })
    } catch (error) {
        console.error('Error fetching reviews:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch reviews' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const { clientName, clientCompany, content, rating } = body

        if (!clientName || !content) {
            return NextResponse.json({ success: false, error: 'Name and content are required' }, { status: 400 })
        }

        const review = await prisma.review.create({
            data: {
                clientName,
                clientCompany,
                content,
                rating: rating || 5,
                isApproved: false // Requires admin approval
            }
        })

        return NextResponse.json({ success: true, data: review }, { status: 201 })
    } catch (error) {
        console.error('Error creating review:', error)
        return NextResponse.json({ success: false, error: 'Failed to submit review' }, { status: 500 })
    }
}
