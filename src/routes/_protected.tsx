import { redirect, Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'
import { authMiddleware } from '@/server/functions/auth'

export const Route = createFileRoute('/_protected')({
  loader: async ({ location }) => {
    let currentUser = null

    try {
      const result = await authMiddleware()
      currentUser = result.currentUser
    } catch {
      // Auth failed - redirect to sign-in
      console.log('Auth check failed, redirecting to sign-in')
    }

    if (!currentUser) {
      if (
        location.pathname !== '/sign-in' &&
        location.pathname !== '/sign-up'
      ) {
        throw redirect({ to: '/sign-in', search: { redirect: location.href } })
      }
    }

    return {
      currentUser,
    }
  },
  component: ProtectedLayout,
})

function ProtectedLayout() {
  return <Outlet />
}
