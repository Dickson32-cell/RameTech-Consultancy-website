import { v2 as cloudinary } from 'cloudinary'

// Function to parse CLOUDINARY_URL
function parseCloudinaryUrl(url: string) {
  try {
    // Format: cloudinary://api_key:api_secret@cloud_name
    const matches = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/)
    if (matches) {
      return {
        api_key: matches[1],
        api_secret: matches[2],
        cloud_name: matches[3],
      }
    }
  } catch (error) {
    console.error('Failed to parse CLOUDINARY_URL:', error)
  }
  return null
}

// Cloudinary configuration
let configData: any = { secure: true }

if (process.env.CLOUDINARY_URL) {
  // Parse and use CLOUDINARY_URL if available
  console.log('Configuring Cloudinary using CLOUDINARY_URL')
  const parsed = parseCloudinaryUrl(process.env.CLOUDINARY_URL)
  if (parsed) {
    configData = {
      cloud_name: parsed.cloud_name,
      api_key: parsed.api_key,
      api_secret: parsed.api_secret,
      secure: true,
    }
    console.log('Parsed CLOUDINARY_URL successfully')
  } else {
    console.error('Failed to parse CLOUDINARY_URL, falling back to individual variables')
  }
}

// Use individual environment variables if CLOUDINARY_URL wasn't used or failed to parse
if (!configData.cloud_name || !configData.api_key || !configData.api_secret) {
  console.log('Using individual Cloudinary environment variables')

  configData = {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  }

  // Validate
  if (!configData.cloud_name) {
    console.error('CLOUDINARY_CLOUD_NAME is not set')
  }
  if (!configData.api_key) {
    console.error('CLOUDINARY_API_KEY is not set')
  }
  if (!configData.api_secret) {
    console.error('CLOUDINARY_API_SECRET is not set')
  }
}

// Apply configuration
cloudinary.config(configData)

// Log configuration status (without exposing sensitive data)
console.log('Cloudinary configuration applied:', {
  cloud_name: configData.cloud_name || 'NOT SET',
  api_key: configData.api_key ? `${configData.api_key.substring(0, 4)}...` : 'NOT SET',
  api_secret: configData.api_secret ? 'SET' : 'NOT SET',
})

// Verify config was applied
const verifyConfig = cloudinary.config()
console.log('Cloudinary config verification:', {
  cloud_name: verifyConfig.cloud_name || 'NOT SET',
  api_key: verifyConfig.api_key ? 'SET' : 'NOT SET',
  api_secret: verifyConfig.api_secret ? 'SET' : 'NOT SET',
})

export default cloudinary
