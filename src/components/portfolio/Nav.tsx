import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X, Github, Linkedin, Brain, BarChart3 } from 'lucide-react'
import { ThemeToggle } from '@/components/ThemeToggle'

interface NavProps {
  profile?: {
    displayName?: string | null
    githubUsername?: string | null
    linkedinUrl?: string | null
    huggingfaceUrl?: string | null
    kaggleUrl?: string | null
  } | null
}

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Projects', href: '#projects' },
  { name: 'Blog', href: '#blog' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

function handleSpotlight(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
}

export function Nav({ profile }: NavProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [mounted, setMounted] = useState(false)

  const displayName = profile?.displayName || 'Portfolio'
  const githubUrl = profile?.githubUsername
    ? `https://github.com/${profile.githubUsername}`
    : null
  const linkedinUrl = profile?.linkedinUrl
  const huggingfaceUrl = profile?.huggingfaceUrl
  const kaggleUrl = profile?.kaggleUrl

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)

      const sections = navLinks.map((link) => link.href.slice(1))
      for (const section of sections.reverse()) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
    setIsMobileMenuOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      scrollToSection(href)
    }
  }

  const socialIcons = [
    { url: githubUrl, icon: <Github size={18} />, label: 'GitHub Profile' },
    { url: linkedinUrl, icon: <Linkedin size={18} />, label: 'LinkedIn Profile' },
    { url: huggingfaceUrl, icon: <Brain size={18} />, label: 'Hugging Face Profile' },
    { url: kaggleUrl, icon: <BarChart3 size={18} />, label: 'Kaggle Profile' },
  ].filter((s) => s.url) as { url: string; icon: React.ReactNode; label: string }[]

  const mobileMenuContent = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-md"
            style={{ zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu Panel — deep dark glass with grid bg */}
          <motion.div
            id="mobile-menu"
            className="md:hidden fixed top-0 left-0 right-0 bottom-0 overflow-y-auto"
            style={{ zIndex: 9999 }}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="min-h-full bg-white/95 dark:bg-[#0A0A0F]/98 backdrop-blur-xl grid-bg">
              {/* Close button area */}
              <div className="flex items-center justify-between px-4 sm:px-6 h-14 sm:h-16">
                <motion.span
                  className="text-base sm:text-lg font-bold gradient-text"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  {displayName.split(' ')[0]}.
                </motion.span>
                <button
                  className="p-2 text-[#1A1F2C] dark:text-white/80 hover:text-[#8B5CF6] transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Nav Links with neon active state */}
              <div className="px-4 sm:px-6 py-8 space-y-1">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault()
                      scrollToSection(link.href)
                    }}
                    onKeyDown={(e) => handleKeyDown(e, link.href)}
                    tabIndex={0}
                    className={`relative block py-4 px-5 text-2xl font-semibold transition-all rounded-2xl touch-manipulation overflow-hidden group ${
                      activeSection === link.href.slice(1)
                        ? 'text-white'
                        : 'text-[#1A1F2C] dark:text-white/60 hover:text-[#8B5CF6]'
                    }`}
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.07 }}
                  >
                    {/* Active background — neon gradient with glow */}
                    {activeSection === link.href.slice(1) && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-2xl"
                        style={{
                          boxShadow: '0 0 20px rgba(139, 92, 246, 0.4), 0 0 60px rgba(139, 92, 246, 0.15)',
                        }}
                        layoutId="mobile-active"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-3">
                      <span
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          activeSection === link.href.slice(1)
                            ? 'bg-white shadow-[0_0_6px_rgba(255,255,255,0.8)]'
                            : 'bg-current opacity-30 group-hover:opacity-60 group-hover:shadow-[0_0_6px_rgba(139,92,246,0.5)]'
                        }`}
                      />
                      {link.name}
                    </span>
                  </motion.a>
                ))}

                {/* Social Links — neon-icon style */}
                {socialIcons.length > 0 && (
                  <motion.div
                    className="pt-6 mt-4 border-t border-[#E8E8E6] dark:border-white/5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-xs font-medium text-[#8E9196] uppercase tracking-widest mb-4 px-5">
                      Connect
                    </p>
                    <div className="flex gap-3 px-5">
                      {socialIcons.map((s) => (
                        <a
                          key={s.label}
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neon-icon p-3 rounded-xl bg-[#F5F5F3] dark:bg-white/5 text-[#1A1F2C] dark:text-white/60 hover:text-[#8B5CF6] transition-all"
                          aria-label={s.label}
                        >
                          {s.icon}
                        </a>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled ? 'py-2' : 'py-3'
        }`}
        role="navigation"
        aria-label="Main navigation"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Container that collapses into a glassmorphism pill on scroll */}
        <div
          className={`mx-auto transition-all duration-500 ${
            isScrolled
              ? 'max-w-5xl px-2 sm:px-4'
              : 'max-w-6xl px-4 sm:px-6 lg:px-8'
          }`}
        >
          <div
            className={`spotlight-card transition-all duration-500 ${
              isScrolled
                ? 'bg-white/60 dark:bg-[#111118]/70 backdrop-blur-2xl shadow-lg shadow-black/5 dark:shadow-[#8B5CF6]/5 rounded-2xl border border-white/20 dark:border-white/[0.04] px-4 sm:px-6'
                : 'bg-transparent px-0'
            }`}
            onMouseMove={isScrolled ? handleSpotlight : undefined}
            style={{ borderRadius: isScrolled ? '1rem' : '0' }}
          >
            <div className="flex items-center justify-between h-14 sm:h-16">
              {/* Logo with neon dot */}
              <motion.a
                href="#home"
                onClick={(e) => {
                  e.preventDefault()
                  scrollToSection('#home')
                }}
                className="relative group"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <span className="text-base sm:text-lg font-bold text-[#1A1F2C] dark:text-white tracking-tight">
                  {displayName.split(' ')[0]}
                </span>
                <span className="text-[#8B5CF6] font-bold text-xl transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(139,92,246,0.8)]">
                  .
                </span>
                {/* Hover glow */}
                <span className="absolute -inset-2 bg-[#8B5CF6]/0 group-hover:bg-[#8B5CF6]/5 rounded-lg transition-colors duration-300" />
              </motion.a>

              {/* Desktop Navigation — animated-border pill container with neon active indicator */}
              <div className="hidden md:flex items-center">
                <div
                  className="animated-border relative flex items-center gap-1 p-1 bg-[#F5F5F3]/80 dark:bg-white/[0.03] backdrop-blur-sm"
                  style={{ borderRadius: '1rem' }}
                >
                  {navLinks.map((link, index) => (
                    <motion.a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection(link.href)
                      }}
                      onKeyDown={(e) => handleKeyDown(e, link.href)}
                      tabIndex={0}
                      className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-xl z-10 ${
                        activeSection === link.href.slice(1)
                          ? 'text-white'
                          : 'text-[#8E9196] hover:text-[#1A1F2C] dark:hover:text-white'
                      }`}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.08 }}
                      aria-current={
                        activeSection === link.href.slice(1) ? 'page' : undefined
                      }
                    >
                      {/* Active neon pill background with glow */}
                      {activeSection === link.href.slice(1) && (
                        <motion.span
                          className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-xl"
                          style={{
                            boxShadow:
                              '0 0 12px rgba(139, 92, 246, 0.5), 0 0 32px rgba(139, 92, 246, 0.2)',
                          }}
                          layoutId="nav-pill"
                          transition={{
                            type: 'spring',
                            stiffness: 350,
                            damping: 30,
                          }}
                        />
                      )}
                      <span className="relative z-10">{link.name}</span>
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Desktop Right Actions */}
              <div className="hidden md:flex items-center gap-2">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.35 }}
                >
                  <ThemeToggle />
                </motion.div>

                {/* Social Icons — neon-icon class */}
                <div className="flex items-center gap-1 ml-2">
                  {socialIcons.map((s, i) => (
                    <motion.a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="neon-icon p-2 text-[#8E9196] hover:text-[#8B5CF6] rounded-xl hover:bg-[#8B5CF6]/5 transition-all"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
                      aria-label={s.label}
                    >
                      {s.icon}
                    </motion.a>
                  ))}
                </div>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden flex items-center gap-2">
                <ThemeToggle />
                <button
                  className="relative z-[10000] p-2.5 text-[#1A1F2C] dark:text-white touch-manipulation rounded-xl hover:bg-[#8B5CF6]/5 transition-colors"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-expanded={isMobileMenuOpen}
                  aria-controls="mobile-menu"
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                >
                  {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu — rendered via portal */}
      {mounted && createPortal(mobileMenuContent, document.body)}
    </>
  )
}
