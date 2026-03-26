import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    if (secret !== 'rametech-seed-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results: string[] = []
    let tableRecreated = false

    // Step 1: Try to add missing columns first (non-destructive)
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP`)
      await prisma.$executeRawUnsafe(`ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP`)
      results.push('Added missing columns successfully')
    } catch (e: any) {
      // Columns might already exist or table doesn't exist - try recreating
      try {
        await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS "SocialLink" CASCADE`)
        results.push('Dropped broken SocialLink table')
      } catch (dropError) {
        results.push('Drop error: ' + (dropError as Error).message.substring(0, 80))
      }
      
      // Create new table
      try {
        await prisma.$executeRawUnsafe(`
          CREATE TABLE "SocialLink" (
            id TEXT PRIMARY KEY DEFAULT 'sl_' || gen_random_uuid(),
            platform TEXT NOT NULL UNIQUE,
            url TEXT NOT NULL,
            icon TEXT NOT NULL,
            "order" INTEGER NOT NULL DEFAULT 0,
            "isActive" BOOLEAN NOT NULL DEFAULT true,
            "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
            "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
          )
        `)
        results.push('Created new SocialLink table')
        tableRecreated = true
      } catch (createError) {
        results.push('Create error: ' + (createError as Error).message.substring(0, 80))
      }
    }

    // Step 2: Insert social links (only if table was successfully created/fixed)
    const SOCIAL_LINKS = [
      { platform: 'instagram', url: 'https://www.instagram.com/rametech_consultancy', icon: 'FaInstagram', order: 1, isActive: true },
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/rametech-consultancy', icon: 'FaLinkedin', order: 2, isActive: true },
    ]
    
    for (const link of SOCIAL_LINKS) {
      try {
        const existing = await prisma.socialLink.findUnique({ where: { platform: link.platform } })
        if (!existing) {
          await prisma.socialLink.create({ data: link })
          results.push('Created: ' + link.platform)
        } else {
          results.push('Already exists: ' + link.platform)
        }
      } catch (e: any) {
        results.push('Error with ' + link.platform + ': ' + e.message.substring(0, 80))
      }
    }

    // Step 3: Verify
    try {
      const links = await prisma.socialLink.findMany()
      results.push('Total links in DB: ' + links.length)
    } catch (e) {
      results.push('Verification failed - table may not exist yet')
    }

    return NextResponse.json({ success: true, results, tableRecreated })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
