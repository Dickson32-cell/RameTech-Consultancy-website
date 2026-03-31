// Portfolio project video upload to Cloudinary
import { NextRequest, NextResponse } from 'next/server'
import cloudinary from '@/lib/cloudinary'

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

    console.log('Uploading video to Cloudinary...', {
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
      resource_type: 'video',
      folder: 'rametech/portfolio/videos',
      use_filename: true,
      unique_filename: true,
    })

    console.log('Video uploaded to Cloudinary successfully:', {
      publicId: result.public_id,
      url: result.secure_url,
      format: result.format,
      duration: result.duration,
      bytes: result.bytes
    })

    // Return Cloudinary URL
    return NextResponse.json({
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      format: result.format,
      duration: result.duration
    })

  } catch (error: any) {
    console.error('Cloudinary upload error:', error)
    return NextResponse.json({
      error: error.message || 'Failed to upload video to Cloudinary',
      details: error.error?.message
    }, { status: 500 })
  }
}
