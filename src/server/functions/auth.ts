import { createServerFn } from '@tanstack/react-start'
import z from 'zod'
import { redirect } from '@tanstack/react-router'
import {
  hashPassword,
  verifyPassword,
  createToken,
  verifyToken,
} from '../lib/appwrite'
import { db } from '../lib/db'
import {
  deleteCookie,
  getCookie,
  setCookie,
  setResponseStatus,
} from '@tanstack/react-start/server'
import type { AuthUser } from '../lib/appwrite.types'

const AUTH_COOKIE = 'auth-token'

export const getAppwriteSessionFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const token = getCookie(AUTH_COOKIE)
    if (!token) return null
    return token
  },
)

export const setAppwriteSessionCookiesFn = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    setCookie(AUTH_COOKIE, data.token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
  })

const signUpInSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  redirect: z.string().optional(),
})

export const signUpFn = createServerFn({ method: 'POST' })
  .inputValidator(signUpInSchema)
  .handler(async ({ data }) => {
    const { email, password, redirect: redirectUrl } = data

    try {
      // Check if user already exists
      const existing = await db.users.findByEmail(email.toLowerCase())
      if (existing) {
        setResponseStatus(409)
        throw { message: 'A user with this email already exists', status: 409 }
      }

      // Create user
      const passwordHash = await hashPassword(password)
      const user = await db.users.create({
        email: email.toLowerCase(),
        passwordHash,
      })

      // Create JWT and set cookie
      const token = await createToken({ sub: user.id, email: user.email })
      await setAppwriteSessionCookiesFn({ data: { token } })
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        'status' in error
      ) {
        throw error
      }
      setResponseStatus(500)
      throw { message: 'Failed to create account', status: 500 }
    }

    if (redirectUrl) {
      throw redirect({ to: redirectUrl })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signInFn = createServerFn({ method: 'POST' })
  .inputValidator(signUpInSchema)
  .handler(async ({ data }) => {
    const { email, password, redirect: redirectUrl } = data

    try {
      // Find user
      const user = await db.users.findByEmail(email.toLowerCase())
      if (!user) {
        setResponseStatus(401)
        throw { message: 'Invalid email or password', status: 401 }
      }

      // Verify password
      const valid = await verifyPassword(password, user.passwordHash)
      if (!valid) {
        setResponseStatus(401)
        throw { message: 'Invalid email or password', status: 401 }
      }

      // Create JWT and set cookie
      const token = await createToken({ sub: user.id, email: user.email })
      await setAppwriteSessionCookiesFn({ data: { token } })
    } catch (error) {
      if (
        error &&
        typeof error === 'object' &&
        'message' in error &&
        'status' in error
      ) {
        throw error
      }
      setResponseStatus(500)
      throw { message: 'Failed to sign in', status: 500 }
    }

    if (redirectUrl) {
      throw redirect({ to: redirectUrl })
    } else {
      throw redirect({ to: '/' })
    }
  })

export const signOutFn = createServerFn({ method: 'POST' }).handler(
  async () => {
    deleteCookie(AUTH_COOKIE)
    // Also clean up legacy Appwrite cookies if present
    deleteCookie('appwrite-session-secret')
    deleteCookie('appwrite-session-id')
  },
)

export const authMiddleware = createServerFn({ method: 'GET' }).handler(
  async () => {
    const currentUser = await getCurrentUser()
    return { currentUser }
  },
)

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(
  async (): Promise<AuthUser | null> => {
    const token = await getAppwriteSessionFn()
    if (!token) return null

    const payload = await verifyToken(token)
    if (!payload) return null

    // Look up user in DB to ensure they still exist
    const user = await db.users.findById(payload.sub)
    if (!user) return null

    return {
      $id: user.id,
      email: user.email,
      name: user.name ?? undefined,
    }
  },
)
