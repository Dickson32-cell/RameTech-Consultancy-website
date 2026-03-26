// src/app/api/v1/admin/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

async function checkAdmin() {
  const cookieStore = await import('next/headers').then(m => m.cookies())
  const token = cookieStore.get('rametech_token')?.value
  const payload = token ? verifyToken(token) : null
  if (!payload || payload.role !== 'admin') return null
  return payload
}

export async function GET() {
  try {
    const admin = await checkAdmin()
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const blogs = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: blogs })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await checkAdmin()
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, slug, excerpt, content, category, imageUrl, author, readTime, isPublished, isFeatured } = body

    if (!title || !slug || !excerpt || !content || !category) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const existing = await prisma.blogPost.findUnique({ where: { slug } })
    if (existing) return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 })

    const blog = await prisma.blogPost.create({
      data: {
        title, slug, excerpt, content, category,
        imageUrl: imageUrl || null, author: author || null, readTime: readTime || null,
        isPublished: isPublished || false, isFeatured: isFeatured || false,
        publishedAt: isPublished ? new Date() : null
      }
    })

    return NextResponse.json({ success: true, data: blog }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
