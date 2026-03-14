import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import { Palette, Eye, ExternalLink, Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export const Route = createFileRoute('/_protected/admin/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const themes = [
    {
      value: 'light',
      icon: Sun,
      label: 'Light',
      description: 'Light mode for daytime use',
    },
    {
      value: 'dark',
      icon: Moon,
      label: 'Dark',
      description: 'Dark mode for nighttime use',
    },
    {
      value: 'system',
      icon: Monitor,
      label: 'System',
      description: 'Follow system preference',
    },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl lg:text-3xl font-semibold text-[#1A1F2C] dark:text-white mb-2">
          Settings
        </h1>
        <p className="text-[#8E9196] mb-8">Customize your admin experience.</p>
      </motion.div>

      {/* Theme Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] p-6 mb-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#8B5CF6]/10 rounded-lg">
            <Palette className="w-5 h-5 text-[#8B5CF6]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1A1F2C] dark:text-white">
              Appearance
            </h2>
            <p className="text-sm text-[#8E9196]">
              Choose your preferred theme
            </p>
          </div>
        </div>

        {mounted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {themes.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`p-4 rounded-xl border-2 transition-all text-left ${
                  theme === t.value
                    ? 'border-[#8B5CF6] bg-[#8B5CF6]/5'
                    : 'border-[#E8E8E6] dark:border-[#2A2F3C] hover:border-[#8B5CF6]/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <t.icon
                    className={`w-5 h-5 ${
                      theme === t.value ? 'text-[#8B5CF6]' : 'text-[#8E9196]'
                    }`}
                  />
                  <span
                    className={`font-medium ${
                      theme === t.value
                        ? 'text-[#8B5CF6]'
                        : 'text-[#1A1F2C] dark:text-white'
                    }`}
                  >
                    {t.label}
                  </span>
                </div>
                <p className="text-sm text-[#8E9196]">{t.description}</p>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-[#0EA5E9]/10 rounded-lg">
            <Eye className="w-5 h-5 text-[#0EA5E9]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#1A1F2C] dark:text-white">
              Quick Links
            </h2>
            <p className="text-sm text-[#8E9196]">Useful shortcuts</p>
          </div>
        </div>

        <div className="space-y-3">
          <Link
            to="/"
            className="flex items-center justify-between p-4 rounded-lg border border-[#E8E8E6] dark:border-[#2A2F3C] hover:border-[#8B5CF6] transition-colors group"
          >
            <div>
              <p className="font-medium text-[#1A1F2C] dark:text-white group-hover:text-[#8B5CF6] transition-colors">
                View Portfolio
              </p>
              <p className="text-sm text-[#8E9196]">
                See your live portfolio site
              </p>
            </div>
            <ExternalLink className="w-5 h-5 text-[#8E9196] group-hover:text-[#8B5CF6] transition-colors" />
          </Link>

          <Link
            to="/admin/profile"
            className="flex items-center justify-between p-4 rounded-lg border border-[#E8E8E6] dark:border-[#2A2F3C] hover:border-[#8B5CF6] transition-colors group"
          >
            <div>
              <p className="font-medium text-[#1A1F2C] dark:text-white group-hover:text-[#8B5CF6] transition-colors">
                Edit Profile
              </p>
              <p className="text-sm text-[#8E9196]">
                Update your portfolio information
              </p>
            </div>
            <ExternalLink className="w-5 h-5 text-[#8E9196] group-hover:text-[#8B5CF6] transition-colors" />
          </Link>

          <Link
            to="/admin/projects"
            className="flex items-center justify-between p-4 rounded-lg border border-[#E8E8E6] dark:border-[#2A2F3C] hover:border-[#8B5CF6] transition-colors group"
          >
            <div>
              <p className="font-medium text-[#1A1F2C] dark:text-white group-hover:text-[#8B5CF6] transition-colors">
                Manage Projects
              </p>
              <p className="text-sm text-[#8E9196]">
                Add or edit your portfolio projects
              </p>
            </div>
            <ExternalLink className="w-5 h-5 text-[#8E9196] group-hover:text-[#8B5CF6] transition-colors" />
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
