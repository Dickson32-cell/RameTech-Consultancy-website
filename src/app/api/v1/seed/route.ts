import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  return NextResponse.json({ 
    message: 'Use POST to seed. Send {secret: "rametech-seed-2026"}',
    endpoints: {
      seed: 'POST with secret',
      socialLinks: 'GET /api/v1/social-links',
      createSocialLink: 'POST /api/v1/admin/social-links with {platform, url, icon}'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    let data
    try {
      data = JSON.parse(body)
    } catch {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
    }
    
    const { secret, action } = data
    
    // Handle direct social link creation
    if (action === 'createLink' && secret === 'rametech-seed-2026') {
      const { platform, url, icon, order, isActive } = data
      if (!platform || !url || !icon) {
        return NextResponse.json({ success: false, error: 'Platform, URL, and icon are required' }, { status: 400 })
      }
      try {
        const link = await prisma.socialLink.upsert({
          where: { platform },
          update: { url, icon, order: order ?? 0, isActive: isActive ?? true },
          create: { platform, url, icon, order: order ?? 0, isActive: isActive ?? true }
        })
        return NextResponse.json({ success: true, data: link })
      } catch (e: any) {
        return NextResponse.json({ success: false, error: e.message }, { status: 500 })
      }
    }
    
    // Original seed logic
    if (secret !== 'rametech-seed-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fix existing SocialLink table - add missing columns
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP`)
      await prisma.$executeRawUnsafe(`ALTER TABLE "SocialLink" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP`)
    } catch (e) {
      // Ignore if columns exist
    }

    const results = { admin: false, team: [] as string[], services: [] as string[], portfolio: [] as string[], socialLinks: [] as string[] }

    // Seed admin user
    const ADMIN_HASH = '$2b$10$G0I6Tn55ISLRpfs7JpkNM.DBtPTtHM/XUyCwr0UqmaGRPEDll.csq'
    const adminExists = await prisma.portalUser.findUnique({ where: { email: 'admin@rametech.com' } })
    if (!adminExists) {
      await prisma.portalUser.create({
        data: { email: 'admin@rametech.com', passwordHash: ADMIN_HASH, name: 'Admin User', role: 'admin', isActive: true }
      })
      results.admin = true
    }

    // Seed Team Members
    for (const member of TEAM_MEMBERS) {
      const existing = await prisma.teamMember.findUnique({ where: { email: member.email } })
      if (!existing) {
        await prisma.teamMember.create({ data: member })
        results.team.push(member.name)
      }
    }

    // Seed Services
    for (const service of SERVICES) {
      const existing = await prisma.service.findUnique({ where: { slug: service.slug } })
      if (!existing) {
        await prisma.service.create({ data: service })
        results.services.push(service.name)
      }
    }

    // Seed Portfolio
    for (const project of PORTFOLIO_PROJECTS) {
      const existing = await prisma.portfolioProject.findUnique({ where: { slug: project.slug } })
      if (!existing) {
        await prisma.portfolioProject.create({ data: project })
        results.portfolio.push(project.title)
      }
    }

    // Seed Social Links
    for (const link of SOCIAL_LINKS) {
      const existing = await prisma.socialLink.findFirst({ where: { platform: link.platform } })
      if (!existing) {
        await prisma.socialLink.create({ data: link })
        results.socialLinks.push(link.platform)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Seeded: ${results.admin ? '1 admin, ' : ''}${results.team.length} team, ${results.services.length} services, ${results.portfolio.length} portfolio, ${results.socialLinks.length} social links`,
      created: results
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
