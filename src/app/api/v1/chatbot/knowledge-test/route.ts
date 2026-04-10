import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/v1/chatbot/knowledge-test - Test what the chatbot knows
export async function GET(request: NextRequest) {
  const knowledge: any = {
    timestamp: new Date().toISOString(),
    summary: {},
    details: {}
  }

  try {
    // Check Departments
    const departments = await prisma.department.findMany({
      where: { isActive: true },
      include: {
        services: { where: { isActive: true } },
        subDepartments: {
          where: { isActive: true },
          include: { services: { where: { isActive: true } } }
        }
      }
    })

    knowledge.summary.departments = departments.length
    knowledge.details.departments = departments.map(d => ({
      name: d.name,
      services: d.services.length,
      subDepartments: d.subDepartments.map(sd => ({
        name: sd.name,
        services: sd.services.length
      }))
    }))

    // Check Team
    const team = await prisma.teamMember.findMany({
      where: { isActive: true }
    })

    knowledge.summary.teamMembers = team.length
    knowledge.details.teamMembers = team.map(t => ({
      name: t.name,
      role: t.role
    }))

    // Check Academic Writing
    const phases = await prisma.academicWritingPhase.findMany({
      where: { isActive: true },
      include: { serviceItems: { where: { isActive: true } } }
    })

    const totalItems = phases.reduce((sum, p) => sum + p.serviceItems.length, 0)
    knowledge.summary.academicWriting = {
      phases: phases.length,
      items: totalItems
    }

    // Check Academic Document
    const doc = await prisma.academicWritingDocument.findFirst({
      where: { isActive: true }
    })

    knowledge.summary.academicDocument = doc ? doc.fileName : 'None'

    // Check Publications
    const pubs = await prisma.publication.findMany({
      where: { isActive: true, isFeatured: true }
    })

    knowledge.summary.publications = pubs.length

    // Check Services
    const services = await prisma.service.findMany({
      where: { isActive: true }
    })

    knowledge.summary.services = services.length

    // Check FAQs
    const faqs = await prisma.fAQ.findMany({
      where: { isActive: true }
    })

    knowledge.summary.faqs = faqs.length

    // Check Blogs
    const blogs = await prisma.blogPost.findMany({
      where: { isPublished: true }
    })

    knowledge.summary.blogPosts = blogs.length

    // Check Projects
    const projects = await prisma.departmentProject.findMany({
      where: { isActive: true }
    })

    knowledge.summary.departmentProjects = projects.length

    // Overall assessment
    const totalKnowledgeItems =
      departments.length +
      team.length +
      phases.length +
      (doc ? 1 : 0) +
      pubs.length +
      services.length +
      faqs.length +
      blogs.length +
      projects.length

    knowledge.overall = {
      status: totalKnowledgeItems > 0 ? 'OPERATIONAL ✅' : 'NO DATA ⚠️',
      totalKnowledgeItems,
      message: totalKnowledgeItems > 0
        ? 'Chatbot has comprehensive knowledge from database'
        : 'Run npm run render:setup to populate chatbot knowledge'
    }

    knowledge.examples = {
      'What departments do you have?': departments.length > 0 ? `Chatbot will list ${departments.length} departments` : 'No departments yet',
      'Tell me about paper bags': departments.some(d => d.subDepartments.some(sd => sd.name === 'Paper Craft')) ? 'Chatbot will describe Paper Craft services' : 'Paper Craft not set up yet',
      'Who is your CEO?': team.some(t => t.role.includes('CEO')) ? 'Chatbot will provide CEO info' : 'CEO not added yet',
      'Academic writing pricing?': totalItems > 0 ? `Chatbot will show ${totalItems} service items with pricing` : 'Academic writing not set up yet',
      'Recent blog posts?': blogs.length > 0 ? `Chatbot will mention ${blogs.length} recent posts` : 'No blogs published yet'
    }

    return NextResponse.json({
      success: true,
      knowledge,
      recommendation: totalKnowledgeItems === 0
        ? 'Run: npm run render:setup in Render Shell to populate all chatbot knowledge'
        : 'Chatbot is fully operational and knows about all your content!'
    })

  } catch (error: any) {
    console.error('Knowledge test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      knowledge
    }, { status: 500 })
  }
}
