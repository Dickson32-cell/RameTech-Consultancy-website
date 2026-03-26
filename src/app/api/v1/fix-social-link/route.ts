import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    if (secret !== 'rametech-seed-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fix: Add missing timestamp columns to SocialLink table
    const fixes: string[] = []
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP`)
      fixes.push('added createdAt')
    } catch (e) {
      fixes.push('createdAt already exists or error: ' + (e as Error).message)
    }
    
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP`)
      fixes.push('added updatedAt')
    } catch (e) {
      fixes.push('updatedAt already exists or error: ' + (e as Error).message)
    }

    // Now try to seed social links
    const SOCIAL_LINKS = [
      { platform: 'instagram', url: 'https://www.instagram.com/rametech_consultancy', icon: 'FaInstagram', order: 1, isActive: true },
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/rametech-consultancy', icon: 'FaLinkedin', order: 2, isActive: true },
    ]

    const created: string[] = []
    for (const link of SOCIAL_LINKS) {
      try {
        const existing = await prisma.socialLink.findFirst({ where: { platform: link.platform } })
        if (!existing) {
          await prisma.socialLink.create({ data: link })
          created.push(link.platform)
        } else {
          // Update existing
          await prisma.socialLink.update({
            where: { id: existing.id },
            data: { url: link.url, icon: link.icon, order: link.order, isActive: link.isActive }
          })
          created.push(link.platform + ' (updated)')
        }
      } catch (e) {
        console.error('Error with social link:', link.platform, e)
      }
    }

    return NextResponse.json({
      success: true,
      fixResults: fixes,
      socialLinks: created,
      message: 'Done! Check /api/v1/social-links to verify.'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
