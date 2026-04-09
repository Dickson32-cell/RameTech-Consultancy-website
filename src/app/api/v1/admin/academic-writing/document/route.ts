import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { v2 as cloudinary } from 'cloudinary'

const prisma = new PrismaClient()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// GET /api/v1/admin/academic-writing/document - Get all documents
export async function GET(request: NextRequest) {
  try {
    const documents = await prisma.academicWritingDocument.findMany({
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: documents
    })
  } catch (error) {
    console.error('Error fetching documents:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch documents' },
      { status: 500 }
    )
  }
}

// POST /api/v1/admin/academic-writing/document - Upload new document
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const description = formData.get('description') as string

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'academic-writing',
          resource_type: 'raw', // For non-image files like Word docs
          public_id: `price-list-${Date.now()}`
        },
        (error, result) => {
          if (error) reject(error)
          else resolve(result)
        }
      )
      uploadStream.end(buffer)
    })

    // Deactivate all previous documents
    await prisma.academicWritingDocument.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    // Save document info to database
    const document = await prisma.academicWritingDocument.create({
      data: {
        fileName: file.name,
        fileUrl: uploadResult.secure_url,
        fileSize: file.size,
        description: description || null,
        isActive: true
      }
    })

    return NextResponse.json({
      success: true,
      data: document,
      message: 'Document uploaded successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('Error uploading document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to upload document' },
      { status: 500 }
    )
  }
}
