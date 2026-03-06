// src/app/api/v1/newsletter/route.ts
// POST /api/v1/newsletter - Subscribe to newsletter
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email) {
      return NextResponse.json(
        errorResponse('Email is required'),
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email }
    })

    if (existing) {
      if (!existing.isActive) {
        // Reactivate subscription
        const updated = await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true, unsubscribedAt: null }
        })
        return NextResponse.json(successResponse(updated))
      }
      return NextResponse.json(
        errorResponse('Email already subscribed'),
        { status: 400 }
      )
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email, name }
    })

    return NextResponse.json(successResponse(subscriber), { status: 201 })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    return NextResponse.json(errorResponse('Failed to subscribe'), { status: 500 })
  }
}

// DELETE /api/v1/newsletter - Unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        errorResponse('Email is required'),
        { status: 400 }
      )
    }

    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false, unsubscribedAt: new Date() }
    })

    return NextResponse.json(successResponse({ message: 'Unsubscribed successfully' }))
  } catch (error) {
    console.error('Error unsubscribing from newsletter:', error)
    return NextResponse.json(errorResponse('Failed to unsubscribe'), { status: 500 })
  }
}
