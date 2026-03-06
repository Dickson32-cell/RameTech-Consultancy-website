// prisma/seed.ts
// Seed data for initial database population
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  await prisma.portalUser.upsert({
    where: { email: 'admin@rametech.com' },
    update: {},
    create: {
      email: 'admin@rametech.com',
      name: 'Admin User',
      passwordHash: adminPassword,
      role: 'admin',
      isActive: true
    }
  })

  // Create services
  const services = [
    {
      name: 'Software Development',
      slug: 'software-development',
      description: 'Custom web applications, mobile apps, and enterprise software solutions tailored to your business needs.',
      icon: 'FaCode',
      features: ['Web Application Development', 'Mobile App Development', 'API Development', 'E-commerce Solutions'],
      order: 1
    },
    {
      name: 'Hardware & IT',
      slug: 'hardware-it',
      description: 'Complete IT infrastructure solutions including networking, server management, and technical support.',
      icon: 'FaLaptopCode',
      features: ['Network Setup', 'Server Management', 'IT Support', 'Hardware Procurement'],
      order: 2
    },
    {
      name: 'Graphic Design',
      slug: 'graphic-design',
      description: 'Professional design services to build your brand identity and create compelling visual content.',
      icon: 'FaPalette',
      features: ['Logo & Brand Identity', 'Marketing Materials', 'Social Media Graphics', 'Print Design'],
      order: 3
    }
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service
    })
  }

  // Create FAQs
  const faqs = [
    { question: 'How long does a website project take?', answer: 'A standard business website takes 4-6 weeks. Complex applications may take 8-12 weeks.', category: 'general', order: 1 },
    { question: 'Do you build mobile apps?', answer: 'Yes! We develop native and cross-platform mobile apps for iOS and Android.', category: 'services', order: 2 },
    { question: 'What are your payment terms?', answer: 'We structure payments as 50% upfront, 30% at mid-project, and 20% upon delivery.', category: 'general', order: 3 },
    { question: 'Do you offer ongoing support?', answer: 'Yes, we offer monthly maintenance packages starting from basic security updates.', category: 'general', order: 4 },
    { question: 'Can I see examples of your work?', answer: 'Visit our Portfolio page to see case studies of completed projects.', category: 'general', order: 5 }
  ]

  for (const faq of faqs) {
    await prisma.fAQ.create({ data: faq })
  }

  // Create sample blog posts
  const blogPosts = [
    {
      title: 'Why Every Business in Ghana Needs a Professional Website in 2026',
      slug: 'why-business-needs-website-2026',
      excerpt: 'In todays digital age, having a professional online presence is essential for business success.',
      content: 'Full article content here...',
      category: 'Web Development',
      isPublished: true,
      isFeatured: true
    },
    {
      title: 'How AI is Transforming Software Development in Africa',
      slug: 'ai-transforming-software-development-africa',
      excerpt: 'Artificial intelligence is revolutionizing how we build software.',
      content: 'Full article content here...',
      category: 'AI & Technology',
      isPublished: true,
      isFeatured: false
    }
  ]

  for (const post of blogPosts) {
    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      update: {},
      create: post
    })
  }

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
