// Flyer upload to Cloudinary (admin-only) — flyers 1-4 for the homepage wordmark section
import { NextRequest, NextResponse } from 'next/server'
import { ensureCloudinaryConfigured } from '@/lib/cloudinary'
import { verifyToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import prisma from '@/lib/db'

async function checkAdmin(request: NextRequest) {
  let token: string | null = null

  const authHeader = request.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const extracted = authHeader.substring(7)
    if (extracted !== 'null' && extracted !== 'undefined') {
      token = extracted
    }
  }

  if (!token) {
    const cookieStore = cookies()
    token = cookieStore.get('rametech_token')?.value || null
  }

  if (!token) return null
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') return null
  return payload
}

export async function POST(request: NextRequest) {
  try {
    const admin = await checkAdmin(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const slot = formData.get('slot') as string | null // "1" | "2" | "3" | "4"

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    const slotNum = parseInt(slot || '1', 10)
    if (!slotNum || slotNum < 1 || slotNum > 4) {
      return NextResponse.json({ success: false, error: 'Invalid flyer slot (1-4)' }, { status: 400 })
    }

    // Flyers are images or PDFs
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Only JPEG, PNG, WebP images or PDF files are allowed' }, { status: 400 })
    }

    // Max 10MB for flyers (they're full-page graphics)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be under 10MB' }, { status: 400 })
    }

    console.log(`Uploading flyer ${slotNum} to Cloudinary...`)

    const cloudinary = ensureCloudinaryConfigured()

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64Data}`

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'ramedic/flyers',
          resource_type: file.type === 'application/pdf' ? 'image' : 'auto', // Cloudinary converts PDF pages to images
          public_id: `flyer-${slotNum}-${Date.now()}`,
          overwrite: true,
          invalidate: true,
        },
        (error, uploadResult) => {
          if (error) reject(error)
          else resolve(uploadResult)
        }
      )
    })

    const url = (result as { secure_url?: string })?.secure_url
    if (!url) {
      return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 })
    }

    // Persist to the matching SiteSettings column
    const field = `flyer${slotNum}Url` as 'flyer1Url' | 'flyer2Url' | 'flyer3Url' | 'flyer4Url'
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: { [field]: url },
      create: { id: 'default', [field]: url },
    })

    return NextResponse.json({ success: true, data: { url, slot: slotNum } })
  } catch (error) {
    console.error('Flyer upload error:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload flyer' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await checkAdmin(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const slotNum = parseInt(searchParams.get('slot') || '0', 10)
    if (!slotNum || slotNum < 1 || slotNum > 4) {
      return NextResponse.json({ success: false, error: 'Invalid flyer slot' }, { status: 400 })
    }

    const field = `flyer${slotNum}Url` as 'flyer1Url' | 'flyer2Url' | 'flyer3Url' | 'flyer4Url'
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: { [field]: null },
      create: { id: 'default' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Flyer delete error:', error)
    return NextResponse.json({ success: false, error: 'Failed to remove flyer' }, { status: 500 })
  }
}