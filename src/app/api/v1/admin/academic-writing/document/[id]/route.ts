import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import cloudinary from '@/lib/cloudinary'
import { successResponse, errorResponse } from '@/lib/api-response'

// DELETE /api/v1/admin/academic-writing/document/[id] - Delete a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('Deleting document:', params.id)

    // Get document info
    const document = await prisma.academicWritingDocument.findUnique({
      where: { id: params.id }
    })

    if (!document) {
      return NextResponse.json(
        errorResponse('Document not found'),
        { status: 404 }
      )
    }

    // Extract public_id from Cloudinary URL for deletion
    try {
      const urlParts = document.fileUrl.split('/')
      const fileName = urlParts[urlParts.length - 1]
      const publicId = `rametech/academic-writing/${fileName.split('.')[0]}`

      console.log('Deleting from Cloudinary:', publicId)
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
      console.log('Cloudinary deletion successful')
    } catch (cloudinaryError: any) {
      console.error('Cloudinary deletion failed:', cloudinaryError)
      // Continue with database deletion even if Cloudinary fails
    }

    // Delete from database
    await prisma.academicWritingDocument.delete({
      where: { id: params.id }
    })

    console.log('Document deleted successfully')

    return NextResponse.json(
      successResponse({ message: 'Document deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      errorResponse(`Delete failed: ${error.message || 'Unknown error'}`),
      { status: 500 }
    )
  }
}
