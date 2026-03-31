// Blog image upload to Cloudinary
import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'
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

    console.log('Uploading blog image to Cloudinary...')

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64Data}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      folder: 'rametech/blog/images',
      use_filename: true,
      unique_filename: true,
      transformation: [
        { width: 1200, height: 630, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    console.log('Blog image uploaded to Cloudinary successfully:', result.secure_url)

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    })

  } catch (error: any) {
    console.error('Blog upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
