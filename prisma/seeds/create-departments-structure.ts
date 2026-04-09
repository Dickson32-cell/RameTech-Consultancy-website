import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function createDepartmentsStructure() {
  console.log('Creating departments structure with heads...\n')

  try {
    // Step 1: Create Department Heads (Team Members)
    console.log('Step 1: Creating department heads...')

    // CEO - Head of Technology Solutions
    const ceo = await prisma.teamMember.upsert({
      where: { email: 'ceo@rametechconsultancy.com' },
      update: {},
      create: {
        name: 'Chief Executive Officer',
        role: 'CEO',
        bio: 'Visionary leader driving innovation in technology solutions. Oversees software development, mobile apps, cloud services, cybersecurity, and AI initiatives.',
        email: 'ceo@rametechconsultancy.com',
        phone: '+233 55 733 2615',
        photoUrl: null, // Admin can upload later
        order: 0,
        isActive: true
      }
    })
    console.log('✓ CEO created')

    // Hardware Technician - Head of IT Solutions
    const techLead = await prisma.teamMember.upsert({
      where: { email: 'hardware@rametechconsultancy.com' },
      update: {},
      create: {
        name: 'Hardware & IT Specialist',
        role: 'IT Solutions Head',
        bio: 'Expert in hardware infrastructure, network management, and IT support. Leads all hardware and technical infrastructure projects.',
        email: 'hardware@rametechconsultancy.com',
        phone: '+233 55 733 2615',
        photoUrl: null,
        order: 1,
        isActive: true
      }
    })
    console.log('✓ Hardware Technician created')

    // Creative Director - Head of Creative Services
    const creativeHead = await prisma.teamMember.upsert({
      where: { email: 'creative@rametechconsultancy.com' },
      update: {},
      create: {
        name: 'Creative Director',
        role: 'Head of Design',
        bio: 'Award-winning designer specializing in brand identity, UI/UX design, and visual communication. Transforms brands through creative excellence.',
        email: 'creative@rametechconsultancy.com',
        phone: '+233 55 733 2615',
        photoUrl: null,
        order: 2,
        isActive: true
      }
    })
    console.log('✓ Creative Director created')

    // Researcher - Head of Data & Research Services
    const researcher = await prisma.teamMember.upsert({
      where: { email: 'research@rametechconsultancy.com' },
      update: {},
      create: {
        name: 'Lead Researcher',
        role: 'Head of Research & Analytics',
        bio: 'PhD-level researcher specializing in data science, market research, and academic writing. Leads all research, analytics, and data-driven initiatives.',
        email: 'research@rametechconsultancy.com',
        phone: '+233 55 733 2615',
        photoUrl: null,
        order: 3,
        isActive: true
      }
    })
    console.log('✓ Lead Researcher created\n')

    // Step 2: Create Departments
    console.log('Step 2: Creating departments...')

    // Department 1: Technology Solutions
    const techDept = await prisma.department.upsert({
      where: { slug: 'technology-solutions' },
      update: {
        name: 'Technology Solutions',
        description: 'Comprehensive software development, mobile apps, cloud infrastructure, cybersecurity, and AI-powered solutions for modern businesses.',
        icon: 'FaLaptopCode',
        order: 0,
        isActive: true
      },
      create: {
        name: 'Technology Solutions',
        slug: 'technology-solutions',
        description: 'Comprehensive software development, mobile apps, cloud infrastructure, cybersecurity, and AI-powered solutions for modern businesses.',
        icon: 'FaLaptopCode',
        order: 0,
        isActive: true
      }
    })
    console.log('✓ Technology Solutions department created')

    // Department 2: IT Solutions
    const itDept = await prisma.department.upsert({
      where: { slug: 'it-solutions' },
      update: {
        name: 'IT Solutions',
        description: 'Expert hardware infrastructure, network management, IT support, and technical solutions for seamless business operations.',
        icon: 'FaServer',
        order: 1,
        isActive: true
      },
      create: {
        name: 'IT Solutions',
        slug: 'it-solutions',
        description: 'Expert hardware infrastructure, network management, IT support, and technical solutions for seamless business operations.',
        icon: 'FaServer',
        order: 1,
        isActive: true
      }
    })
    console.log('✓ IT Solutions department created')

    // Department 3: Creative Services
    const creativeDept = await prisma.department.upsert({
      where: { slug: 'creative-services' },
      update: {
        name: 'Creative Services',
        description: 'Professional graphic design, brand identity, UI/UX design, and visual communication services that make your brand stand out.',
        icon: 'FaPalette',
        order: 2,
        isActive: true
      },
      create: {
        name: 'Creative Services',
        slug: 'creative-services',
        description: 'Professional graphic design, brand identity, UI/UX design, and visual communication services that make your brand stand out.',
        icon: 'FaPalette',
        order: 2,
        isActive: true
      }
    })
    console.log('✓ Creative Services department created')

    // Create Paper Craft Sub-Department
    console.log('Creating Paper Craft sub-department...')
    const paperCraftSubDept = await prisma.subDepartment.upsert({
      where: { slug: 'paper-craft' },
      update: {
        name: 'Paper Craft',
        description: 'Custom paper bags, gift bags, shopping bags, and paper craft solutions for businesses and events.',
        order: 0
      },
      create: {
        departmentId: creativeDept.id,
        name: 'Paper Craft',
        slug: 'paper-craft',
        description: 'Custom paper bags, gift bags, shopping bags, and paper craft solutions for businesses and events.',
        order: 0,
        isActive: true
      }
    })
    console.log('  ✓ Paper Craft sub-department created')

    // Department 4: Data & Research Services
    const researchDept = await prisma.department.upsert({
      where: { slug: 'data-research-services' },
      update: {
        name: 'Data & Research Services',
        description: 'Advanced analytics, market research, digital marketing, data science, and academic writing services powered by expert researchers.',
        icon: 'FaChartLine',
        order: 3,
        isActive: true
      },
      create: {
        name: 'Data & Research Services',
        slug: 'data-research-services',
        description: 'Advanced analytics, market research, digital marketing, data science, and academic writing services powered by expert researchers.',
        icon: 'FaChartLine',
        order: 3,
        isActive: true
      }
    })
    console.log('✓ Data & Research Services department created\n')

    // Step 3: Create Department Services
    console.log('Step 3: Creating department services...')

    // Technology Solutions Services
    const techServices = [
      {
        title: 'Software Development',
        slug: 'software-development',
        description: 'Custom web applications, desktop software, and enterprise solutions built with cutting-edge technologies.',
        features: ['Web Applications', 'Desktop Software', 'API Development', 'System Integration', 'Custom Software'],
        order: 0
      },
      {
        title: 'Mobile Development',
        slug: 'mobile-development',
        description: 'Native and cross-platform mobile applications for iOS and Android using React Native and Flutter.',
        features: ['iOS Development', 'Android Development', 'React Native', 'Flutter Apps', 'App Store Submission'],
        order: 1
      },
      {
        title: 'Database Solutions',
        slug: 'database-solutions',
        description: 'Database design, optimization, migration, and management for scalable applications.',
        features: ['Database Design', 'PostgreSQL', 'MySQL', 'MongoDB', 'Database Migration', 'Performance Optimization'],
        order: 2
      },
      {
        title: 'Cloud Services',
        slug: 'cloud-services',
        description: 'AWS and Azure cloud solutions, migration, DevOps, and infrastructure management.',
        features: ['Cloud Migration', 'AWS Setup', 'Azure Integration', 'DevOps & CI/CD', 'Serverless Architecture'],
        order: 3
      },
      {
        title: 'Cybersecurity',
        slug: 'cybersecurity',
        description: 'Security audits, penetration testing, compliance management, and threat protection.',
        features: ['Security Audits', 'Penetration Testing', 'GDPR Compliance', 'Vulnerability Assessment', 'Security Training'],
        order: 4
      },
      {
        title: 'AI & Automation',
        slug: 'ai-automation',
        description: 'Artificial intelligence, machine learning, process automation, and intelligent chatbots.',
        features: ['Machine Learning', 'Process Automation', 'Custom Chatbots', 'NLP Solutions', 'Predictive Analytics'],
        order: 5
      }
    ]

    for (const service of techServices) {
      await prisma.departmentService.upsert({
        where: { slug: service.slug },
        update: {
          title: service.title,
          description: service.description,
          features: service.features,
          order: service.order
        },
        create: {
          departmentId: techDept.id,
          title: service.title,
          slug: service.slug,
          description: service.description,
          features: service.features,
          order: service.order,
          isActive: true
        }
      })
      console.log(`  ✓ ${service.title}`)
    }

    // IT Solutions Services
    const itService = {
      title: 'Hardware & IT Support',
      slug: 'hardware-it-support',
      description: 'Complete IT infrastructure, network setup, hardware procurement, and ongoing technical support.',
      features: ['Network Setup', 'Server Management', 'Hardware Procurement', 'IT Support', 'System Maintenance'],
      order: 0
    }

    await prisma.departmentService.upsert({
      where: { slug: itService.slug },
      update: {
        title: itService.title,
        description: itService.description,
        features: itService.features,
        order: itService.order
      },
      create: {
        departmentId: itDept.id,
        title: itService.title,
        slug: itService.slug,
        description: itService.description,
        features: itService.features,
        order: itService.order,
        isActive: true
      }
    })
    console.log(`  ✓ ${itService.title}`)

    // Creative Services
    const creativeService = {
      title: 'Graphic Design',
      slug: 'graphic-design',
      description: 'Professional logo design, brand identity, marketing materials, and UI/UX design services.',
      features: ['Logo Design', 'Brand Identity', 'Business Cards & Letterheads', 'Marketing Materials', 'UI/UX Design'],
      order: 0
    }

    await prisma.departmentService.upsert({
      where: { slug: creativeService.slug },
      update: {
        title: creativeService.title,
        description: creativeService.description,
        features: creativeService.features,
        order: creativeService.order
      },
      create: {
        departmentId: creativeDept.id,
        title: creativeService.title,
        slug: creativeService.slug,
        description: creativeService.description,
        features: creativeService.features,
        order: creativeService.order,
        isActive: true
      }
    })
    console.log(`  ✓ ${creativeService.title}`)

    // Paper Craft Services
    const paperCraftServices = [
      {
        title: 'Custom Paper Bags',
        slug: 'custom-paper-bags',
        description: 'High-quality custom printed paper bags for retail, events, and corporate branding.',
        features: ['Custom Sizes', 'Full Color Printing', 'Logo Branding', 'Eco-Friendly Materials', 'Bulk Orders'],
        order: 0
      },
      {
        title: 'Gift Bags',
        slug: 'gift-bags',
        description: 'Beautiful gift bags for all occasions - weddings, birthdays, corporate events, and special celebrations.',
        features: ['Wedding Gift Bags', 'Birthday Bags', 'Corporate Gift Bags', 'Luxury Finishes', 'Custom Designs'],
        order: 1
      },
      {
        title: 'Shopping Bags',
        slug: 'shopping-bags',
        description: 'Durable shopping bags with handles for retail stores, boutiques, and shopping centers.',
        features: ['Reinforced Handles', 'Various Sizes', 'Brand Customization', 'Bulk Discounts', 'Fast Turnaround'],
        order: 2
      },
      {
        title: 'Promotional Bags',
        slug: 'promotional-bags',
        description: 'Eye-catching promotional paper bags for marketing campaigns, trade shows, and brand awareness.',
        features: ['Event Bags', 'Trade Show Bags', 'Marketing Campaigns', 'Full Branding', 'Custom Messaging'],
        order: 3
      }
    ]

    for (const service of paperCraftServices) {
      await prisma.departmentService.upsert({
        where: { slug: service.slug },
        update: {
          title: service.title,
          description: service.description,
          features: service.features,
          order: service.order
        },
        create: {
          departmentId: creativeDept.id,
          subDepartmentId: paperCraftSubDept.id,
          title: service.title,
          slug: service.slug,
          description: service.description,
          features: service.features,
          order: service.order,
          isActive: true
        }
      })
      console.log(`    ✓ ${service.title}`)
    }

    // Data & Research Services
    const researchServices = [
      {
        title: 'Marketing Research',
        slug: 'marketing-research',
        description: 'Market analysis, competitor research, customer insights, and brand strategy development.',
        features: ['Market Research', 'Competitor Analysis', 'Customer Segmentation', 'Brand Strategy', 'Trend Forecasting'],
        order: 0
      },
      {
        title: 'Digital Marketing',
        slug: 'digital-marketing',
        description: 'SEO optimization, social media management, content marketing, and PPC campaigns.',
        features: ['SEO Optimization', 'Social Media Marketing', 'Content Marketing', 'PPC Campaigns', 'Email Marketing'],
        order: 1
      },
      {
        title: 'Data Science',
        slug: 'data-science',
        description: 'Advanced data analysis, machine learning models, and predictive analytics.',
        features: ['Data Analysis', 'Machine Learning', 'Predictive Modeling', 'Statistical Analysis', 'Data Mining'],
        order: 2
      },
      {
        title: 'Advanced Analytics',
        slug: 'advanced-analytics',
        description: 'Business intelligence dashboards, real-time data processing, and custom KPI tracking.',
        features: ['BI Dashboards', 'Data Visualization', 'Real-time Analytics', 'Custom KPIs', 'Reporting'],
        order: 3
      },
      {
        title: 'Academic Writing',
        slug: 'academic-writing-service',
        description: 'Professional academic writing support for Bachelor, Master, and PhD level research projects.',
        features: ['Research Proposals', 'Literature Reviews', 'Data Analysis', 'Thesis Compilation', 'Defense Preparation'],
        order: 4
      }
    ]

    for (const service of researchServices) {
      await prisma.departmentService.upsert({
        where: { slug: service.slug },
        update: {
          title: service.title,
          description: service.description,
          features: service.features,
          order: service.order
        },
        create: {
          departmentId: researchDept.id,
          title: service.title,
          slug: service.slug,
          description: service.description,
          features: service.features,
          order: service.order,
          isActive: true
        }
      })
      console.log(`  ✓ ${service.title}`)
    }

    // Step 4: Create Sample Department Projects
    console.log('\nStep 4: Creating sample department projects...')

    // Sample project for Technology Solutions
    await prisma.departmentProject.upsert({
      where: { slug: 'tech-ecommerce-platform' },
      update: {},
      create: {
        departmentId: techDept.id,
        title: 'E-Commerce Platform',
        slug: 'tech-ecommerce-platform',
        description: 'Full-featured e-commerce platform with payment integration, inventory management, and customer analytics.',
        technologies: ['Next.js', 'Node.js', 'PostgreSQL', 'Stripe'],
        clientName: 'Sample Client',
        order: 0,
        isActive: true
      }
    })
    console.log('  ✓ Technology Solutions sample project')

    // Sample project for IT Solutions
    await prisma.departmentProject.upsert({
      where: { slug: 'it-network-infrastructure' },
      update: {},
      create: {
        departmentId: itDept.id,
        title: 'Network Infrastructure Setup',
        slug: 'it-network-infrastructure',
        description: 'Complete office network infrastructure with servers, workstations, and security systems.',
        clientName: 'Corporate Office',
        order: 0,
        isActive: true
      }
    })
    console.log('  ✓ IT Solutions sample project')

    // Sample project for Creative Services - Paper Craft
    await prisma.departmentProject.upsert({
      where: { slug: 'custom-branded-shopping-bags' },
      update: {},
      create: {
        departmentId: creativeDept.id,
        subDepartmentId: paperCraftSubDept.id,
        title: 'Custom Branded Shopping Bags',
        slug: 'custom-branded-shopping-bags',
        description: 'Premium custom paper shopping bags with full-color logo printing for luxury retail store.',
        clientName: 'Luxury Boutique',
        order: 0,
        isActive: true
      }
    })
    console.log('  ✓ Paper Craft sample project')

    // Sample project for Data & Research
    await prisma.departmentProject.upsert({
      where: { slug: 'market-research-study' },
      update: {},
      create: {
        departmentId: researchDept.id,
        title: 'Market Research Study',
        slug: 'market-research-study',
        description: 'Comprehensive market analysis and competitor research for product launch strategy.',
        clientName: 'Tech Startup',
        order: 0,
        isActive: true
      }
    })
    console.log('  ✓ Data & Research sample project')

    console.log('\n=== SUMMARY ===')
    console.log('✅ 4 Departments created')
    console.log('✅ 1 Sub-Department created (Paper Craft)')
    console.log('✅ 4 Department Heads added to team')
    console.log('✅ 17 Department Services created')
    console.log('✅ 4 Sample Projects created')
    console.log('\nDepartment Structure:')
    console.log(`1. Technology Solutions (${techServices.length} services) - Head: CEO`)
    console.log(`2. IT Solutions (1 service) - Head: Hardware Technician`)
    console.log(`3. Creative Services (1 service + Paper Craft sub-dept with ${paperCraftServices.length} services) - Head: Creative Director`)
    console.log(`4. Data & Research Services (${researchServices.length} services) - Head: Lead Researcher`)
    console.log('\n✅ All departments can now be edited in admin panel!')
    console.log('\nNext steps:')
    console.log('1. Go to /admin/team to add photos and update department head profiles')
    console.log('2. Go to /admin/departments to edit department details')
    console.log('3. Go to /admin/departments/[id] to add projects with images/videos')
    console.log('4. Visit main website to see departments and projects displayed')

  } catch (error) {
    console.error('Error creating departments:', error)
    throw error
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  createDepartmentsStructure()
    .then(() => {
      console.log('\n✅ Seed completed successfully')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n❌ Seed failed:', error)
      process.exit(1)
    })
    .finally(() => {
      prisma.$disconnect()
    })
}
