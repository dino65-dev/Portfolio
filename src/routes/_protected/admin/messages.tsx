import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import {
  Mail,
  MailOpen,
  Trash2,
  Loader2,
  Inbox,
  Clock,
  ArrowLeft,
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import {
  getContactMessagesFn,
  markMessageReadFn,
  deleteMessageFn,
} from '@/server/functions/portfolio'
import type { ContactMessages } from '@/server/lib/appwrite.types'

export const Route = createFileRoute('/_protected/admin/messages')({
  loader: async () => {
    const result = await getContactMessagesFn()
    return { messages: result.messages }
  },
  component: MessagesManager,
})

function MessagesManager() {
  const { messages } = Route.useLoaderData()
  const router = useRouter()
  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessages | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const unreadCount = messages.filter((m: ContactMessages) => !m.isRead).length

  const handleSelectMessage = async (message: ContactMessages) => {
    setSelectedMessage(message)

    if (!message.isRead) {
      try {
        await markMessageReadFn({ data: { id: message.$id, isRead: true } })
        void router.invalidate()
      } catch {
        console.error('Failed to mark as read')
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return

    setDeletingId(id)
    try {
      await deleteMessageFn({ data: { id } })
      toast.success('Message deleted')
      if (selectedMessage?.$id === id) {
        setSelectedMessage(null)
      }
      void router.invalidate()
    } catch {
      toast.error('Failed to delete message')
    } finally {
      setDeletingId(null)
    }
  }

  const toggleRead = async (message: ContactMessages) => {
    try {
      await markMessageReadFn({
        data: { id: message.$id, isRead: !message.isRead },
      })
      toast.success(message.isRead ? 'Marked as unread' : 'Marked as read')
      void router.invalidate()
    } catch {
      toast.error('Failed to update message')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    } else if (days === 1) {
      return 'Yesterday'
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Toaster position="top-right" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 sm:mb-8"
      >
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#1A1F2C] dark:text-white mb-1 sm:mb-2">
          Messages
        </h1>
        <p className="text-sm sm:text-base text-[#8E9196]">
          {unreadCount > 0
            ? `${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`
            : 'All caught up!'}
        </p>
      </motion.div>

      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 sm:py-16 bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C]"
        >
          <Inbox className="w-12 h-12 sm:w-16 sm:h-16 text-[#8E9196] mx-auto mb-3 sm:mb-4" />
          <p className="text-[#8E9196] text-sm sm:text-base">No messages yet</p>
          <p className="text-xs sm:text-sm text-[#8E9196] mt-1">
            Messages from your contact form will appear here
          </p>
        </motion.div>
      ) : (
        <div className="relative">
          {/* Messages List - Full width on mobile when no message selected */}
          <div
            className={`${selectedMessage ? 'hidden lg:block' : 'block'} lg:grid lg:grid-cols-3 gap-6`}
          >
            <div className="lg:col-span-1 bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] overflow-hidden">
              <div className="max-h-[calc(100vh-200px)] sm:max-h-[600px] overflow-y-auto">
                {messages.map((message: ContactMessages) => (
                  <div
                    key={message.$id}
                    onClick={() => handleSelectMessage(message)}
                    className={`p-3 sm:p-4 border-b border-[#E8E8E6] dark:border-[#2A2F3C] cursor-pointer transition-colors touch-manipulation active:bg-[#F5F5F3] dark:active:bg-[#0F1419] ${
                      selectedMessage?.$id === message.$id
                        ? 'bg-[#8B5CF6]/10'
                        : 'hover:bg-[#F5F5F3] dark:hover:bg-[#0F1419]'
                    } ${!message.isRead ? 'bg-[#8B5CF6]/5' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {!message.isRead && (
                            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shrink-0" />
                          )}
                          <span
                            className={`font-medium truncate text-sm sm:text-base ${
                              !message.isRead
                                ? 'text-[#1A1F2C] dark:text-white'
                                : 'text-[#8E9196]'
                            }`}
                          >
                            {message.senderName}
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm text-[#8E9196] truncate mt-1">
                          {message.subject || message.message.slice(0, 50)}
                        </p>
                      </div>
                      <span className="text-xs text-[#8E9196] whitespace-nowrap shrink-0">
                        {formatDate(message.$createdAt)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Desktop Message Detail Placeholder */}
            <div className="hidden lg:block lg:col-span-2">
              <div className="bg-white dark:bg-[#1A1F2C] rounded-xl border border-[#E8E8E6] dark:border-[#2A2F3C] h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                  <Mail className="w-12 h-12 text-[#8E9196] mx-auto mb-3" />
                  <p className="text-[#8E9196]">Select a message to read</p>
                </div>
              </div>
            </div>
          </div>

          {/* Message Detail - Full screen on mobile */}
          <AnimatePresence>
            {selectedMessage && (
              <motion.div
                key={selectedMessage.$id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="fixed inset-0 z-50 bg-[#F5F5F3] dark:bg-[#0F1419] lg:static lg:inset-auto lg:z-auto lg:bg-transparent lg:col-span-2"
              >
                {/* Mobile Header */}
                <div className="lg:hidden sticky top-0 z-10 bg-white dark:bg-[#1A1F2C] border-b border-[#E8E8E6] dark:border-[#2A2F3C] px-4 py-3 flex items-center gap-3">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 -ml-2 text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white touch-manipulation"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <span className="font-medium text-[#1A1F2C] dark:text-white truncate">
                    {selectedMessage.senderName}
                  </span>
                </div>

                <div className="lg:bg-white lg:dark:bg-[#1A1F2C] lg:rounded-xl lg:border lg:border-[#E8E8E6] lg:dark:border-[#2A2F3C] h-full lg:h-auto overflow-y-auto">
                  {/* Header - Desktop */}
                  <div className="hidden lg:block p-6 border-b border-[#E8E8E6] dark:border-[#2A2F3C]">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-[#1A1F2C] dark:text-white">
                          {selectedMessage.senderName}
                        </h2>
                        <a
                          href={`mailto:${selectedMessage.senderEmail}`}
                          className="text-sm text-[#8B5CF6] hover:underline"
                        >
                          {selectedMessage.senderEmail}
                        </a>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleRead(selectedMessage)}
                          className="p-2 text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white transition-colors"
                          title={
                            selectedMessage.isRead
                              ? 'Mark as unread'
                              : 'Mark as read'
                          }
                        >
                          {selectedMessage.isRead ? (
                            <MailOpen size={20} />
                          ) : (
                            <Mail size={20} />
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(selectedMessage.$id)}
                          disabled={deletingId === selectedMessage.$id}
                          className="p-2 text-[#8E9196] hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                          {deletingId === selectedMessage.$id ? (
                            <Loader2 size={20} className="animate-spin" />
                          ) : (
                            <Trash2 size={20} />
                          )}
                        </button>
                      </div>
                    </div>
                    {selectedMessage.subject && (
                      <p className="mt-2 text-[#1A1F2C] dark:text-white font-medium">
                        {selectedMessage.subject}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3 text-sm text-[#8E9196]">
                      <Clock size={14} />
                      {new Date(selectedMessage.$createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Mobile Content Header */}
                  <div className="lg:hidden bg-white dark:bg-[#1A1F2C] p-4 border-b border-[#E8E8E6] dark:border-[#2A2F3C]">
                    <a
                      href={`mailto:${selectedMessage.senderEmail}`}
                      className="text-sm text-[#8B5CF6] hover:underline break-all"
                    >
                      {selectedMessage.senderEmail}
                    </a>
                    {selectedMessage.subject && (
                      <p className="mt-2 text-[#1A1F2C] dark:text-white font-medium text-sm">
                        {selectedMessage.subject}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-xs text-[#8E9196]">
                      <Clock size={12} />
                      {new Date(selectedMessage.$createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 sm:p-6 bg-white dark:bg-[#1A1F2C] lg:bg-transparent">
                    <p className="text-sm sm:text-base text-[#1A1F2C] dark:text-white whitespace-pre-wrap leading-relaxed">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="p-4 sm:p-6 border-t border-[#E8E8E6] dark:border-[#2A2F3C] bg-white dark:bg-[#1A1F2C] lg:bg-transparent sticky bottom-0">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={`mailto:${selectedMessage.senderEmail}?subject=Re: ${selectedMessage.subject || 'Your message'}`}
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#8B5CF6] text-white rounded-lg font-medium hover:bg-[#7C3AED] transition-colors text-sm sm:text-base touch-manipulation"
                      >
                        <Mail size={18} />
                        Reply
                      </a>
                      <div className="flex gap-2 lg:hidden">
                        <button
                          onClick={() => toggleRead(selectedMessage)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-[#E8E8E6] dark:border-[#2A2F3C] text-[#8E9196] rounded-lg font-medium hover:text-[#1A1F2C] dark:hover:text-white transition-colors text-sm touch-manipulation"
                        >
                          {selectedMessage.isRead ? (
                            <>
                              <MailOpen size={16} />
                              Unread
                            </>
                          ) : (
                            <>
                              <Mail size={16} />
                              Read
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(selectedMessage.$id)}
                          disabled={deletingId === selectedMessage.$id}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 dark:border-red-500/20 text-red-500 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors text-sm touch-manipulation disabled:opacity-50"
                        >
                          {deletingId === selectedMessage.$id ? (
                            <Loader2 size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
