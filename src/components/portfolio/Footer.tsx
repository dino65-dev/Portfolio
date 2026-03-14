import { motion } from 'motion/react'
import {
  Heart,
  Github,
  Linkedin,
  Twitter,
  Brain,
  BarChart3,
  ArrowUp,
} from 'lucide-react'

interface FooterProps {
  profile?: {
    displayName?: string | null
    githubUsername?: string | null
    linkedinUrl?: string | null
    twitterUrl?: string | null
    huggingfaceUrl?: string | null
    kaggleUrl?: string | null
  } | null
}

export function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear()
  const displayName = profile?.displayName || 'Portfolio'

  const githubUrl = profile?.githubUsername
    ? `https://github.com/${profile.githubUsername}`
    : null
  const linkedinUrl = profile?.linkedinUrl
  const twitterUrl = profile?.twitterUrl
  const huggingfaceUrl = profile?.huggingfaceUrl
  const kaggleUrl = profile?.kaggleUrl

  const socialLinks = [
    githubUrl && { name: 'GitHub', url: githubUrl, icon: <Github size={18} /> },
    linkedinUrl && { name: 'LinkedIn', url: linkedinUrl, icon: <Linkedin size={18} /> },
    twitterUrl && { name: 'Twitter', url: twitterUrl, icon: <Twitter size={18} /> },
    huggingfaceUrl && { name: 'Hugging Face', url: huggingfaceUrl, icon: <Brain size={18} /> },
    kaggleUrl && { name: 'Kaggle', url: kaggleUrl, icon: <BarChart3 size={18} /> },
  ].filter(Boolean) as { name: string; url: string; icon: React.ReactNode }[]

  return (
    <footer className="relative overflow-hidden">
      {/* Animated shimmer gradient line at top — gradient-border-top CSS class */}
      <div className="gradient-border-top h-0" />

      <div className="bg-[#FAFAF9] dark:bg-[#0A0A0F] py-10 sm:py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo & Copyright */}
            <div className="text-center sm:text-left">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault()
                  document
                    .getElementById('home')
                    ?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="text-lg font-bold text-[#1A1F2C] dark:text-white tracking-tight inline-block mb-3 touch-manipulation group"
              >
                {displayName.split(' ')[0]}
                <span className="text-[#8B5CF6] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)] group-hover:text-[#D946EF]">
                  .
                </span>
              </a>
              <p className="text-[#8E9196] text-sm flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
                &copy; {currentYear} Made with{' '}
                <Heart
                  size={14}
                  className="text-[#D946EF] fill-[#D946EF] animate-pulse"
                />{' '}
                by {displayName}
              </p>
            </div>

            {/* Social Links — neon-icon style with hover glow */}
            {socialLinks.length > 0 && (
              <div className="flex items-center gap-2">
                {socialLinks.map((link) => (
                  <motion.a
                    key={link.name}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="neon-icon p-3 text-[#8E9196] hover:text-[#8B5CF6] rounded-xl hover:bg-[#8B5CF6]/5 dark:hover:bg-[#8B5CF6]/10 transition-all touch-manipulation"
                    aria-label={link.name}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {link.icon}
                  </motion.a>
                ))}
              </div>
            )}
          </motion.div>

          {/* Back to top — neon-btn style */}
          <motion.div
            className="mt-8 pt-8 border-t border-[#E8E8E6]/50 dark:border-white/5 flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              onClick={() => {
                document
                  .getElementById('home')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="neon-btn flex items-center gap-2 px-5 py-2.5 text-sm text-[#8E9196] hover:text-white rounded-full border border-[#E8E8E6] dark:border-white/5 hover:border-[#8B5CF6]/40 hover:bg-[#8B5CF6]/10 transition-all touch-manipulation"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUp size={14} />
              Back to top
            </motion.button>
          </motion.div>
        </div>
      </div>
    </footer>
  )
}
