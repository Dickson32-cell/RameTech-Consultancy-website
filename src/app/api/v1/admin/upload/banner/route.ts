// Banner background image upload to Cloudinary (admin-only)
// targets: "quote" -> quoteBgUrl, "statement" -> statementBgUrl (homepage section backgrounds)
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
    const target = formData.get('target') as string | null // "quote" | "statement"

    if (!file || file.size === 0) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 })
    }

    if (target !== 'quote' && target !== 'statement') {
      return NextResponse.json({ success: false, error: 'Invalid target (quote | statement)' }, { status: 400 })
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ success: false, error: 'Only JPEG, PNG, WebP images are allowed' }, { status: 400 })
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File size must be under 10MB' }, { status: 400 })
    }

    const cloudinary = ensureCloudinaryConfigured()

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64Data = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64Data}`

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        dataURI,
        {
          folder: 'ramedic/banners',
          resource_type: 'image',
          public_id: `${target}-bg-${Date.now()}`,
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

    const field = target === 'quote' ? 'quoteBgUrl' : 'statementBgUrl'
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: { [field]: url },
      create: { id: 'default', [field]: url },
    })

    return NextResponse.json({ success: true, data: { url, target } })
  } catch (error) {
    console.error('Banner upload error:', error)
    return NextResponse.json({ success: false, error: 'Failed to upload banner' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await checkAdmin(request)
    if (!admin) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const target = searchParams.get('target')
    if (target !== 'quote' && target !== 'statement') {
      return NextResponse.json({ success: false, error: 'Invalid target' }, { status: 400 })
    }

    const field = target === 'quote' ? 'quoteBgUrl' : 'statementBgUrl'
    await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: { [field]: null },
      create: { id: 'default' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Banner delete error:', error)
    return NextResponse.json({ success: false, error: 'Failed to remove banner' }, { status: 500 })
  }
}