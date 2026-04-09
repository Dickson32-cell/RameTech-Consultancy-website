// prisma/seed-departments.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding departments...')

  // 1. Software Development Department
  const softwareDept = await prisma.department.upsert({
    where: { slug: 'software-development' },
    update: {},
    create: {
      name: 'Software Development',
      slug: 'software-development',
      description: 'Comprehensive software development services including web, mobile, and custom applications',
      order: 1,
      isActive: true
    }
  })

  // Sub-departments for Software
  const webDev = await prisma.subDepartment.upsert({
    where: { slug: 'web-applications' },
    update: {},
    create: {
      departmentId: softwareDept.id,
      name: 'Web Applications',
      slug: 'web-applications',
      description: 'Custom web application development using modern technologies',
      order: 1,
      isActive: true
    }
  })

  const mobileDev = await prisma.subDepartment.upsert({
    where: { slug: 'mobile-applications' },
    update: {},
    create: {
      departmentId: softwareDept.id,
      name: 'Mobile Applications',
      slug: 'mobile-applications',
      description: 'Native and cross-platform mobile app development',
      order: 2,
      isActive: true
    }
  })

  // 2. Graphic Design Department
  const graphicDept = await prisma.department.upsert({
    where: { slug: 'graphic-design' },
    update: {},
    create: {
      name: 'Graphic Design',
      slug: 'graphic-design',
      description: 'Professional graphic design services for branding, marketing, and visual communications',
      order: 2,
      isActive: true
    }
  })

  // 3. Advanced Analytics & Marketing Research Department
  const analyticsDept = await prisma.department.upsert({
    where: { slug: 'analytics-marketing-research' },
    update: {},
    create: {
      name: 'Advanced Analytics & Marketing Research',
      slug: 'analytics-marketing-research',
      description: 'Data analytics, market research, and academic writing services',
      order: 3,
      isActive: true
    }
  })

  // Academic Writing Sub-department
  const academicWriting = await prisma.subDepartment.upsert({
    where: { slug: 'academic-writing' },
    update: {},
    create: {
      departmentId: analyticsDept.id,
      name: 'Academic Writing',
      slug: 'academic-writing',
      description: 'Professional academic research and thesis writing services',
      order: 1,
      isActive: true
    }
  })

  // Academic Writing Pricing Table
  await prisma.pricingTable.create({
    data: {
      departmentId: analyticsDept.id,
      name: 'Academic Writing Pricing',
      description: 'Comprehensive pricing for academic writing services across all levels',
      tableType: 'academic',
      isActive: true,
      data: {
        phases: [
          {
            name: 'Phase 1: Project Inception & Scoping',
            items: [
              {
                serviceItem: 'Topic Discovery & Gap Analysis',
                description: 'Lit review to propose 3 viable topics with clear research gaps.',
                bachelor: 200,
                master: 500,
                phd: 1500
              },
              {
                serviceItem: 'Research Proposal / Concept Note',
                description: 'Developing the blueprint, objectives, and timeline for supervisor approval.',
                bachelor: 400,
                master: 1000,
                phd: 3000
              }
            ]
          },
          {
            name: 'Phase 2: The Foundation',
            items: [
              {
                serviceItem: 'Introduction & Background',
                description: 'Setting the context, problem statement, and significance.',
                bachelor: 300,
                master: 1000,
                phd: 1500
              },
              {
                serviceItem: 'Comprehensive Literature Review',
                description: 'Extensive sourcing, critical analysis, and theoretical framework building.',
                bachelor: 800,
                master: 2500,
                phd: 5000
              }
            ]
          },
          {
            name: 'Phase 3: The Blueprint (Methodology & Design)',
            items: [
              {
                serviceItem: 'Research Design & Methodology',
                description: 'Defining the approach, population, sample size, and analytical framework.',
                bachelor: 400,
                master: 1500,
                phd: 3000
              },
              {
                serviceItem: 'Instrument/Protocol Design',
                description: 'Developing questionnaires, interview guides, or lab experimental protocols.',
                bachelor: 200,
                master: 500,
                phd: 1500
              },
              {
                serviceItem: 'Engineering: Architecture & Simulation Setup',
                description: 'Specialized: CAD modelling, defining system architecture, or setting up software simulation parameters (e.g., MATLAB, ANSYS).',
                bachelor: 800,
                master: 3500,
                phd: 5000
              }
            ]
          },
          {
            name: 'Phase 4: Execution & Synthesis',
            items: [
              {
                serviceItem: 'Data Analysis & Visualization',
                description: 'Cleaning data, running stats (SPSS, R, Python, GIS) and generating charts.',
                bachelor: 1000,
                master: 3000,
                phd: 6000
              },
              {
                serviceItem: 'Engineering: Software / Prototype Dev',
                description: 'Specialized: Coding a functional software prototype, training an ML model, or building a hardware schematic.',
                bachelor: 1500,
                master: 4000,
                phd: 10000
              },
              {
                serviceItem: 'Results & Discussion',
                description: 'Translating the analysis into academic writing and linking back to the Lit Review.',
                bachelor: 800,
                master: 2500,
                phd: 5000
              }
            ]
          },
          {
            name: 'Phase 5: Quality Assurance, Polish & Defence',
            items: [
              {
                serviceItem: 'Thesis Compilation & Formatting',
                description: 'Automated TOC, lists of figures, margin/font compliance to university rubrics.',
                bachelor: 300,
                master: 800,
                phd: 2000
              },
              {
                serviceItem: 'Proofreading, Editing & Plagiarism Mgt',
                description: 'Deep structural editing, citation Alignment (APA, Harvard, IEEE), and Turnitin reduction.',
                bachelor: 400,
                master: 2000,
                phd: 5000
              },
              {
                serviceItem: 'Defence Preparation',
                description: 'Creating the presentation slide deck (PPT) and compiling a document of anticipated examiner questions.',
                bachelor: 200,
                master: 1000,
                phd: 1500
              }
            ]
          }
        ]
      }
    }
  })

  // 4. Sales Department (Computers & IT Equipment)
  const salesDept = await prisma.department.upsert({
    where: { slug: 'sales-computers-it' },
    update: {},
    create: {
      name: 'Sales (Computers & IT Equipment)',
      slug: 'sales-computers-it',
      description: 'Quality computers, laptops, accessories, and IT equipment',
      order: 4,
      isActive: true
    }
  })

  // Sample Sales Services
  await prisma.departmentService.create({
    data: {
      departmentId: salesDept.id,
      title: 'Laptops',
      slug: 'laptops',
      description: 'High-performance laptops for business and personal use',
      price: 'GHS 2,000 - GHS 10,000',
      features: ['Various brands', 'Warranty included', 'Technical support'],
      order: 1,
      isActive: true
    }
  })

  await prisma.departmentService.create({
    data: {
      departmentId: salesDept.id,
      title: 'Desktop Computers',
      slug: 'desktop-computers',
      description: 'Custom-built and branded desktop computers',
      price: 'GHS 1,500 - GHS 8,000',
      features: ['Customizable specs', '1-year warranty', 'Free delivery'],
      order: 2,
      isActive: true
    }
  })

  // 5. Craft Department (Paper Bags)
  const craftDept = await prisma.department.upsert({
    where: { slug: 'craft-paper-bags' },
    update: {},
    create: {
      name: 'Craft (Paper Bags)',
      slug: 'craft-paper-bags',
      description: 'Custom-made paper bags for businesses and events',
      order: 5,
      isActive: true
    }
  })

  // Sample Craft Services
  await prisma.departmentService.create({
    data: {
      departmentId: craftDept.id,
      title: 'Custom Branded Paper Bags',
      slug: 'custom-branded-paper-bags',
      description: 'High-quality paper bags with your brand logo and design',
      price: 'GHS 2 - GHS 10 per bag',
      features: ['Custom printing', 'Various sizes', 'Bulk discounts', 'Eco-friendly materials'],
      order: 1,
      isActive: true
    }
  })

  await prisma.departmentService.create({
    data: {
      departmentId: craftDept.id,
      title: 'Plain Paper Bags',
      slug: 'plain-paper-bags',
      description: 'Quality plain paper bags for retail and packaging',
      price: 'GHS 1 - GHS 5 per bag',
      features: ['Various colors', 'Different sizes', 'Bulk orders available'],
      order: 2,
      isActive: true
    }
  })

  console.log('✅ Departments seeded successfully!')
}

main()
  .catch((e) => {
    console.error('Error seeding departments:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
