// Test endpoint to verify Cloudinary environment variables
import { NextRequest, NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function GET(request: NextRequest) {
  // Try to configure Cloudinary and test it
  let configTest = 'Not attempted'
  let uploadTest = 'Not attempted'

  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    })
    configTest = 'Success'

    // Try a simple API call to test credentials
    try {
      await cloudinary.api.ping()
      uploadTest = 'Credentials valid - API ping successful'
    } catch (pingError: any) {
      uploadTest = `Credentials invalid: ${pingError.message}`
    }
  } catch (error: any) {
    configTest = `Failed: ${error.message}`
  }

  return NextResponse.json({
    envVars: {
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? `SET (${process.env.CLOUDINARY_API_KEY?.substring(0, 4)}...)` : 'NOT SET',
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET (hidden)' : 'NOT SET',
    },
    tests: {
      configTest,
      uploadTest
    },
    allEnvKeys: Object.keys(process.env).filter(key => key.includes('CLOUDINARY'))
  })
}
