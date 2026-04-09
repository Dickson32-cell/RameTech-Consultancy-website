import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import cloudinary from '@/lib/cloudinary'

const prisma = new PrismaClient()

// DELETE /api/v1/admin/academic-writing/document/[id] - Delete a document
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get document info
    const document = await prisma.academicWritingDocument.findUnique({
      where: { id: params.id }
    })

    if (!document) {
      return NextResponse.json(
        { success: false, error: 'Document not found' },
        { status: 404 }
      )
    }

    // Extract public_id from Cloudinary URL
    const urlParts = document.fileUrl.split('/')
    const publicIdWithExtension = urlParts[urlParts.length - 1]
    const publicId = `academic-writing/${publicIdWithExtension.split('.')[0]}`

    // Delete from Cloudinary
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: 'raw' })
    } catch (cloudinaryError) {
      console.error('Error deleting from Cloudinary:', cloudinaryError)
      // Continue with database deletion even if Cloudinary deletion fails
    }

    // Delete from database
    await prisma.academicWritingDocument.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting document:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete document' },
      { status: 500 }
    )
  }
}
