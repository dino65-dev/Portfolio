import { useState } from 'react'
import { motion, useInView } from 'motion/react'
import {
  Send,
  Mail,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { useRef } from 'react'
import { toast } from 'sonner'
import { submitContactMessageFn } from '@/server/functions/portfolio'

interface ContactProps {
  profile?: {
    email?: string | null
    location?: string | null
    githubUsername?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
  } | null
}

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  message?: string
}

/** Update CSS custom props for spotlight effect on card */
function handleSpotlight(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
}

export function Contact({ profile }: ContactProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const email = profile?.email
  const location = profile?.location
  const githubUrl = profile?.githubUsername
    ? `https://github.com/${profile.githubUsername}`
    : null
  const linkedinUrl = profile?.linkedinUrl
  const twitterUrl = profile?.twitterUrl

  const socialLinks = [
    githubUrl && { name: 'GitHub', url: githubUrl, icon: 'github' },
    linkedinUrl && { name: 'LinkedIn', url: linkedinUrl, icon: 'linkedin' },
    twitterUrl && { name: 'Twitter', url: twitterUrl, icon: 'twitter' },
  ].filter(Boolean) as { name: string; url: string; icon: string }[]

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required'
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error('Please fix the errors in the form')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await submitContactMessageFn({
        data: {
          senderName: formData.name,
          senderEmail: formData.email,
          subject: formData.subject || null,
          message: formData.message,
        },
      })

      if (result.success) {
        setIsSubmitted(true)
        toast.success("Message sent successfully! I'll get back to you soon.")

        setTimeout(() => {
          setFormData({ name: '', email: '', subject: '', message: '' })
          setIsSubmitted(false)
        }, 3000)
      } else {
        toast.error('Failed to send message. Please try again.')
      }
    } catch (error) {
      console.error('Contact form submission error:', error)
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to send message. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const getSocialIcon = (iconName: string) => {
    switch (iconName) {
      case 'github':
        return <Github size={20} />
      case 'linkedin':
        return <Linkedin size={20} />
      case 'twitter':
        return <Twitter size={20} />
      default:
        return null
    }
  }

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-16 sm:py-20 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: 'var(--page-bg)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gradient-to-t from-[#8B5CF6]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 right-0 w-72 h-72 bg-gradient-to-l from-[#D946EF]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-12 sm:mb-16 lg:mb-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-full mb-6 border border-[#8B5CF6]/20">
            <MessageSquare className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs sm:text-sm font-medium text-[#8B5CF6]">Contact</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Let's work{' '}
            <span className="gradient-text">together</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg max-w-2xl mx-auto px-4" style={{ color: 'var(--text-muted)' }}>
            Have a project in mind or want to collaborate? I'd love to hear from
            you. Drop me a message and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
          {/* Contact Info */}
          <motion.div
            className="lg:col-span-2 order-2 lg:order-1"
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="space-y-4">
              {email && (
                <div
                  className="spotlight-card group p-5 bg-[var(--card-bg-muted)] dark:bg-[var(--card-bg)] border border-[var(--border-warm)] dark:border-white/5 transition-all"
                  style={{ borderRadius: '1rem' }}
                  onMouseMove={handleSpotlight}
                >
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-2xl group-hover:from-[#8B5CF6]/20 group-hover:to-[#D946EF]/20 transition-colors shrink-0 group-hover:shadow-lg group-hover:shadow-[#8B5CF6]/10">
                      <Mail className="w-5 h-5 text-[#8B5CF6]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                        Email
                      </h3>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm sm:text-base font-medium hover:text-[#8B5CF6] transition-colors break-all neon-text-hover"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {email}
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {location && (
                <div
                  className="spotlight-card group p-5 bg-[var(--card-bg-muted)] dark:bg-[var(--card-bg)] border border-[var(--border-warm)] dark:border-white/5 transition-all"
                  style={{ borderRadius: '1rem' }}
                  onMouseMove={handleSpotlight}
                >
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="p-3 bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-2xl group-hover:from-[#8B5CF6]/20 group-hover:to-[#D946EF]/20 transition-colors shrink-0 group-hover:shadow-lg group-hover:shadow-[#8B5CF6]/10">
                      <MapPin className="w-5 h-5 text-[#8B5CF6]" />
                    </div>
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                        Location
                      </h3>
                      <p className="text-sm sm:text-base font-medium" style={{ color: 'var(--text-primary)' }}>
                        {location}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links - Neon icon buttons */}
            {socialLinks.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>
                  Connect with me
                </h3>
                <div className="flex gap-3">
                  {socialLinks.map((link) => (
                    <motion.a
                      key={link.name}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neon-icon group p-3.5 bg-[var(--card-bg-muted)] dark:bg-[var(--card-bg)] border border-[var(--border-warm)] dark:border-white/5 rounded-2xl text-[var(--text-muted)] hover:text-white hover:bg-gradient-to-br hover:from-[#8B5CF6] hover:to-[#D946EF] hover:border-transparent hover:shadow-lg hover:shadow-[#8B5CF6]/30 transition-all duration-300 touch-manipulation"
                      aria-label={link.name}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {getSocialIcon(link.icon)}
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Decorative element - availability card */}
            <motion.div
              className="mt-10 hidden lg:block"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="spotlight-card animated-border p-6 sm:p-8 border border-[var(--border-warm)] dark:border-white/5"
                style={{ borderRadius: '1.5rem', backgroundColor: 'var(--card-bg)' }}
                onMouseMove={handleSpotlight}
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse shrink-0" />
                  <span className="text-sm font-semibold text-green-500">Available for work</span>
                </div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  I'm currently open to freelance projects, full-time roles, and interesting collaborations.
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Remote', 'Full-time', 'Contract'].map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs font-medium text-[#8B5CF6] bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-full border border-[#8B5CF6]/15"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form - Spotlight card with floating inputs */}
          <motion.div
            className="lg:col-span-3 order-1 lg:order-2"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div
              className="spotlight-card animated-border p-6 sm:p-8 bg-[var(--card-bg-muted)] dark:bg-[var(--card-bg)] border border-[var(--border-warm)] dark:border-white/5 shadow-sm"
              style={{ borderRadius: '1.5rem' }}
              onMouseMove={handleSpotlight}
            >
              <form
                onSubmit={handleSubmit}
                className="space-y-5 relative z-10"
                noValidate
              >
                {/* Name and Email - Floating label inputs */}
                <div className="grid sm:grid-cols-2 gap-5">
                  {/* Name Field */}
                  <div className="floating-input-group">
                    <label
                      htmlFor="name"
                     className="block text-sm font-semibold mb-2"
                     style={{ color: 'var(--text-primary)' }}
                     >
                       Name
                     </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-[var(--card-bg-muted)] dark:bg-white/5 border rounded-xl text-[var(--text-primary)] dark:text-white placeholder-[#8E9196]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all text-sm ${
                          errors.name
                            ? 'border-red-400'
                            : 'border-[var(--border-warm)] dark:border-white/5'
                        }`}
                        placeholder="Your name"
                        aria-invalid={errors.name ? 'true' : 'false'}
                        aria-describedby={errors.name ? 'name-error' : undefined}
                      />
                      <span className="input-underline" />
                    </div>
                    {errors.name && (
                      <p
                        id="name-error"
                        className="mt-2 text-xs text-red-500 flex items-center gap-1"
                      >
                        <AlertCircle size={12} />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="floating-input-group">
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Email
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 bg-[var(--card-bg-muted)] dark:bg-white/5 border rounded-xl text-[var(--text-primary)] dark:text-white placeholder-[#8E9196]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all text-sm ${
                          errors.email
                            ? 'border-red-400'
                            : 'border-[var(--border-warm)] dark:border-white/5'
                        }`}
                        placeholder="your.email@example.com"
                        aria-invalid={errors.email ? 'true' : 'false'}
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                      <span className="input-underline" />
                    </div>
                    {errors.email && (
                      <p
                        id="email-error"
                        className="mt-2 text-xs text-red-500 flex items-center gap-1"
                      >
                        <AlertCircle size={12} />
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Subject Field */}
                <div className="floating-input-group">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Subject <span className="font-normal" style={{ color: 'var(--text-muted)' }}>(optional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-[var(--card-bg-muted)] dark:bg-white/5 border border-[var(--border-warm)] dark:border-white/5 rounded-xl text-[var(--text-primary)] dark:text-white placeholder-[#8E9196]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all text-sm"
                      placeholder="What's this about?"
                    />
                    <span className="input-underline" />
                  </div>
                </div>

                {/* Message Field */}
                <div className="floating-input-group">
                  <label
                    htmlFor="message"
                    className="block text-sm font-semibold mb-2"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    Message
                  </label>
                  <div className="relative">
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className={`w-full px-4 py-3 bg-[var(--card-bg-muted)] dark:bg-white/5 border rounded-xl text-[var(--text-primary)] dark:text-white placeholder-[#8E9196]/50 focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:border-[#8B5CF6] transition-all resize-none text-sm ${
                        errors.message
                          ? 'border-red-400'
                          : 'border-[var(--border-warm)] dark:border-white/5'
                      }`}
                      placeholder="Tell me about your project or idea..."
                      aria-invalid={errors.message ? 'true' : 'false'}
                      aria-describedby={
                        errors.message ? 'message-error' : undefined
                      }
                    />
                    <span className="input-underline" />
                  </div>
                  {errors.message && (
                    <p
                      id="message-error"
                      className="mt-2 text-xs text-red-500 flex items-center gap-1"
                    >
                      <AlertCircle size={12} />
                      {errors.message}
                    </p>
                  )}
                </div>

                {/* Submit Button - Neon glow */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`neon-btn w-full py-4 px-6 rounded-2xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 text-sm touch-manipulation relative overflow-hidden ${
                    isSubmitted
                      ? 'bg-green-500 shadow-lg shadow-green-500/25'
                      : isSubmitting
                        ? 'bg-[#8B5CF6]/70 cursor-not-allowed'
                        : 'bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] shadow-lg shadow-[#8B5CF6]/25 hover:shadow-xl hover:shadow-[#8B5CF6]/40'
                  }`}
                  whileHover={!isSubmitting && !isSubmitted ? { scale: 1.01 } : {}}
                  whileTap={!isSubmitting && !isSubmitted ? { scale: 0.99 } : {}}
                >
                  {/* Shimmer overlay */}
                  {!isSubmitted && !isSubmitting && (
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
                  )}

                  <span className="relative flex items-center gap-2 z-10">
                    {isSubmitted ? (
                      <>
                        <CheckCircle size={20} />
                        Message Sent!
                      </>
                    ) : isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: 'linear',
                          }}
                        />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} />
                        Send Message
                        <Sparkles size={14} className="opacity-60" />
                      </>
                    )}
                  </span>
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
