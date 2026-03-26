// GET /api/v1/social - Get all active social media links
import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse } from '@/lib/api-response'

export async function GET() {
  try {
    const socials = await prisma.socialMedia.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    // Fallback placeholder data if table is empty or doesn't exist yet
    if (!socials || socials.length === 0) {
      return NextResponse.json(successResponse([
        {
          id: '1',
          name: 'LinkedIn',
          url: 'https://linkedin.com/company/rametech',
          icon: 'FaLinkedin'
        }
      ]))
    }
    
    return NextResponse.json(successResponse(socials))
  } catch (error) {
    // If table doesn't exist yet, return placeholder
    return NextResponse.json(successResponse([
      {
        id: '1',
        name: 'LinkedIn',
        url: 'https://linkedin.com/company/rametech',
        icon: 'FaLinkedin'
      }
    ]))
  }
}
