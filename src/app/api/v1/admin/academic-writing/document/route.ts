import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import cloudinary from '@/lib/cloudinary'
import { successResponse, errorResponse } from '@/lib/api-response'

// GET /api/v1/admin/academic-writing/document - Get all documents
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching academic writing documents...')

    const documents = await prisma.academicWritingDocument.findMany({
      orderBy: { createdAt: 'desc' }
    })

    console.log(`Found ${documents.length} documents`)

    return NextResponse.json(successResponse(documents))
  } catch (error: any) {
    console.error('Error fetching documents:', error)

    // Check if it's a table not found error
    if (error.message?.includes('does not exist')) {
      return NextResponse.json(
        errorResponse('Database tables not created yet. Please run: npm run db:push in Render shell'),
        { status: 500 }
      )
    }

    return NextResponse.json(
      errorResponse(`Failed to fetch documents: ${error.message || 'Unknown error'}`),
      { status: 500 }
    )
  }
}

// POST /api/v1/admin/academic-writing/document - Upload new document
export async function POST(request: NextRequest) {
  console.log('=== DOCUMENT UPLOAD STARTED ===')

  try {
    // Parse form data
    console.log('Step 1: Parsing form data...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    const description = formData.get('description') as string

    console.log('File info:', {
      name: file?.name,
      size: file?.size,
      type: file?.type
    })

    // Validation
    if (!file) {
      console.error('No file provided in request')
      return NextResponse.json(
        errorResponse('No file provided'),
        { status: 400 }
      )
    }

    // Validate file type
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/msword' // .doc
    ]

    if (!validTypes.includes(file.type)) {
      console.error('Invalid file type:', file.type)
      return NextResponse.json(
        errorResponse(`Invalid file type. Please upload a Word document (.doc or .docx). Received: ${file.type}`),
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      console.error('File too large:', file.size)
      return NextResponse.json(
        errorResponse(`File too large. Maximum size is 10MB. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB`),
        { status: 400 }
      )
    }

    // Convert file to base64
    console.log('Step 2: Converting file to base64...')
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64Data}`
    console.log('Conversion complete. Base64 length:', base64Data.length)

    // Upload to Cloudinary
    console.log('Step 3: Uploading to Cloudinary...')
    let uploadResult
    try {
      uploadResult = await cloudinary.uploader.upload(dataURI, {
        resource_type: 'raw',
        folder: 'rametech/academic-writing',
        public_id: `price-list-${Date.now()}`,
        use_filename: false,
        unique_filename: true
      })
      console.log('Cloudinary upload successful:', uploadResult.secure_url)
    } catch (cloudinaryError: any) {
      console.error('Cloudinary upload failed:', cloudinaryError)
      return NextResponse.json(
        errorResponse(`Cloudinary upload failed: ${cloudinaryError.message || 'Unknown error'}`),
        { status: 500 }
      )
    }

    // Deactivate previous documents
    console.log('Step 4: Deactivating previous documents...')
    try {
      await prisma.academicWritingDocument.updateMany({
        where: { isActive: true },
        data: { isActive: false }
      })
      console.log('Previous documents deactivated')
    } catch (dbError: any) {
      console.error('Failed to deactivate previous documents:', dbError)
      // Continue anyway - not critical
    }

    // Save to database
    console.log('Step 5: Saving document to database...')
    let document
    try {
      document = await prisma.academicWritingDocument.create({
        data: {
          fileName: file.name,
          fileUrl: uploadResult.secure_url,
          fileSize: file.size,
          description: description || null,
          isActive: true
        }
      })
      console.log('Document saved to database:', document.id)
    } catch (dbError: any) {
      console.error('Database save failed:', dbError)
      return NextResponse.json(
        errorResponse(`Database error: ${dbError.message || 'Failed to save document info'}`),
        { status: 500 }
      )
    }

    console.log('=== DOCUMENT UPLOAD COMPLETED SUCCESSFULLY ===')

    return NextResponse.json(
      successResponse(document),
      { status: 201 }
    )

  } catch (error: any) {
    console.error('=== DOCUMENT UPLOAD FAILED ===')
    console.error('Error details:', error)
    console.error('Error stack:', error.stack)

    return NextResponse.json(
      errorResponse(`Upload failed: ${error.message || 'Unknown error occurred'}`),
      { status: 500 }
    )
  }
}
