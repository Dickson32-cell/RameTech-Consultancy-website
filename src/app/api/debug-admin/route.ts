// Debug endpoint: DISABLED for security.
// This route previously leaked the user list, roles, and password-hash previews to anyone.
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'This debug endpoint is disabled for security.' },
    { status: 410 }
  )
}