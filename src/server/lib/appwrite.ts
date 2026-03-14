/**
 * Auth helpers — replaces Appwrite Client/Account/Users with JWT + bcrypt.
 * Only import in server-side code.
 */

import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not set')
  }
  return new TextEncoder().encode(secret)
}

/** Hash a password with bcrypt */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/** Compare a plain password against a hash */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/** Create a signed JWT token */
export async function createToken(payload: {
  sub: string
  email: string
}): Promise<string> {
  const secret = getJwtSecret()
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret)
}

/** Verify and decode a JWT token. Returns null if invalid/expired. */
export async function verifyToken(
  token: string,
): Promise<{ sub: string; email: string } | null> {
  try {
    const secret = getJwtSecret()
    const { payload } = await jwtVerify(token, secret)
    if (typeof payload.sub === 'string' && typeof payload.email === 'string') {
      return { sub: payload.sub, email: payload.email }
    }
    return null
  } catch {
    return null
  }
}
