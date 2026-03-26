// Reset all tables and seed fresh data
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { secret } = await request.json()
    if (secret !== 'rametech-reset-2026') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Delete existing records (in correct order for FK)
    await prisma.chatbotLead.deleteMany().catch(() => {})
    await prisma.invoice.deleteMany().catch(() => {})
    await prisma.project.deleteMany().catch(() => {})
    await prisma.newsletterSubscriber.deleteMany().catch(() => {})
    await prisma.contactMessage.deleteMany().catch(() => {})
    await prisma.quoteRequest.deleteMany().catch(() => {})
    await prisma.fAQ.deleteMany().catch(() => {})
    await prisma.blogPost.deleteMany().catch(() => {})
    await prisma.portfolioProject.deleteMany().catch(() => {})
    await prisma.service.deleteMany().catch(() => {})
    await prisma.teamMember.deleteMany().catch(() => {})
    await prisma.socialMedia.deleteMany().catch(() => {})
    await prisma.portalUser.deleteMany().catch(() => {})

    // Pre-computed hash for 'admin123' (cost 10)
    const adminHash = '$2b$10$vRTZAxaxqyvPYtgGp7esJuzMOtsHOwFysCxv8BkXjwiJk7MGdCiMW'
    await prisma.portalUser.create({
      data: { email: 'admin@rametech.com', passwordHash: adminHash, name: 'Admin User', role: 'admin', isActive: true }
    })

    const team = [
      { name: 'Abdul Rashid Dickson', role: 'CEO', bio: 'Leading RAME Tech with vision and expertise in software development and business strategy.', email: 'dickson@rametech.com', photoUrl: '/images/team/abdul-rashid-dickson.jpg', order: 1, isActive: true },
      { name: 'Harriet Emefa Asonkey', role: 'Administrator', bio: 'Keeping operations smooth and efficient with exceptional organizational skills.', email: 'harriet@rametech.com', photoUrl: '/images/team/harriet-emefa-asonkey.jpg', order: 2, isActive: true },
      { name: 'Dickson Abdul-Wahab', role: 'Researcher', bio: 'Driving innovation through thorough research and technical exploration.', email: 'wahab@rametech.com', photoUrl: '/images/team/dickson-abdul-wahab.jpg', order: 3, isActive: true },
      { name: 'Anyetei Sowah Joseph', role: 'Graphic Designer', bio: 'Creative designer bringing brands to life with stunning visual designs.', email: 'joseph@rametech.com', photoUrl: '/images/team/anyetei-sowah-joseph.jpg', order: 4, isActive: true },
      { name: 'David Tetteh', role: 'Hardware Technician', bio: 'Expert in hardware setup, repairs, and IT infrastructure maintenance.', email: 'david@rametech.com', photoUrl: '/images/team/david-tetteh.jpg', order: 5, isActive: true }
    ]
    for (const m of team) await prisma.teamMember.create({ data: m })

    const services = [
      { name: 'Software Development', slug: 'software-development', description: 'Custom web applications, mobile apps, and enterprise software solutions tailored to your business needs.', icon: 'FaCode', features: ['Web Application Development','Mobile App Development (iOS & Android)','API Development & Integration','E-commerce Solutions','Custom Software'], order: 1, isActive: true },
      { name: 'Hardware & IT', slug: 'hardware-it', description: 'Complete IT infrastructure solutions including networking, server management, and technical support.', icon: 'FaLaptopCode', features: ['Network Setup & Maintenance','Server Management','IT Support & Maintenance','Hardware Procurement','Cloud Solutions'], order: 2, isActive: true },
      { name: 'Graphic Design', slug: 'graphic-design', description: 'Professional design services to build your brand identity and create compelling visual content.', icon: 'FaPalette', features: ['Logo & Brand Identity','Marketing Materials','Social Media Graphics','Print Design','UI/UX Design'], order: 3, isActive: true },
      { name: 'Mobile Development', slug: 'mobile-development', description: 'Native and cross-platform mobile applications for iOS and Android platforms.', icon: 'FaMobileAlt', features: ['iOS Development','Android Development','React Native Apps','Flutter Apps','App Store Submission'], order: 4, isActive: true },
      { name: 'Database Solutions', slug: 'database-solutions', description: 'Design, implementation, and management of scalable database systems.', icon: 'FaDatabase', features: ['Database Design','Data Migration','Performance Optimization','Backup & Recovery','Data Security'], order: 5, isActive: true },
      { name: 'Cloud Services', slug: 'cloud-services', description: 'Cloud infrastructure setup and migration services for modern businesses.', icon: 'FaCloud', features: ['Cloud Migration','AWS Services','Azure Solutions','Cloud Security','DevOps Services'], order: 6, isActive: true },
      { name: 'Advanced Analytics', slug: 'advanced-analytics', description: 'Transform your data into actionable insights with cutting-edge analytics solutions powered by AI and machine learning.', icon: 'FaChartLine', features: ['Business Intelligence Dashboards','Predictive Analytics','Real-time Data Processing','Custom KPI Tracking','Data Visualization','ML-powered Insights'], order: 7, isActive: true },
      { name: 'Marketing Research', slug: 'marketing-research', description: 'Data-driven market research to understand your audience, competition, and industry trends.', icon: 'FaSearch', features: ['Market Segmentation','Competitor Analysis','Customer Behavior Analysis','Trend Forecasting','Brand Perception Studies','Survey Design & Analysis'], order: 8, isActive: true },
      { name: 'Digital Marketing', slug: 'digital-marketing', description: 'Strategic digital marketing services to boost your online presence and drive conversions.', icon: 'FaBullhorn', features: ['SEO Optimization','Social Media Marketing','Content Marketing','PPC Campaigns','Email Marketing','Conversion Rate Optimization'], order: 9, isActive: true },
      { name: 'AI & Automation', slug: 'ai-automation', description: 'Leverage artificial intelligence to automate processes and enhance decision-making.', icon: 'FaRobot', features: ['Chatbot Development','Process Automation','Natural Language Processing','Computer Vision','AI Consulting','Custom AI Solutions'], order: 10, isActive: true },
      { name: 'Data Science', slug: 'data-science', description: 'Expert data science consulting to extract meaningful patterns and predictions from your data.', icon: 'FaChartBar', features: ['Statistical Modeling','Machine Learning Models','Deep Learning','Time Series Analysis','Recommendation Systems','Data Wrangling'], order: 11, isActive: true },
      { name: 'Cybersecurity', slug: 'cybersecurity', description: 'Protect your business with comprehensive security solutions and audits.', icon: 'FaShieldAlt', features: ['Security Audits','Penetration Testing','Compliance Management','Incident Response','Security Training','Threat Assessment'], order: 12, isActive: true }
    ]
    for (const s of services) await prisma.service.create({ data: s })

    const portfolio = [
      { title: 'E-Commerce Platform', slug: 'e-commerce-platform', category: 'Web Development', description: 'A full-featured online store with payment integration, inventory management, and responsive design.', imageUrl: 'https://ui-avatars.com/api/?name=E-Commerce&size=400x300&background=1A5276&color=fff', technologies: ['Next.js','Stripe','PostgreSQL','Tailwind CSS'], clientName: 'Retail Client', order: 1, isActive: true },
      { title: 'Mobile Banking App', slug: 'mobile-banking-app', category: 'Mobile Development', description: 'Secure mobile banking application with biometric authentication and real-time transactions.', imageUrl: 'https://ui-avatars.com/api/?name=Banking+App&size=400x300&background=F39C12&color=fff', technologies: ['React Native','Node.js','MongoDB','JWT'], clientName: 'Financial Services Ltd', order: 2, isActive: true },
      { title: 'Corporate Branding', slug: 'corporate-branding', category: 'Graphic Design', description: 'Complete brand identity package including logo design and brand guidelines.', imageUrl: 'https://ui-avatars.com/api/?name=Branding&size=400x300&background=154360&color=fff', technologies: ['Adobe Illustrator','Photoshop','Figma'], clientName: 'Corporate Client', order: 3, isActive: true }
    ]
    for (const p of portfolio) await prisma.portfolioProject.create({ data: p })

    const faqs = [
      { question: 'How long does a website project take?', answer: 'A standard business website takes 4-6 weeks. Complex applications may take 8-12 weeks depending on scope.', category: 'general', order: 1, isActive: true },
      { question: 'Do you build mobile apps?', answer: 'Yes! We develop native and cross-platform mobile apps for iOS and Android using React Native and Flutter.', category: 'services', order: 2, isActive: true },
      { question: 'What are your payment terms?', answer: 'We structure payments as 50% upfront, 30% at mid-project, and 20% upon delivery.', category: 'general', order: 3, isActive: true },
      { question: 'Do you offer ongoing support?', answer: 'Yes, we offer monthly maintenance packages from basic security updates to full technical support.', category: 'general', order: 4, isActive: true },
      { question: 'Can I see examples of your work?', answer: 'Visit our Portfolio page to see case studies of completed projects.', category: 'general', order: 5, isActive: true }
    ]
    for (const f of faqs) await prisma.fAQ.create({ data: f })

    // Seed Social Media
    await prisma.socialMedia.create({ data: { name: 'LinkedIn', url: 'https://linkedin.com/company/rametech', icon: 'FaLinkedin', order: 1, isActive: true } })

    return NextResponse.json({ success: true, message: 'Database fully reset and seeded: admin, 5 team, 12 services, 3 portfolio, 5 FAQs, 1 social' })

  } catch (error: any) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 })
  }
}
