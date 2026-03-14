import { useTheme } from 'next-themes'
import { motion } from 'motion/react'
import { Sun, Moon, Monitor } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="relative p-2.5 rounded-xl border hover:border-[#8B5CF6] transition-all duration-300"
      style={{
        backgroundColor: 'var(--card-bg-muted)',
        borderColor: 'var(--border-warm)',
        color: 'var(--text-primary)',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: isDark ? 180 : 0,
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Moon className="w-5 h-5 text-[#8B5CF6]" />
        ) : (
          <Sun className="w-5 h-5 text-[#F97316]" />
        )}
      </motion.div>
    </motion.button>
  )
}

export function ThemeToggleExpanded() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
    )
  }

  const themes = [
    { value: 'light', icon: Sun, label: 'Light', color: 'text-[#F97316]' },
    { value: 'dark', icon: Moon, label: 'Dark', color: 'text-[#8B5CF6]' },
    {
      value: 'system',
      icon: Monitor,
      label: 'System',
      color: 'text-[#0EA5E9]',
    },
  ]

  return (
    <div className="flex items-center gap-1 p-1 bg-[#F5F5F3] dark:bg-[#1A1F2C] rounded-xl">
      {themes.map(({ value, icon: Icon, label, color }) => (
        <motion.button
          key={value}
          onClick={() => setTheme(value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
            theme === value
              ? 'bg-white dark:bg-[#2A2F3C] shadow-sm'
              : 'text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Icon className={`w-4 h-4 ${theme === value ? color : ''}`} />
          <span
            className={theme === value ? 'text-[#1A1F2C] dark:text-white' : ''}
          >
            {label}
          </span>
        </motion.button>
      ))}
    </div>
  )
}

export function ThemeToggleMini() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse" />
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <motion.button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="p-2 rounded-lg hover:bg-[#F5F5F3] dark:hover:bg-[#2A2F3C] transition-colors"
      whileTap={{ scale: 0.95 }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? (
        <Moon className="w-4 h-4 text-[#8B5CF6]" />
      ) : (
        <Sun className="w-4 h-4 text-[#F97316]" />
      )}
    </motion.button>
  )
}
