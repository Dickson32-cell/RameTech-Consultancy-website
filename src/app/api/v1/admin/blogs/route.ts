// src/app/api/v1/admin/blogs/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import prisma from '@/lib/db'
import { verifyToken } from '@/lib/auth'

async function checkAdmin(request?: NextRequest) {
  try {
    let token: string | null = null

    // Try to get token from Authorization header first
    if (request) {
      const authHeader = request.headers.get('authorization')
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7)
        console.log('🔐 Auth: Using token from Authorization header')
      }
    }

    // If no header token, try cookie
    if (!token) {
      const cookieStore = await import('next/headers').then(m => m.cookies())
      token = cookieStore.get('rametech_token')?.value || null
      console.log('🔐 Auth: Checking cookie for token')
    }

    console.log('🔐 Auth check:', {
      hasToken: !!token,
      tokenSource: token ? (request?.headers.get('authorization') ? 'header' : 'cookie') : 'none',
      tokenPreview: token ? token.substring(0, 20) + '...' : 'NO TOKEN'
    })

    if (!token) {
      console.log('❌ No token found in cookies or headers')
      return null
    }

    const payload = verifyToken(token)

    if (!payload) {
      console.log('❌ Token verification failed')
      return null
    }

    if (payload.role !== 'admin') {
      console.log('❌ User is not admin, role:', payload.role)
      return null
    }

    console.log('✅ Admin authenticated:', payload.email)
    return payload
  } catch (error) {
    console.error('❌ Auth check error:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await checkAdmin(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const blogs = await prisma.blogPost.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json({ success: true, data: blogs })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await checkAdmin(request)
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

    console.log('✅ Blog post created:', blog.id, blog.title)

    // Revalidate blog pages
    try {
      revalidatePath('/blog')
      revalidatePath('/api/v1/blogs')
      revalidatePath('/')
      console.log('✅ Cache revalidated for blog pages')
    } catch (revalidateError) {
      console.error('Warning: Failed to revalidate cache:', revalidateError)
    }

    return NextResponse.json({ success: true, data: blog }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
