// Portfolio project video upload
import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const allowedTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only MP4, WebM, OGG, and MOV videos are allowed' }, { status: 400 })
    }

    // Increase size limit for videos (50MB)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 50MB' }, { status: 400 })
    }

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'portfolio-videos')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const ext = file.name.split('.').pop() || 'mp4'
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const filepath = path.join(uploadDir, filename)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filepath, buffer)

    // Return both static and API URLs for flexibility
    const staticUrl = `/uploads/portfolio-videos/${filename}`
    const apiUrl = `/api/v1/videos/portfolio/${filename}`

    console.log('Video uploaded successfully:', {
      filename,
      staticUrl,
      apiUrl,
      filepath,
      fileSize: buffer.length
    })

    // Use API route for serving videos (more reliable on cloud platforms)
    return NextResponse.json({ success: true, url: apiUrl, staticUrl })

  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
