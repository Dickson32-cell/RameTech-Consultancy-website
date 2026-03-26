// src/app/api/v1/admin/stats/route.ts
// Dashboard statistics

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const token = cookieStore.get('rametech_token')?.value

    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const payload = verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const [
      blogPosts,
      services,
      portfolioProjects,
      teamMembers,
      faqs,
      unreadMessages,
      newLeads,
      subscribers
    ] = await Promise.all([
      prisma.blogPost.count(),
      prisma.service.count({ where: { isActive: true } }),
      prisma.portfolioProject.count({ where: { isActive: true } }),
      prisma.teamMember.count({ where: { isActive: true } }),
      prisma.fAQ.count({ where: { isActive: true } }),
      prisma.contactMessage.count({ where: { isRead: false } }),
      prisma.chatbotLead.count({ where: { status: 'new' } }),
      prisma.newsletterSubscriber.count({ where: { isActive: true } })
    ])

    return NextResponse.json({
      success: true,
      data: {
        blogPosts,
        services,
        portfolioProjects,
        teamMembers,
        faqs,
        unreadMessages,
        newLeads,
        subscribers
      }
    })
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
