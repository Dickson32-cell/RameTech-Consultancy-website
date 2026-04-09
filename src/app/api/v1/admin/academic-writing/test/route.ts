import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import cloudinary from '@/lib/cloudinary'

// GET /api/v1/admin/academic-writing/test - Test configuration
export async function GET(request: NextRequest) {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    checks: {}
  }

  try {
    // Check 1: Database connection
    console.log('Testing database connection...')
    try {
      await prisma.$connect()
      const count = await prisma.academicWritingDocument.count()
      diagnostics.checks.database = {
        status: 'OK',
        message: 'Database connected',
        documentCount: count
      }
    } catch (dbError: any) {
      diagnostics.checks.database = {
        status: 'FAILED',
        error: dbError.message
      }
    }

    // Check 2: Cloudinary configuration
    console.log('Testing Cloudinary configuration...')
    diagnostics.checks.cloudinary = {
      configured: !!(cloudinary.config().cloud_name && cloudinary.config().api_key),
      cloud_name: cloudinary.config().cloud_name || 'NOT SET',
      api_key_exists: !!cloudinary.config().api_key,
      api_secret_exists: !!cloudinary.config().api_secret
    }

    // Check 3: Test small upload to Cloudinary
    console.log('Testing Cloudinary upload...')
    try {
      const testData = 'data:text/plain;base64,VGVzdCBmaWxl' // "Test file" in base64
      const testResult = await cloudinary.uploader.upload(testData, {
        resource_type: 'raw',
        folder: 'rametech/academic-writing/test',
        public_id: `test-${Date.now()}`
      })

      diagnostics.checks.cloudinaryUpload = {
        status: 'OK',
        testUrl: testResult.secure_url
      }

      // Clean up test file
      try {
        await cloudinary.uploader.destroy(testResult.public_id, { resource_type: 'raw' })
      } catch (e) {
        // Ignore cleanup errors
      }
    } catch (uploadError: any) {
      diagnostics.checks.cloudinaryUpload = {
        status: 'FAILED',
        error: uploadError.message
      }
    }

    // Overall status
    const allOk = Object.values(diagnostics.checks).every(
      (check: any) => check.status !== 'FAILED'
    )

    return NextResponse.json({
      success: allOk,
      diagnostics,
      message: allOk
        ? 'All systems operational'
        : 'Some systems have issues - check diagnostics for details'
    })
  } catch (error: any) {
    console.error('Diagnostic test error:', error)
    return NextResponse.json({
      success: false,
      diagnostics,
      error: error.message
    }, { status: 500 })
  }
}
