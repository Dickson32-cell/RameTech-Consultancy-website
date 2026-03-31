// Dynamic video serving route
import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import path from 'path'
import { existsSync } from 'fs'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params
    const videoPath = resolvedParams.path.join('/')
    const filepath = path.join(process.cwd(), 'public', 'uploads', 'portfolio-videos', videoPath)

    console.log('Video request:', {
      videoPath,
      filepath,
      exists: existsSync(filepath)
    })

    // Check if file exists
    if (!existsSync(filepath)) {
      console.error('Video not found:', filepath)
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    // Get file stats
    const fileStats = await stat(filepath)
    const fileSize = fileStats.size

    // Handle range requests for video streaming
    const range = request.headers.get('range')

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-')
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunkSize = (end - start) + 1

      // Read the file chunk
      const fileBuffer = await readFile(filepath)
      const chunk = fileBuffer.slice(start, end + 1)

      // Determine content type based on extension
      const ext = path.extname(filepath).toLowerCase()
      const contentTypeMap: Record<string, string> = {
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.ogg': 'video/ogg',
        '.mov': 'video/quicktime',
      }
      const contentType = contentTypeMap[ext] || 'video/mp4'

      // Return partial content
      return new NextResponse(chunk, {
        status: 206,
        headers: {
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'Accept-Ranges': 'bytes',
          'Content-Length': chunkSize.toString(),
          'Content-Type': contentType,
        },
      })
    }

    // If no range request, return the entire file
    const fileBuffer = await readFile(filepath)

    // Determine content type based on extension
    const ext = path.extname(filepath).toLowerCase()
    const contentTypeMap: Record<string, string> = {
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.mov': 'video/quicktime',
    }
    const contentType = contentTypeMap[ext] || 'video/mp4'

    // Return the video with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': fileSize.toString(),
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Error serving video:', error)
    return NextResponse.json({ error: 'Error serving video' }, { status: 500 })
  }
}
