// Logo upload to Cloudinary
import { NextRequest, NextResponse } from 'next/server'
import { ensureCloudinaryConfigured } from '@/lib/cloudinary'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'

async function checkAdmin(request: NextRequest) {
  let token: string | null = null

  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const extracted = authHeader.substring(7)
    if (extracted !== 'null' && extracted !== 'undefined') {
      token = extracted
    }
  }

  if (!token) {
    const cookieStore = cookies()
    token = cookieStore.get('rametech_token')?.value || null
  }

  if (!token) return null
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return null
  return payload
}

export async function POST(request: NextRequest) {
  try {
    const admin = await checkAdmin(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Only JPEG, PNG, GIF, WebP, and SVG images are allowed' }, { status: 400 })
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be under 5MB' }, { status: 400 })
    }

    console.log('Uploading logo to Cloudinary...')

    const cloudinary = ensureCloudinaryConfigured()

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64Data}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      folder: 'rametech/branding',
      use_filename: true,
      unique_filename: true,
      transformation: [
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    console.log('Logo uploaded to Cloudinary successfully:', result.secure_url)

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    })

  } catch (error: any) {
    console.error('Logo upload error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}