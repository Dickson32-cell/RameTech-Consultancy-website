// Test login endpoint: DISABLED for security.
// This was a debugging helper that acted as a public password oracle — it revealed
// whether credentials were valid, which users exist, and account states to anyone.
import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { success: false, error: 'This test endpoint is disabled for security.' },
    { status: 410 }
  )
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'This test endpoint is disabled for security.' },
    { status: 410 }
  )
}