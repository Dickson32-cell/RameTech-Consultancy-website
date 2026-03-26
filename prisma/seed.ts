// prisma/seed.ts
// Seed data for initial database population
// Run: npx prisma db seed

const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // ============================================
  // ADMIN USER
  // ============================================
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.portalUser.upsert({
    where: { email: 'admin@rametech.com' },
    update: {},
    create: {
      email: 'admin@rametech.com',
      passwordHash: adminPassword,
      name: 'Admin User',
      role: 'admin',
      isActive: true
    }
  })
  console.log('✅ Admin user created')

  // ============================================
  // TEAM MEMBERS (from src/app/team/page.tsx)
  // ============================================
  const teamMembers = [
    {
      name: 'Abdul Rashid Dickson',
      role: 'CEO',
      bio: 'Leading RAME Tech with vision and expertise in software development and business strategy.',
      email: 'dickson@rametech.com',
      phone: '+233 000 000 000',
      photoUrl: '/images/team/abdul-rashid-dickson.jpg',
      order: 1,
      isActive: true
    },
    {
      name: 'Harriet Emefa Asonkey',
      role: 'Administrator',
      bio: 'Keeping operations smooth and efficient with exceptional organizational skills.',
      email: 'harriet@rametech.com',
      phone: '+233 000 000 001',
      photoUrl: '/images/team/harriet-emefa-asonkey.jpg',
      order: 2,
      isActive: true
    },
    {
      name: 'Dickson Abdul-Wahab',
      role: 'Researcher',
      bio: 'Driving innovation through thorough research and technical exploration.',
      email: 'wahab@rametech.com',
      phone: '+233 000 000 002',
      photoUrl: '/images/team/dickson-abdul-wahab.jpg',
      order: 3,
      isActive: true
    },
    {
      name: 'Anyetei Sowah Joseph',
      role: 'Graphic Designer',
      bio: 'Creative designer bringing brands to life with stunning visual designs.',
      email: 'joseph@rametech.com',
      phone: '+233 000 000 003',
      photoUrl: '/images/team/anyetei-sowah-joseph.jpg',
      order: 4,
      isActive: true
    },
    {
      name: 'David Tetteh',
      role: 'Hardware Technician',
      bio: 'Expert in hardware setup, repairs, and IT infrastructure maintenance.',
      email: 'david@rametech.com',
      phone: '+233 000 000 004',
      photoUrl: '/images/team/david-tetteh.jpg',
      order: 5,
      isActive: true
    }
  ]

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { email: member.email },
      update: {},
      create: member
    })
  }
  console.log(`✅ ${teamMembers.length} team members seeded`)

  // ============================================
  // SERVICES (from src/app/services/page.tsx)
  // ============================================
  const services = [
    {
      name: 'Software Development',
      slug: 'software-development',
      description: 'Custom web applications, mobile apps, and enterprise software solutions tailored to your business needs.',
      icon: 'FaCode',
      features: [
        'Web Application Development',
        'Mobile App Development (iOS & Android)',
        'API Development & Integration',
        'E-commerce Solutions',
        'Custom Software'
      ],
      order: 1,
      isActive: true
    },
    {
      name: 'Hardware & IT',
      slug: 'hardware-it',
      description: 'Complete IT infrastructure solutions including networking, server management, and technical support.',
      icon: 'FaLaptopCode',
      features: [
        'Network Setup & Maintenance',
        'Server Management',
        'IT Support & Maintenance',
        'Hardware Procurement',
        'Cloud Solutions'
      ],
      order: 2,
      isActive: true
    },
    {
      name: 'Graphic Design',
      slug: 'graphic-design',
      description: 'Professional design services to build your brand identity and create compelling visual content.',
      icon: 'FaPalette',
      features: [
        'Logo & Brand Identity',
        'Marketing Materials',
        'Social Media Graphics',
        'Print Design',
        'UI/UX Design'
      ],
      order: 3,
      isActive: true
    },
    {
      name: 'Mobile Development',
      slug: 'mobile-development',
      description: 'Native and cross-platform mobile applications for iOS and Android platforms.',
      icon: 'FaMobileAlt',
      features: [
        'iOS Development',
        'Android Development',
        'React Native Apps',
        'Flutter Apps',
        'App Store Submission'
      ],
      order: 4,
      isActive: true
    },
    {
      name: 'Database Solutions',
      slug: 'database-solutions',
      description: 'Design, implementation, and management of scalable database systems.',
      icon: 'FaDatabase',
      features: [
        'Database Design',
        'Data Migration',
        'Performance Optimization',
        'Backup & Recovery',
        'Data Security'
      ],
      order: 5,
      isActive: true
    },
    {
      name: 'Cloud Services',
      slug: 'cloud-services',
      description: 'Cloud infrastructure setup and migration services for modern businesses.',
      icon: 'FaCloud',
      features: [
        'Cloud Migration',
        'AWS Services',
        'Azure Solutions',
        'Cloud Security',
        'DevOps Services'
      ],
      order: 6,
      isActive: true
    }
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service
    })
  }
  console.log(`✅ ${services.length} services seeded`)

  // ============================================
  // PORTFOLIO PROJECTS
  // ============================================
  const portfolioProjects = [
    {
      title: 'E-Commerce Platform',
      slug: 'e-commerce-platform',
      category: 'Web Development',
      description: 'A full-featured online store with payment integration, inventory management, and responsive design for seamless shopping across all devices.',
      imageUrl: 'https://ui-avatars.com/api/?name=E-Commerce&size=400x300&background=1A5276&color=fff',
      technologies: ['Next.js', 'Stripe', 'PostgreSQL', 'Tailwind CSS'],
      clientName: 'Retail Client',
      projectUrl: null,
      order: 1,
      isActive: true
    },
    {
      title: 'Mobile Banking App',
      slug: 'mobile-banking-app',
      category: 'Mobile Development',
      description: 'Secure mobile banking application with biometric authentication, real-time transactions, and budget tracking features.',
      imageUrl: 'https://ui-avatars.com/api/?name=Banking+App&size=400x300&background=F39C12&color=fff',
      technologies: ['React Native', 'Node.js', 'MongoDB', 'JWT'],
      clientName: 'Financial Services Ltd',
      projectUrl: null,
      order: 2,
      isActive: true
    },
    {
      title: 'Corporate Branding',
      slug: 'corporate-branding',
      category: 'Graphic Design',
      description: 'Complete brand identity package including logo design, business cards, letterheads, and brand guidelines document.',
      imageUrl: 'https://ui-avatars.com/api/?name=Branding&size=400x300&background=154360&color=fff',
      technologies: ['Adobe Illustrator', 'Photoshop', 'Figma'],
      clientName: 'Corporate Client',
      projectUrl: null,
      order: 3,
      isActive: true
    }
  ]

  for (const project of portfolioProjects) {
    await prisma.portfolioProject.upsert({
      where: { slug: project.slug },
      update: {},
      create: project
    })
  }
  console.log(`✅ ${portfolioProjects.length} portfolio projects seeded`)

  // ============================================
  // FAQs
  // ============================================
  const faqs = [
    { question: 'How long does a website project take?', answer: 'A standard business website takes 4-6 weeks. Complex applications may take 8-12 weeks depending on scope and requirements.', category: 'general', order: 1, isActive: true },
    { question: 'Do you build mobile apps?', answer: 'Yes! We develop native and cross-platform mobile apps for iOS and Android using React Native and Flutter.', category: 'services', order: 2, isActive: true },
    { question: 'What are your payment terms?', answer: 'We structure payments as 50% upfront, 30% at mid-project, and 20% upon delivery. Custom arrangements available for larger projects.', category: 'general', order: 3, isActive: true },
    { question: 'Do you offer ongoing support?', answer: 'Yes, we offer monthly maintenance packages starting from basic security updates to full technical support and feature additions.', category: 'general', order: 4, isActive: true },
    { question: 'Can I see examples of your work?', answer: 'Visit our Portfolio page to see case studies of completed projects across web development, mobile apps, and graphic design.', category: 'general', order: 5, isActive: true },
    { question: 'Do you work with clients outside Ghana?', answer: 'Absolutely! We work with clients worldwide and use modern collaboration tools to ensure smooth communication regardless of location.', category: 'general', order: 6, isActive: true }
  ]

  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { question: faq.question },
      update: {},
      create: faq
    })
  }
  console.log(`✅ ${faqs.length} FAQs seeded`)

  // ============================================
  // BLOG POSTS
  // ============================================
  const blogPosts = [
    {
      title: 'Why Every Business in Ghana Needs a Professional Website in 2026',
      slug: 'why-business-needs-website-2026',
      excerpt: "In today's digital age, having a professional online presence is essential for business success.",
      content: 'Full article content here...',
      category: 'Web Development',
      author: 'Abdul Rashid Dickson',
      readTime: '5 min read',
      isPublished: true,
      isFeatured: true,
      publishedAt: new Date()
    },
    {
      title: 'How AI is Transforming Software Development in Africa',
      slug: 'ai-transforming-software-development-africa',
      excerpt: 'Artificial intelligence is revolutionizing how we build software.',
      content: 'Full article content here...',
      category: 'AI & Technology',
      author: 'Dickson Abdul-Wahab',
      readTime: '7 min read',
      isPublished: true,
      isFeatured: false,
      publishedAt: new Date()
    }
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post
    })
  }
  console.log(`✅ ${blogPosts.length} blog posts seeded`)

  console.log('\n🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
