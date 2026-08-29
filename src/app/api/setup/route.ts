// Setup endpoint: DISABLED for security.
// This route previously reset the admin password with a hardcoded value, letting ANYONE
// take over the admin account by visiting /api/setup. It will now refuse to run.
// If you ever need to reset the admin password, do it from the server CLI:
//   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/reset-admin.ts
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json(
    { success: false, error: 'This setup endpoint is disabled for security.' },
    { status: 410 }
  )
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: 'This setup endpoint is disabled for security.' },
    { status: 410 }
  )
}