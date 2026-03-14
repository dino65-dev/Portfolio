import { createFileRoute, Outlet } from '@tanstack/react-router'
import { authMiddleware } from '@/server/functions/auth'

export const Route = createFileRoute('/_public')({
  loader: async () => {
    try {
      const { currentUser } = await authMiddleware()
      return { currentUser }
    } catch {
      console.log('Auth check failed, user is guest')
      return { currentUser: null }
    }
  },
  component: PublicLayout,
})

function PublicLayout() {
  return <Outlet />
}
