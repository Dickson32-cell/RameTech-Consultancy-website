// Admin authentication middleware
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'
import prisma from './db'

export interface AdminUser {
  userId: string
  email: string
  role: 'admin' | 'client'
}

export async function getAdminUser(req: NextRequest): Promise<AdminUser | null> {
  const token = req.cookies.get('rametech_token')?.value
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null
  if (payload.role !== 'admin') return null

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role as 'admin' | 'client'
  }
}

export function unauthorizedResponse() {
  return NextResponse.json(
    { error: 'Unauthorized. Admin access required.' },
    { status: 401 }
  )
}

export function notFoundResponse(message = 'Not found') {
  return NextResponse.json(
    { error: message },
    { status: 404 }
  )
}

export function badRequestResponse(message = 'Bad request') {
  return NextResponse.json(
    { error: message },
    { status: 400 }
  )
}

export function serverErrorResponse(message = 'Internal server error') {
  return NextResponse.json(
    { error: message },
    { status: 500 }
  )
}
