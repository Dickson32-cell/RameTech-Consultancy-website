// src/app/api/v1/contact/route.ts
// POST /api/v1/contact - Submit contact message with notifications
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServer = createClient(supabaseUrl, supabaseKey)

// Email via Resend
async function sendEmailNotification(name: string, email: string, phone: string, service: string, message: string) {
  try {
    const RESEND_API_KEY = process.env.RESEND_API_KEY
    if (!RESEND_API_KEY) {
      console.log('❌ Resend API key not configured')
      return { success: false, error: 'No API key' }
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'RAME Tech <onboarding@resend.dev>',
        to: ['info.rametechconsultancy@gmail.com'], // Resend free tier - only verified email
        subject: `🔔 New Contact: ${name}`,
        html: `
          <h2>🔔 New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Service:</strong> ${service || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      })
    })

    const result = await response.json()
    if (!response.ok) {
      console.log('❌ Email failed:', result)
      return { success: false, error: result }
    }

    console.log('✅ Email sent!')
    return { success: true }
  } catch (error) {
    console.log('❌ Email error:', error)
    return { success: false, error }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, service, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ success: false, error: 'Required fields missing' }, { status: 400 })
    }

    console.log('📝 New contact:', { name, email, phone })

    // Save to Supabase
    const { data, error: supabaseError } = await supabaseServer
      .from('contact_messages')
      .insert([{ name, email, phone, service, message, created_at: new Date().toISOString() }])

    if (supabaseError) throw supabaseError
    console.log('✅ Saved to Supabase')

    // Send email notification
    const emailResult = await sendEmailNotification(name, email, phone || '', service || '', message)
    console.log('📧 Email result:', emailResult)

    // Note: For WhatsApp, you need to set up CallMeBot API key in .env.local
    // Or use OpenClaw's WhatsApp channel manually

    return NextResponse.json({ success: true, data, notifications: { email: emailResult } }, { status: 201 })
  } catch (error: any) {
    console.error('❌ Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 })
  }
}
