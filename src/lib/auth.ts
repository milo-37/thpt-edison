import { SignJWT, jwtVerify } from 'jose'
import { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'thpt-edison-default-secret'
)

// ==================== PASSWORD ====================

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// ==================== JWT ====================

export interface JWTPayload {
  id: string
  email: string
  name: string
  role: string
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .setIssuedAt()
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

// ==================== AUTH MIDDLEWARE ====================

export async function verifyAuth(request: NextRequest): Promise<JWTPayload | null> {
  // Lấy token từ cookie
  const token = request.cookies.get('auth-token')?.value
  if (!token) return null
  return verifyToken(token)
}

export function requireRole(user: JWTPayload | null, roles: string[]): boolean {
  if (!user) return false
  return roles.includes(user.role)
}

// ==================== RATE LIMITING ====================

const loginAttempts = new Map<string, { count: number; lastAttempt: number }>()

export function checkRateLimit(ip: string, maxAttempts = 5, windowMs = 60000): boolean {
  const now = Date.now()
  const attempt = loginAttempts.get(ip)
  
  if (!attempt || (now - attempt.lastAttempt > windowMs)) {
    loginAttempts.set(ip, { count: 1, lastAttempt: now })
    return true
  }
  
  if (attempt.count >= maxAttempts) {
    return false
  }
  
  attempt.count++
  attempt.lastAttempt = now
  return true
}

export function resetRateLimit(ip: string): void {
  loginAttempts.delete(ip)
}
