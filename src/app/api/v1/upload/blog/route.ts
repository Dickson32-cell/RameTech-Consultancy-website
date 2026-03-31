// Blog image upload
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await import('next/headers').then(m => m.cookies())
    const token = cookieStore.get('rametech_token')?.value
    const payload = token ? verifyToken(token) : null
    if (!payload || payload.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, GIF, and WebP images are allowed' }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'blog')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const ext = file.name.split('.').pop() || 'jpg'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filepath = path.join(uploadDir, filename)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return both static and API URLs for flexibility
    const staticUrl = `/uploads/blog/${filename}`
    const apiUrl = `/api/v1/images/blog/${filename}`

    console.log('Blog image uploaded successfully:', {
      filename,
      staticUrl,
      apiUrl,
      filepath,
      fileSize: buffer.length
    })

    // Use API route for serving images (more reliable on cloud platforms)
    return NextResponse.json({ success: true, url: apiUrl, staticUrl })

  } catch (error: any) {
    console.error('Blog upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
