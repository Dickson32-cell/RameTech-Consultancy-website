import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

// GET /api/v1/admin/diagnostics - System health check
export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    tables: {},
    apis: {},
    overall: 'CHECKING...'
  }

  const errors: string[] = []

  try {
    // Check all database tables
    console.log('=== SYSTEM DIAGNOSTICS STARTED ===')

    // 1. TeamMember table
    try {
      const teamCount = await prisma.teamMember.count()
      diagnostics.tables.TeamMember = { status: 'OK', count: teamCount }
      console.log(`✓ TeamMember: ${teamCount} records`)
    } catch (e: any) {
      diagnostics.tables.TeamMember = { status: 'ERROR', error: e.message }
      errors.push(`TeamMember: ${e.message}`)
    }

    // 2. Service table
    try {
      const serviceCount = await prisma.service.count()
      diagnostics.tables.Service = { status: 'OK', count: serviceCount }
      console.log(`✓ Service: ${serviceCount} records`)
    } catch (e: any) {
      diagnostics.tables.Service = { status: 'ERROR', error: e.message }
      errors.push(`Service: ${e.message}`)
    }

    // 3. Department table
    try {
      const deptCount = await prisma.department.count()
      diagnostics.tables.Department = { status: 'OK', count: deptCount }
      console.log(`✓ Department: ${deptCount} records`)
    } catch (e: any) {
      diagnostics.tables.Department = { status: 'ERROR', error: e.message }
      errors.push(`Department: ${e.message}`)
    }

    // 4. Publication table
    try {
      const pubCount = await prisma.publication.count()
      diagnostics.tables.Publication = { status: 'OK', count: pubCount }
      console.log(`✓ Publication: ${pubCount} records`)
    } catch (e: any) {
      diagnostics.tables.Publication = { status: 'ERROR', error: e.message }
      errors.push(`Publication: ${e.message}`)
    }

    // 5. BlogPost table
    try {
      const blogCount = await prisma.blogPost.count()
      diagnostics.tables.BlogPost = { status: 'OK', count: blogCount }
      console.log(`✓ BlogPost: ${blogCount} records`)
    } catch (e: any) {
      diagnostics.tables.BlogPost = { status: 'ERROR', error: e.message }
      errors.push(`BlogPost: ${e.message}`)
    }

    // 6. FAQ table
    try {
      const faqCount = await prisma.fAQ.count()
      diagnostics.tables.FAQ = { status: 'OK', count: faqCount }
      console.log(`✓ FAQ: ${faqCount} records`)
    } catch (e: any) {
      diagnostics.tables.FAQ = { status: 'ERROR', error: e.message }
      errors.push(`FAQ: ${e.message}`)
    }

    // 7. AcademicWritingPhase table
    try {
      const phaseCount = await prisma.academicWritingPhase.count()
      diagnostics.tables.AcademicWritingPhase = { status: 'OK', count: phaseCount }
      console.log(`✓ AcademicWritingPhase: ${phaseCount} records`)
    } catch (e: any) {
      diagnostics.tables.AcademicWritingPhase = { status: 'ERROR', error: e.message }
      errors.push(`AcademicWritingPhase: ${e.message}`)
    }

    // 8. AcademicWritingServiceItem table
    try {
      const itemCount = await prisma.academicWritingServiceItem.count()
      diagnostics.tables.AcademicWritingServiceItem = { status: 'OK', count: itemCount }
      console.log(`✓ AcademicWritingServiceItem: ${itemCount} records`)
    } catch (e: any) {
      diagnostics.tables.AcademicWritingServiceItem = { status: 'ERROR', error: e.message }
      errors.push(`AcademicWritingServiceItem: ${e.message}`)
    }

    // 9. AcademicWritingDocument table
    try {
      const docCount = await prisma.academicWritingDocument.count()
      diagnostics.tables.AcademicWritingDocument = { status: 'OK', count: docCount }
      console.log(`✓ AcademicWritingDocument: ${docCount} records`)
    } catch (e: any) {
      diagnostics.tables.AcademicWritingDocument = { status: 'ERROR', error: e.message }
      errors.push(`AcademicWritingDocument: ${e.message}`)
    }

    // 10. ContactMessage table
    try {
      const msgCount = await prisma.contactMessage.count()
      diagnostics.tables.ContactMessage = { status: 'OK', count: msgCount }
      console.log(`✓ ContactMessage: ${msgCount} records`)
    } catch (e: any) {
      diagnostics.tables.ContactMessage = { status: 'ERROR', error: e.message }
      errors.push(`ContactMessage: ${e.message}`)
    }

    // Overall status
    if (errors.length === 0) {
      diagnostics.overall = 'ALL SYSTEMS OPERATIONAL ✅'
      console.log('=== ALL SYSTEMS OPERATIONAL ===')
    } else {
      diagnostics.overall = `${errors.length} ISSUES FOUND ⚠️`
      console.log(`=== ${errors.length} ISSUES FOUND ===`)
    }

    diagnostics.errors = errors
    diagnostics.recommendations = []

    // Add recommendations
    if (diagnostics.tables.AcademicWritingPhase?.count === 0) {
      diagnostics.recommendations.push('Run: npm run db:seed-academic to populate Academic Writing data')
    }
    if (diagnostics.tables.TeamMember?.count === 0) {
      diagnostics.recommendations.push('Add team members via /admin/team/new')
    }
    if (diagnostics.tables.Service?.count === 0) {
      diagnostics.recommendations.push('Run: npx ts-node prisma/seeds/add-academic-writing-service.ts')
    }

    return NextResponse.json({
      success: errors.length === 0,
      diagnostics,
      summary: {
        totalTables: Object.keys(diagnostics.tables).length,
        healthy: Object.values(diagnostics.tables).filter((t: any) => t.status === 'OK').length,
        errors: errors.length
      }
    })
  } catch (error: any) {
    console.error('Diagnostic system error:', error)
    return NextResponse.json({
      success: false,
      diagnostics,
      error: error.message
    }, { status: 500 })
  }
}
