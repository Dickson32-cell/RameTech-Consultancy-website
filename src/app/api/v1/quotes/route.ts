// src/app/api/v1/quotes/route.ts
// POST /api/v1/quotes - Submit quote request
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, company, service, budget, description } = body

    // Validation
    if (!name || !email || !service || !description) {
      return NextResponse.json(
        errorResponse('Name, email, service, and description are required'),
        { status: 400 }
      )
    }

    const quote = await prisma.quoteRequest.create({
      data: {
        name,
        email,
        phone,
        company,
        service,
        budget,
        description,
        source: 'website'
      }
    })

    return NextResponse.json(successResponse(quote), { status: 201 })
  } catch (error) {
    console.error('Error creating quote request:', error)
    return NextResponse.json(errorResponse('Failed to submit quote request'), { status: 500 })
  }
}

// GET /api/v1/quotes - Get all quote requests (admin only)
export async function GET() {
  try {
    const quotes = await prisma.quoteRequest.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(successResponse(quotes))
  } catch (error) {
    console.error('Error fetching quote requests:', error)
    return NextResponse.json(errorResponse('Failed to fetch quotes'), { status: 500 })
  }
}
