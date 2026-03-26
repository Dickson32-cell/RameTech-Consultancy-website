import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    if (secret !== 'rametech-seed-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = { socialLinks: [] as string[] }

    const SOCIAL_LINKS = [
      { platform: 'instagram', url: 'https://www.instagram.com/rametech_consultancy', icon: 'FaInstagram', order: 1, isActive: true },
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/rametech-consultancy', icon: 'FaLinkedin', order: 2, isActive: true },
    ]
    
    for (const link of SOCIAL_LINKS) {
      try {
        const existing = await prisma.socialLink.findUnique({ where: { platform: link.platform } })
        if (!existing) {
          await prisma.socialLink.create({ data: link })
          results.socialLinks.push(link.platform + ' (created)')
        } else {
          await prisma.socialLink.update({ where: { id: existing.id }, data: link })
          results.socialLinks.push(link.platform + ' (updated)')
        }
      } catch (e: any) {
        results.socialLinks.push(link.platform + ' (error: ' + e.message + ')')
      }
    }

    return NextResponse.json({ success: true, results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
