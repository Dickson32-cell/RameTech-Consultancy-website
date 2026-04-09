import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import cloudinary from '@/lib/cloudinary'

const prisma = new PrismaClient()

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
    console.log('Starting document upload...')

    const formData = await request.formData()
    const file = formData.get('file') as File
    const description = formData.get('description') as string

    console.log('File received:', file?.name, file?.size, file?.type)

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert file to base64 data URI
    console.log('Converting file to base64...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64Data}`
    console.log('Base64 conversion complete')

    // Upload to Cloudinary using data URI
    console.log('Uploading to Cloudinary...')
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      resource_type: 'raw', // For non-image files like Word docs
      folder: 'rametech/academic-writing',
      public_id: `price-list-${Date.now()}`,
      use_filename: true,
      unique_filename: true
    })

    console.log('Cloudinary upload success:', uploadResult.secure_url)

    console.log('Deactivating previous documents...')
    // Deactivate all previous documents
    await prisma.academicWritingDocument.updateMany({
      where: { isActive: true },
      data: { isActive: false }
    })

    console.log('Saving document to database...')
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

    console.log('Document saved successfully:', document.id)

    return NextResponse.json({
      success: true,
      data: document,
      message: 'Document uploaded successfully'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error uploading document:', error)

    // Return detailed error message
    let errorMessage = 'Failed to upload document'
    if (error.message) {
      errorMessage += ': ' + error.message
    }

    return NextResponse.json(
      { success: false, error: errorMessage, details: error.toString() },
      { status: 500 }
    )
  }
}
