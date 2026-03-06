// src/lib/auth.ts
// Authentication utilities with JWT

import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
const COOKIE_NAME = 'rametech_token'

export interface TokenPayload {
  userId: string
  email: string
  role: 'client' | 'admin'
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Generate JWT token
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

// Verify JWT token
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
  } catch {
    return null
  }
}

// Set auth cookie
export function setAuthCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  })
}

// Remove auth cookie
export function removeAuthCookie() {
  cookies().delete(COOKIE_NAME)
}

// Get current user from cookie
export function getCurrentUser(): TokenPayload | null {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

// Check if user is admin
export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === 'admin'
}

export { successResponse, errorResponse } from './api-response'

