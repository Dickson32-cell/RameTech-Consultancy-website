import { NextRequest, NextResponse } from 'next/server'
import { ensureCloudinaryConfigured } from '@/lib/cloudinary'
import { successResponse, errorResponse } from '@/lib/api-response'

// POST /api/v1/admin/upload/document - Upload new document
export async function POST(request: NextRequest) {
    console.log('=== BUSINESS REGISTRATION UPLOAD STARTED ===')

    try {
        // Parse form data
        const formData = await request.formData()
        const file = formData.get('file') as File

        // Validation
        if (!file) {
            return NextResponse.json(
                errorResponse('No file provided'),
                { status: 400 }
            )
        }

        // Validate file type
        const validTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
            'application/msword', // .doc
            'image/jpeg',
            'image/png'
        ]

        if (!validTypes.includes(file.type)) {
            return NextResponse.json(
                errorResponse(`Invalid file type. Please upload a PDF, Word document, or Image. Received: ${file.type}`),
                { status: 400 }
            )
        }

        // Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (file.size > maxSize) {
            return NextResponse.json(
                errorResponse(`File too large. Maximum size is 10MB. Your file: ${(file.size / 1024 / 1024).toFixed(2)}MB`),
                { status: 400 }
            )
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64Data = buffer.toString('base64')
        const dataURI = `data:${file.type};base64,${base64Data}`

        // Upload to Cloudinary
        let uploadResult
        try {
            const cloudinary = ensureCloudinaryConfigured()
            uploadResult = await cloudinary.uploader.upload(dataURI, {
                resource_type: 'auto', // Auto handles images, raw handles docs
                folder: 'rametech/business-registration',
                public_id: `business-registration-${Date.now()}`,
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

        console.log('=== BUSINESS REGISTRATION UPLOAD COMPLETED SUCCESSFULLY ===')

        return NextResponse.json(
            successResponse({ url: uploadResult.secure_url }),
            { status: 201 }
        )

    } catch (error: any) {
        console.error('=== BUSINESS REGISTRATION UPLOAD FAILED ===')
        console.error('Error details:', error)

        return NextResponse.json(
            errorResponse(`Upload failed: ${error.message || 'Unknown error occurred'}`),
            { status: 500 }
        )
    }
}
