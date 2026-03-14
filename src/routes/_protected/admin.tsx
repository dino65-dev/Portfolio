import {
  createFileRoute,
  Outlet,
  Link,
  useLocation,
} from '@tanstack/react-router'
import { motion, AnimatePresence } from 'motion/react'
import {
  Home,
  User,
  FolderKanban,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { ThemeToggle } from '@/components/ThemeToggle'

export const Route = createFileRoute('/_protected/admin')({
  component: AdminLayout,
})

const navItems = [
  { path: '/admin', label: 'Overview', icon: Home, exact: true },
  { path: '/admin/profile', label: 'Profile', icon: User },
  { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { path: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { path: '/admin/settings', label: 'Settings', icon: Settings },
]

function AdminLayout() {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const isActive = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <div className="min-h-screen bg-[#F5F5F3] dark:bg-[#0F1419]">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-[#1A1F2C] border-b border-[#E8E8E6] dark:border-[#2A2F3C] px-4 py-3 safe-area-inset-top">
        <div className="flex items-center justify-between">
          <Link
            to="/admin"
            className="text-lg font-semibold text-[#1A1F2C] dark:text-white"
          >
            Admin<span className="text-[#8B5CF6]">.</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white touch-manipulation"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden fixed top-[57px] left-0 right-0 bottom-0 z-40 bg-white dark:bg-[#1A1F2C] overflow-y-auto"
            >
              <nav className="p-4 space-y-1">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl transition-colors touch-manipulation ${
                        isActive(item.path, item.exact)
                          ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                          : 'text-[#8E9196] active:bg-[#F5F5F3] dark:active:bg-[#2A2F3C]'
                      }`}
                    >
                      <item.icon size={20} />
                      <span className="font-medium text-base">
                        {item.label}
                      </span>
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 mt-4 border-t border-[#E8E8E6] dark:border-[#2A2F3C]">
                  <Link
                    to="/"
                    className="flex items-center gap-3 px-4 py-4 text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white rounded-xl touch-manipulation"
                  >
                    <ExternalLink size={20} />
                    <span className="font-medium text-base">
                      View Portfolio
                    </span>
                  </Link>
                  <Link
                    to="/sign-out"
                    className="flex items-center gap-3 px-4 py-4 text-red-500 hover:text-red-600 rounded-xl touch-manipulation"
                  >
                    <LogOut size={20} />
                    <span className="font-medium text-base">Sign Out</span>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 bottom-0 w-64 bg-white dark:bg-[#1A1F2C] border-r border-[#E8E8E6] dark:border-[#2A2F3C] flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-[#E8E8E6] dark:border-[#2A2F3C]">
          <Link
            to="/admin"
            className="text-xl font-semibold text-[#1A1F2C] dark:text-white"
          >
            Admin<span className="text-[#8B5CF6]">.</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path, item.exact)
                  ? 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
                  : 'text-[#8E9196] hover:bg-[#F5F5F3] dark:hover:bg-[#2A2F3C] hover:text-[#1A1F2C] dark:hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-[#E8E8E6] dark:border-[#2A2F3C] space-y-2">
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-[#8E9196]">Theme</span>
            <ThemeToggle />
          </div>
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white rounded-lg hover:bg-[#F5F5F3] dark:hover:bg-[#2A2F3C] transition-colors"
          >
            <ExternalLink size={20} />
            <span className="font-medium">View Portfolio</span>
          </Link>
          <Link
            to="/sign-out"
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-[57px] lg:pt-0 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
