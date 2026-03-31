// Team member photo upload to Cloudinary
import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const existingUrl = formData.get('existingUrl') as string | null

    // If no file uploaded, return existing URL or empty
    if (!file || file.size === 0) {
      return NextResponse.json({ success: true, url: existingUrl || '' })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Only JPEG, PNG, GIF, and WebP images are allowed' }, { status: 400 })
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be under 5MB' }, { status: 400 })
    }

    console.log('Uploading team photo to Cloudinary...')

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64Data}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      folder: 'rametech/team/photos',
      use_filename: true,
      unique_filename: true,
      transformation: [
        { width: 800, height: 800, crop: 'limit', gravity: 'face' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    console.log('Team photo uploaded to Cloudinary successfully:', result.secure_url)

    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id
    })

  } catch (error: any) {
    console.error('Team upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
