// Debug endpoint to check environment variables at runtime
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'Environment variables check',
    cloudinary: {
      CLOUDINARY_URL: process.env.CLOUDINARY_URL ? `SET (${process.env.CLOUDINARY_URL.substring(0, 20)}...)` : 'NOT SET',
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || 'NOT SET',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
    },
    nodeEnv: process.env.NODE_ENV,
    allCloudinaryKeys: Object.keys(process.env).filter(key => key.includes('CLOUDINARY'))
  })
}
