// Seed team members, services, portfolio, and admin user
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

const TEAM_MEMBERS = [
  { name: 'Abdul Rashid Dickson', role: 'CEO', bio: 'Leading RAME Tech with vision and expertise.', email: 'dickson@rametech.com', photoUrl: '/images/team/abdul-rashid-dickson.jpg', order: 1, isActive: true },
  { name: 'Harriet Emefa Asonkey', role: 'Administrator', bio: 'Keeping operations smooth and efficient.', email: 'harriet@rametech.com', photoUrl: '/images/team/harriet-emefa-asonkey.jpg', order: 2, isActive: true },
  { name: 'Dickson Abdul-Wahab', role: 'Researcher', bio: 'Driving innovation through research.', email: 'wahab@rametech.com', photoUrl: '/images/team/dickson-abdul-wahab.jpg', order: 3, isActive: true },
  { name: 'Anyetei Sowah Joseph', role: 'Graphic Designer', bio: 'Creative designer bringing brands to life.', email: 'joseph@rametech.com', photoUrl: '/images/team/anyetei-sowah-joseph.jpg', order: 4, isActive: true },
  { name: 'David Tetteh', role: 'Hardware Technician', bio: 'Expert in hardware and IT infrastructure.', email: 'david@rametech.com', photoUrl: '/images/team/david-tetteh.jpg', order: 5, isActive: true },
]

const SERVICES = [
  { name: 'Software Development', slug: 'software-development', description: 'Custom web applications, mobile apps, and enterprise software.', icon: 'FaCode', features: ['Web Apps', 'Mobile Apps', 'API Development'], order: 1, isActive: true },
  { name: 'Hardware & IT', slug: 'hardware-it', description: 'Complete IT infrastructure solutions.', icon: 'FaLaptopCode', features: ['Network Setup', 'Server Management', 'IT Support'], order: 2, isActive: true },
  { name: 'Graphic Design', slug: 'graphic-design', description: 'Professional design services.', icon: 'FaPalette', features: ['Logo Design', 'Marketing Materials', 'Social Media Graphics'], order: 3, isActive: true },
]

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    if (secret !== 'rametech-seed-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const results = { admin: false, team: [] as string[], services: [] as string[], socialLinks: [] as string[] }

    // Seed admin user
    const ADMIN_HASH = '$2b$10$G0I6Tn55ISLRpfs7JpkNM.DBtPTtHM/XUyCwr0UqmaGRPEDll.csq'
    const adminExists = await prisma.portalUser.findUnique({ where: { email: 'admin@rametech.com' } })
    if (!adminExists) {
      await prisma.portalUser.create({ data: { email: 'admin@rametech.com', passwordHash: ADMIN_HASH, name: 'Admin User', role: 'admin', isActive: true } })
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

    // Seed Social Links
    const SOCIAL_LINKS = [
      { platform: 'instagram', url: 'https://www.instagram.com/rametech_consultancy', icon: 'FaInstagram', order: 1, isActive: true },
      { platform: 'linkedin', url: 'https://www.linkedin.com/company/rametech-consultancy', icon: 'FaLinkedin', order: 2, isActive: true },
    ]
    for (const link of SOCIAL_LINKS) {
      const existing = await prisma.socialLink.findUnique({ where: { platform: link.platform } })
      if (!existing) {
        await prisma.socialLink.create({ data: link })
        results.socialLinks.push(link.platform)
      }
    }

    return NextResponse.json({ success: true, message: `Seeded: admin=${results.admin}, team=${results.team.length}, services=${results.services.length}, socials=${results.socialLinks.length}`, created: results })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
