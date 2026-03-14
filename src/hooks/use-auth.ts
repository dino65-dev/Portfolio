import { signOutFn } from '@/server/functions/auth'
import { useLoaderData } from '@tanstack/react-router'
import { useServerFn } from '@tanstack/react-start'
import type { AuthUser } from '@/server/lib/appwrite.types'

export function useAuth() {
  const { currentUser } = useLoaderData({ from: '__root__' }) as {
    currentUser: AuthUser | null
  }
  const signOut = useServerFn(signOutFn)

  return {
    currentUser,
    signOut,
  }
}
