import { getCurrentUser } from '@/server/functions/auth'
import { redirect, Outlet } from '@tanstack/react-router'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth')({
  loader: async ({ location }) => {
    let currentUser = null

    try {
      currentUser = await getCurrentUser()
    } catch {
      // Auth check failed - user is not logged in, which is fine for auth routes
      console.log('Auth check failed, user is guest')
    }

    if (currentUser && location.pathname !== '/sign-out') {
      throw redirect({ to: '/' })
    }

    return {
      currentUser,
    }
  },
  component: AuthLayout,
})

function AuthLayout() {
  return <Outlet />
}
