// src/app/api/v1/chatbot/lead/route.ts
// POST /api/v1/chatbot/lead - Store chatbot lead
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, projectDescription } = body

    if (!name || !email) {
      return NextResponse.json(
        errorResponse('Name and email are required'),
        { status: 400 }
      )
    }

    const lead = await prisma.chatbotLead.create({
      data: {
        name,
        email,
        phone,
        projectDescription,
        source: 'chatbot'
      }
    })

    return NextResponse.json(successResponse(lead), { status: 201 })
  } catch (error) {
    console.error('Error creating chatbot lead:', error)
    return NextResponse.json(errorResponse('Failed to save lead'), { status: 500 })
  }
}

// GET /api/v1/chatbot/lead - Get all leads (admin only)
export async function GET() {
  try {
    const leads = await prisma.chatbotLead.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(successResponse(leads))
  } catch (error) {
    console.error('Error fetching chatbot leads:', error)
    return NextResponse.json(errorResponse('Failed to fetch leads'), { status: 500 })
  }
}
