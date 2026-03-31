// Dynamic image serving route
import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const imagePath = params.path.join('/')
    const filepath = path.join(process.cwd(), 'public', 'uploads', imagePath)

    // Check if file exists
    if (!existsSync(filepath)) {
      console.log('Image not found:', filepath)
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    // Read the file
    const fileBuffer = await readFile(filepath)

    // Determine content type based on extension
    const ext = path.extname(filepath).toLowerCase()
    const contentTypeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
    }
    const contentType = contentTypeMap[ext] || 'application/octet-stream'

    // Return the image with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving image:', error)
    return NextResponse.json({ error: 'Error serving image' }, { status: 500 })
  }
}
