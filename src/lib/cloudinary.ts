import { v2 as cloudinary } from 'cloudinary'

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

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

console.log('Cloudinary configured with cloud_name:', process.env.CLOUDINARY_CLOUD_NAME)

export default cloudinary
