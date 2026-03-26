// src/app/api/v1/admin/blogs/[id]/route.ts
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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await checkAdmin()
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const blog = await prisma.blogPost.findUnique({ where: { id: params.id } })
    if (!blog) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    return NextResponse.json({ success: true, data: blog })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await checkAdmin()
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { title, slug, excerpt, content, category, imageUrl, author, readTime, isPublished, isFeatured } = body

    const existing = await prisma.blogPost.findUnique({ where: { id: params.id } })
    if (!existing) return NextResponse.json({ success: false, error: 'Not found' }, { status: 404 })

    // Check slug uniqueness if changed
    if (slug !== existing.slug) {
      const slugConflict = await prisma.blogPost.findUnique({ where: { slug } })
      if (slugConflict) return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 })
    }

    const blog = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        title, slug, excerpt, content, category,
        imageUrl: imageUrl || null, author: author || null, readTime: readTime || null,
        isPublished: isPublished || false, isFeatured: isFeatured || false,
        publishedAt: isPublished && !existing.publishedAt ? new Date() : existing.publishedAt
      }
    })

    return NextResponse.json({ success: true, data: blog })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const admin = await checkAdmin()
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    await prisma.blogPost.delete({ where: { id: params.id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
