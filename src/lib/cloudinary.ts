import { v2 as cloudinary } from 'cloudinary'

// Cloudinary can be configured using CLOUDINARY_URL or individual environment variables
// CLOUDINARY_URL takes precedence if available

if (process.env.CLOUDINARY_URL) {
  // Use CLOUDINARY_URL if available (format: cloudinary://api_key:api_secret@cloud_name)
  console.log('Configuring Cloudinary using CLOUDINARY_URL')
  cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL,
    secure: true,
  })
} else {
  // Fallback to individual environment variables
  console.log('Configuring Cloudinary using individual environment variables')

  // Validate environment variables
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('CLOUDINARY_CLOUD_NAME is not set in environment variables')
  }
  if (!process.env.CLOUDINARY_API_KEY) {
    console.error('CLOUDINARY_API_KEY is not set in environment variables')
  }
  if (!process.env.CLOUDINARY_API_SECRET) {
    console.error('CLOUDINARY_API_SECRET is not set in environment variables')
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

// Log configuration status (without exposing sensitive data)
const config = cloudinary.config()
console.log('Cloudinary configuration status:', {
  cloud_name: config.cloud_name || 'NOT SET',
  api_key: config.api_key ? 'SET' : 'NOT SET',
  api_secret: config.api_secret ? 'SET' : 'NOT SET',
})

export default cloudinary
