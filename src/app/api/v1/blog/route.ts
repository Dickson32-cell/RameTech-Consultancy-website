// src/app/api/v1/blog/route.ts
// GET /api/v1/blog - Get all blog posts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { successResponse, errorResponse, paginatedResponse } from '@/lib/api-response'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured') === 'true'

    const where = {
      ...(category && { category }),
      ...(featured && { isFeatured: true }),
      isPublished: true
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.blogPost.count({ where })
    ])

    return NextResponse.json(paginatedResponse(posts, page, limit, total))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(errorResponse('Failed to fetch blog posts'), { status: 500 })
  }
}
