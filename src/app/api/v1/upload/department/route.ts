// Department hero image upload to Cloudinary
import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

export async function POST(request: NextRequest) {
  try {
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

    console.log('Uploading department image to Cloudinary...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    })

    // Convert file to base64 for Cloudinary upload
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64Data}`

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'image',
      folder: 'rametech/departments',
      use_filename: true,
      unique_filename: true,
      transformation: [
        { width: 1920, height: 600, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    })

    console.log('Department image uploaded to Cloudinary successfully:', {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    })

    // Return Cloudinary URL
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height
    })

  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to upload image to Cloudinary',
      details: error.error?.message
    }, { status: 500 })
  }
}
