import { createFileRoute, Link } from '@tanstack/react-router'
import { motion } from 'motion/react'
import {
  User,
  FolderKanban,
  MessageSquare,
  Eye,
  ArrowRight,
  Sparkles,
} from 'lucide-react'
import {
  getProfileSettingsFn,
  getProjectsFn,
  getContactMessagesFn,
} from '@/server/functions/portfolio'
import type { ContactMessages } from '@/server/lib/appwrite.types'

export const Route = createFileRoute('/_protected/admin/')({
  loader: async () => {
    const [profileResult, projectsResult, messagesResult] = await Promise.all([
      getProfileSettingsFn(),
      getProjectsFn(),
      getContactMessagesFn(),
    ])
    return {
      profile: profileResult.profile,
      projects: projectsResult.projects,
      messages: messagesResult.messages,
    }
  },
  component: AdminOverview,
})

function AdminOverview() {
  const { profile, projects, messages } = Route.useLoaderData()
  const unreadMessages = messages.filter(
    (m: ContactMessages) => !m.isRead,
  ).length

  const stats = [
    {
      label: 'Profile Status',
      value: profile ? 'Complete' : 'Not Set Up',
      icon: User,
      color: profile ? 'text-green-500' : 'text-orange-500',
      bgColor: profile ? 'bg-green-500/10' : 'bg-orange-500/10',
    },
    {
      label: 'Projects',
      value: projects.length.toString(),
      icon: FolderKanban,
      color: 'text-[#8B5CF6]',
      bgColor: 'bg-[#8B5CF6]/10',
    },
    {
      label: 'Messages',
      value: messages.length.toString(),
      subValue: unreadMessages > 0 ? `${unreadMessages} unread` : undefined,
      icon: MessageSquare,
      color: 'text-[#0EA5E9]',
      bgColor: 'bg-[#0EA5E9]/10',
    },
  ]

  const quickActions = [
    {
      label: 'Edit Profile',
      description: 'Update your personal information',
      icon: User,
      href: '/admin/profile',
      color: 'bg-[#8B5CF6]',
    },
    {
      label: 'Manage Projects',
      description: 'Add or edit your portfolio projects',
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'bg-[#0EA5E9]',
    },
    {
      label: 'View Messages',
      description:
        unreadMessages > 0
          ? `${unreadMessages} new messages`
          : 'Check your inbox',
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'bg-[#F97316]',
    },
    {
      label: 'View Portfolio',
      description: 'See your live portfolio',
      icon: Eye,
      href: '/',
      color: 'bg-[#10B981]',
      external: true,
    },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1A1F2C] dark:text-white mb-1 sm:mb-2">
          Welcome back
          {profile?.displayName ? `, ${profile.displayName.split(' ')[0]}` : ''}
          !
        </h1>
        <p className="text-sm sm:text-base text-[#8E9196]">
          Manage your portfolio from this dashboard.
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] p-4 sm:p-6"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <div
                className={`p-2.5 sm:p-3 rounded-lg ${stat.bgColor} shrink-0`}
              >
                <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-[#8E9196]">
                  {stat.label}
                </p>
                <p className="text-lg sm:text-xl font-semibold text-[#1A1F2C] dark:text-white truncate">
                  {stat.value}
                </p>
                {stat.subValue && (
                  <p className="text-xs text-[#8B5CF6]">{stat.subValue}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <h2 className="text-base sm:text-lg font-semibold text-[#1A1F2C] dark:text-white mb-3 sm:mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.href}
              className="group bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] p-4 sm:p-6 hover:border-[#8B5CF6] dark:hover:border-[#8B5CF6] transition-all hover:shadow-lg touch-manipulation active:scale-[0.98]"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className={`p-2.5 sm:p-3 rounded-lg ${action.color} shrink-0`}
                  >
                    <action.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-medium text-sm sm:text-base text-[#1A1F2C] dark:text-white group-hover:text-[#8B5CF6] transition-colors">
                      {action.label}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#8E9196] mt-0.5 sm:mt-1">
                      {action.description}
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 text-[#8E9196] group-hover:text-[#8B5CF6] group-hover:translate-x-1 transition-all shrink-0 mt-1" />
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Getting Started */}
      {!profile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-xl p-4 sm:p-6 text-white"
        >
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <div className="p-2.5 sm:p-3 bg-white/20 rounded-lg shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-base sm:text-lg font-semibold mb-2">
                Get Started
              </h3>
              <p className="text-white/80 mb-4 text-sm sm:text-base">
                Set up your profile to make your portfolio live. Add your name,
                bio, skills, and social links.
              </p>
              <Link
                to="/admin/profile"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white text-[#8B5CF6] rounded-lg font-medium hover:bg-white/90 transition-colors text-sm sm:text-base touch-manipulation"
              >
                Set Up Profile
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
