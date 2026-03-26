// src/app/api/v1/contact/route.ts
// POST /api/v1/contact - Submit contact message
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 })
    }

    console.log('📝 New contact:', { name, email, phone })

    // Save to database using Prisma
    const data = await prisma.contactMessage.create({
      data: { 
        name, 
        email, 
        phone, 
        service, 
        message,
        createdAt: new Date()
      }
    })

    console.log('✅ Saved to database:', data.id)

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error:', error)
    
    // If table doesn't exist, try to create it
    if (error.code === 'P2021' || error.message?.includes('table')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Database table not found. Please run the init/seed endpoint.' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 })
  }
}
