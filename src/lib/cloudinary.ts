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

// Function to get Cloudinary configuration
export function getCloudinaryConfig() {
  let configData: any = { secure: true }

  console.log('Getting Cloudinary configuration...')
  console.log('Environment check:', {
    CLOUDINARY_URL: process.env.CLOUDINARY_URL ? 'SET' : 'NOT SET',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || 'NOT SET',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? 'SET' : 'NOT SET',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? 'SET' : 'NOT SET',
  })

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
      console.log('Parsed CLOUDINARY_URL successfully:', {
        cloud_name: parsed.cloud_name,
        api_key: parsed.api_key?.substring(0, 4) + '...',
      })
    } else {
      console.error('Failed to parse CLOUDINARY_URL, falling back to individual variables')
    }
  }

  // Use individual environment variables if CLOUDINARY_URL wasn't used or failed to parse
  if (!configData.cloud_name || !configData.api_key || !configData.api_secret) {
    console.log('Using individual Cloudinary environment variables')

    configData = {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'db6oc5tr5',
      api_key: process.env.CLOUDINARY_API_KEY || '142962498917514',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'WmtX55SrLC1VOV7-6Yuq91mc5AI',
      secure: true,
    }

    // Validate and warn if using fallback
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      console.warn('⚠️  CLOUDINARY_CLOUD_NAME not set, using fallback value')
    }
    if (!process.env.CLOUDINARY_API_KEY) {
      console.warn('⚠️  CLOUDINARY_API_KEY not set, using fallback value')
    }
    if (!process.env.CLOUDINARY_API_SECRET) {
      console.warn('⚠️  CLOUDINARY_API_SECRET not set, using fallback value')
    }
  }

  return configData
}

// Function to ensure Cloudinary is configured
export function ensureCloudinaryConfigured() {
  const config = getCloudinaryConfig()
  cloudinary.config(config)

  console.log('Cloudinary configured with:', {
    cloud_name: config.cloud_name || 'NOT SET',
    api_key: config.api_key ? `${config.api_key.substring(0, 4)}...` : 'NOT SET',
    api_secret: config.api_secret ? 'SET' : 'NOT SET',
  })

  return cloudinary
}

// Export the cloudinary instance
export default cloudinary
