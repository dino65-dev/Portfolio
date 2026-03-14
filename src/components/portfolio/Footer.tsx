import { motion } from 'motion/react'
import { Github, Linkedin, Twitter, Brain, BarChart3, ArrowUp } from 'lucide-react'

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

  const socialLinks = [
    githubUrl && { name: 'GitHub', url: githubUrl, icon: <Github size={17} /> },
    profile?.linkedinUrl && { name: 'LinkedIn', url: profile.linkedinUrl, icon: <Linkedin size={17} /> },
    profile?.twitterUrl && { name: 'Twitter', url: profile.twitterUrl, icon: <Twitter size={17} /> },
    profile?.huggingfaceUrl && { name: 'Hugging Face', url: profile.huggingfaceUrl, icon: <Brain size={17} /> },
    profile?.kaggleUrl && { name: 'Kaggle', url: profile.kaggleUrl, icon: <BarChart3 size={17} /> },
  ].filter(Boolean) as { name: string; url: string; icon: React.ReactNode }[]

  return (
    <footer
      className="fold-glow-top relative overflow-hidden"
      style={{ backgroundColor: 'var(--page-bg)' }}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-10 sm:py-14">
        <motion.div
          className="flex flex-col sm:flex-row items-center sm:justify-between gap-6"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Logo + copyright */}
          <div className="text-center sm:text-left">
            <a
              href="#home"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="inline-block text-lg font-bold tracking-tight mb-2 group touch-manipulation"
              style={{ color: 'var(--text-primary)' }}
            >
              {displayName.split(' ')[0]}
              <span className="text-[#8B5CF6] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">
                .
              </span>
            </a>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              &copy; {currentYear} {displayName}. All rights reserved.
            </p>
          </div>

          {/* Social icons */}
          {socialLinks.length > 0 && (
            <div className="flex items-center gap-2">
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border transition-all touch-manipulation"
                  style={{
                    color: 'var(--text-muted)',
                    borderColor: 'var(--border-warm)',
                  }}
                  aria-label={link.name}
                  whileHover={{ y: -2, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#8B5CF6'
                    e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
                    e.currentTarget.style.backgroundColor = 'rgba(139,92,246,0.07)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-muted)'
                    e.currentTarget.style.borderColor = 'var(--border-warm)'
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
          )}

          {/* Back to top */}
          <motion.button
            onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full border transition-all touch-manipulation"
            style={{
              color: 'var(--text-muted)',
              borderColor: 'var(--border-warm)',
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#8B5CF6'
              e.currentTarget.style.borderColor = 'rgba(139,92,246,0.4)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border-warm)'
            }}
          >
            <ArrowUp size={13} />
            Top
          </motion.button>
        </motion.div>
      </div>
    </footer>
  )
}
