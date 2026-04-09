import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-response'

// POST /api/v1/admin/setup-departments - Create all departments, services, and team heads
export async function POST(request: NextRequest) {
  const log: string[] = []

  try {
    log.push('=== STARTING DEPARTMENT SETUP ===\n')

    // Step 1: Create Department Heads
    log.push('Step 1: Creating department heads...')

    const ceo = await prisma.teamMember.upsert({
      where: { email: 'ceo@rametechconsultancy.com' },
      update: {},
      create: {
        name: 'Chief Executive Officer',
        role: 'CEO',
        bio: 'Visionary leader driving innovation in technology solutions. Oversees software development, mobile apps, cloud services, cybersecurity, and AI initiatives.',
        email: 'ceo@rametechconsultancy.com',
        phone: '+233 55 733 2615',
        order: 0,
        isActive: true
      }
    })
    log.push('✓ CEO created')

    const techLead = await prisma.teamMember.upsert({
      where: { email: 'hardware@rametechconsultancy.com' },
      update: {},
      create: {
        name: 'Hardware & IT Specialist',
        role: 'IT Solutions Head',
        bio: 'Expert in hardware infrastructure, network management, and IT support.',
        email: 'hardware@rametechconsultancy.com',
        phone: '+233 55 733 2615',
        order: 1,
        isActive: true
      }
    })
    log.push('✓ Hardware Specialist created')

    const creativeHead = await prisma.teamMember.upsert({
      where: { email: 'creative@rametechconsultancy.com' },
      update: {},
      create: {
        name: 'Creative Director',
        role: 'Head of Design',
        bio: 'Award-winning designer specializing in brand identity and visual communication.',
        email: 'creative@rametechconsultancy.com',
        phone: '+233 55 733 2615',
        order: 2,
        isActive: true
      }
    })
    log.push('✓ Creative Director created')

    const researcher = await prisma.teamMember.upsert({
      where: { email: 'research@rametechconsultancy.com' },
      update: {},
      create: {
        name: 'Lead Researcher',
        role: 'Head of Research & Analytics',
        bio: 'PhD-level researcher specializing in data science, market research, and academic writing.',
        email: 'research@rametechconsultancy.com',
        phone: '+233 55 733 2615',
        order: 3,
        isActive: true
      }
    })
    log.push('✓ Lead Researcher created\n')

    // Step 2: Create Departments
    log.push('Step 2: Creating departments...')

    const techDept = await prisma.department.upsert({
      where: { slug: 'technology-solutions' },
      update: {},
      create: {
        name: 'Technology Solutions',
        slug: 'technology-solutions',
        description: 'Comprehensive software development, mobile apps, cloud infrastructure, cybersecurity, and AI-powered solutions.',
        icon: 'FaLaptopCode',
        order: 0,
        isActive: true
      }
    })
    log.push('✓ Technology Solutions')

    const itDept = await prisma.department.upsert({
      where: { slug: 'it-solutions' },
      update: {},
      create: {
        name: 'IT Solutions',
        slug: 'it-solutions',
        description: 'Expert hardware infrastructure, network management, and IT support.',
        icon: 'FaServer',
        order: 1,
        isActive: true
      }
    })
    log.push('✓ IT Solutions')

    const creativeDept = await prisma.department.upsert({
      where: { slug: 'creative-services' },
      update: {},
      create: {
        name: 'Creative Services',
        slug: 'creative-services',
        description: 'Professional graphic design, brand identity, and paper craft services.',
        icon: 'FaPalette',
        order: 2,
        isActive: true
      }
    })
    log.push('✓ Creative Services')

    const researchDept = await prisma.department.upsert({
      where: { slug: 'data-research-services' },
      update: {},
      create: {
        name: 'Data & Research Services',
        slug: 'data-research-services',
        description: 'Advanced analytics, market research, and academic writing services.',
        icon: 'FaChartLine',
        order: 3,
        isActive: true
      }
    })
    log.push('✓ Data & Research Services\n')

    // Step 3: Create Paper Craft Sub-Department
    log.push('Step 3: Creating Paper Craft sub-department...')

    const paperCraftSubDept = await prisma.subDepartment.upsert({
      where: { slug: 'paper-craft' },
      update: {},
      create: {
        departmentId: creativeDept.id,
        name: 'Paper Craft',
        slug: 'paper-craft',
        description: 'Custom paper bags and craft solutions.',
        order: 0,
        isActive: true
      }
    })
    log.push('✓ Paper Craft sub-department created\n')

    log.push('Step 4: Creating all department services...')

    // Technology Solutions Services (6 services)
    const techServices = [
      { title: 'Software Development', slug: 'software-development', desc: 'Custom web and desktop applications', features: ['Web Apps', 'Desktop Software', 'API Development'] },
      { title: 'Mobile Development', slug: 'mobile-development', desc: 'iOS and Android mobile applications', features: ['iOS Apps', 'Android Apps', 'React Native'] },
      { title: 'Database Solutions', slug: 'database-solutions', desc: 'Database design and optimization', features: ['PostgreSQL', 'MySQL', 'MongoDB'] },
      { title: 'Cloud Services', slug: 'cloud-services', desc: 'AWS and Azure cloud solutions', features: ['Cloud Migration', 'AWS', 'DevOps'] },
      { title: 'Cybersecurity', slug: 'cybersecurity', desc: 'Security audits and protection', features: ['Security Audits', 'Penetration Testing', 'Compliance'] },
      { title: 'AI & Automation', slug: 'ai-automation', desc: 'AI and automation solutions', features: ['Machine Learning', 'Chatbots', 'Process Automation'] }
    ]

    for (const svc of techServices) {
      await prisma.departmentService.upsert({
        where: { slug: svc.slug },
        update: {},
        create: { departmentId: techDept.id, title: svc.title, slug: svc.slug, description: svc.desc, features: svc.features, order: 0, isActive: true }
      })
    }
    log.push(`✓ Technology Solutions: ${techServices.length} services`)

    // IT Solutions Service (1 service)
    await prisma.departmentService.upsert({
      where: { slug: 'hardware-it-support' },
      update: {},
      create: { departmentId: itDept.id, title: 'Hardware & IT Support', slug: 'hardware-it-support', description: 'Complete IT infrastructure support', features: ['Network Setup', 'IT Support'], order: 0, isActive: true }
    })
    log.push('✓ IT Solutions: 1 service')

    // Creative Services (1 main + 4 Paper Craft = 5 services)
    await prisma.departmentService.upsert({
      where: { slug: 'graphic-design' },
      update: {},
      create: { departmentId: creativeDept.id, title: 'Graphic Design', slug: 'graphic-design', description: 'Professional graphic design services', features: ['Logo Design', 'Brand Identity', 'UI/UX'], order: 0, isActive: true }
    })

    const paperServices = [
      { title: 'Custom Paper Bags', slug: 'custom-paper-bags', features: ['Custom Sizes', 'Full Color Printing', 'Bulk Orders'] },
      { title: 'Gift Bags', slug: 'gift-bags', features: ['Wedding Bags', 'Birthday Bags', 'Corporate Gifts'] },
      { title: 'Shopping Bags', slug: 'shopping-bags', features: ['Reinforced Handles', 'Various Sizes', 'Branding'] },
      { title: 'Promotional Bags', slug: 'promotional-bags', features: ['Event Bags', 'Trade Show Bags', 'Marketing'] }
    ]

    for (const svc of paperServices) {
      await prisma.departmentService.upsert({
        where: { slug: svc.slug },
        update: {},
        create: { departmentId: creativeDept.id, subDepartmentId: paperCraftSubDept.id, title: svc.title, slug: svc.slug, description: `${svc.title} for all occasions`, features: svc.features, order: 0, isActive: true }
      })
    }
    log.push('✓ Creative Services: 1 main + 4 Paper Craft = 5 services')

    // Data & Research Services (5 services)
    const researchServices = [
      { title: 'Marketing Research', slug: 'marketing-research', features: ['Market Analysis', 'Competitor Research'] },
      { title: 'Digital Marketing', slug: 'digital-marketing', features: ['SEO', 'Social Media', 'PPC'] },
      { title: 'Data Science', slug: 'data-science', features: ['Data Analysis', 'Machine Learning'] },
      { title: 'Advanced Analytics', slug: 'advanced-analytics', features: ['BI Dashboards', 'Data Visualization'] },
      { title: 'Academic Writing', slug: 'academic-writing-service', features: ['Research Proposals', 'Thesis Writing'] }
    ]

    for (const svc of researchServices) {
      await prisma.departmentService.upsert({
        where: { slug: svc.slug },
        update: {},
        create: { departmentId: researchDept.id, title: svc.title, slug: svc.slug, description: `${svc.title} services`, features: svc.features, order: 0, isActive: true }
      })
    }
    log.push(`✓ Data & Research: ${researchServices.length} services\n`)

    log.push('=== SETUP COMPLETE ===')
    log.push('✅ 4 Departments')
    log.push('✅ 1 Sub-Department (Paper Craft)')
    log.push('✅ 4 Department Heads')
    log.push('✅ Services created')
    log.push('\nRefresh your browser to see departments!')

    return NextResponse.json({
      success: true,
      message: 'Departments setup completed successfully!',
      log: log.join('\n'),
      created: {
        departments: 4,
        subDepartments: 1,
        teamHeads: 4
      }
    })

  } catch (error: any) {
    log.push(`\n❌ ERROR: ${error.message}`)
    console.error('Setup error:', error)

    return NextResponse.json({
      success: false,
      error: error.message,
      log: log.join('\n')
    }, { status: 500 })
  }
}
