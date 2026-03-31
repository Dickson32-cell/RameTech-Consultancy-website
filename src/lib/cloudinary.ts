import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'db6oc5tr5',
  api_key: process.env.CLOUDINARY_API_KEY || '142962498917514',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'WmtX55SrLC1VOV7-6Yuq91mc5AI',
})

export default cloudinary
