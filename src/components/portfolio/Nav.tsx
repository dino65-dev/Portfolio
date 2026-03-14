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
  { name: 'Projects', href: '#projects' },
  { name: 'Blog', href: '#blog' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
]

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

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const allSections = ['home', 'projects', 'blog', 'about', 'contact']
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30)
      for (const section of [...allSections].reverse()) {
        const el = document.getElementById(section)
        if (el && el.getBoundingClientRect().top <= 100) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  const scrollToSection = (href: string) => {
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    setIsMobileMenuOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent, href: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      scrollToSection(href)
    }
  }

  const socialIcons = [
    { url: githubUrl, icon: <Github size={17} />, label: 'GitHub' },
    { url: linkedinUrl, icon: <Linkedin size={17} />, label: 'LinkedIn' },
    { url: huggingfaceUrl, icon: <Brain size={17} />, label: 'Hugging Face' },
    { url: kaggleUrl, icon: <BarChart3 size={17} />, label: 'Kaggle' },
  ].filter((s) => s.url) as { url: string; icon: React.ReactNode; label: string }[]

  /* ── Mobile fullscreen menu ── */
  const mobileMenuContent = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            className="md:hidden fixed inset-0 bg-black/40 backdrop-blur-sm"
            style={{ zIndex: 9998 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <motion.div
            id="mobile-menu"
            className="md:hidden fixed inset-0 overflow-y-auto"
            style={{ zIndex: 9999, backgroundColor: 'var(--page-bg)' }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-6 h-16 border-b"
              style={{ borderColor: 'var(--border-warm)' }}
            >
              <span
                className="text-lg font-bold tracking-tight"
                style={{ color: 'var(--text-primary)' }}
              >
                {displayName.split(' ')[0]}
                <span className="text-[#8B5CF6]">.</span>
              </span>
              <button
                className="p-2 transition-colors hover:text-[#8B5CF6]"
                style={{ color: 'var(--text-muted)' }}
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            {/* Links */}
            <div className="px-6 py-10 space-y-0">
              {/* Home link */}
              {[{ name: 'Home', href: '#home' }, ...navLinks].map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href) }}
                  onKeyDown={(e) => handleKeyDown(e, link.href)}
                  tabIndex={0}
                  className="block py-4 text-2xl font-semibold border-b transition-colors"
                  style={{
                    borderColor: 'var(--border-warm)',
                    color: activeSection === link.href.slice(1) ? '#8B5CF6' : 'var(--text-muted)',
                  }}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.22, delay: i * 0.055 }}
                >
                  {link.name}
                </motion.a>
              ))}

              {/* Social */}
              {socialIcons.length > 0 && (
                <motion.div
                  className="pt-8 flex gap-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.32 }}
                >
                  {socialIcons.map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-xl border transition-all"
                      style={{ borderColor: 'var(--border-warm)', color: 'var(--text-muted)' }}
                      aria-label={s.label}
                    >
                      {s.icon}
                    </a>
                  ))}
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
        style={{
          /* On scroll: add page-bg tint + blur. At top: fully transparent */
          backgroundColor: isScrolled ? 'color-mix(in srgb, var(--page-bg) 85%, transparent)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--border-warm)' : 'none',
        }}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-18">

            {/* Logo — left */}
            <motion.a
              href="#home"
              onClick={(e) => { e.preventDefault(); scrollToSection('#home') }}
              className="text-base font-bold tracking-tight flex-shrink-0"
              style={{ color: 'var(--text-primary)' }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
            >
              {displayName.split(' ')[0]}
              <span
                className="text-[#8B5CF6] text-xl font-black"
                style={{ textShadow: '0 0 10px rgba(139,92,246,0.5)' }}
              >
                .
              </span>
            </motion.a>

            {/* ── Centre dark pill (bartbeyond.art style) ── */}
            <motion.div
              className="hidden md:flex items-center rounded-full px-2 py-1.5 gap-0.5"
              style={{
                /* Dark in light mode, frosted dark in dark mode */
                backgroundColor: 'var(--nav-pill-bg, #1A1A1A)',
              }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollToSection(link.href) }}
                  onKeyDown={(e) => handleKeyDown(e, link.href)}
                  tabIndex={0}
                  className="relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 select-none cursor-pointer"
                  style={{
                    color: activeSection === link.href.slice(1) ? '#fff' : 'rgba(255,255,255,0.55)',
                    background: activeSection === link.href.slice(1)
                      ? 'rgba(139,92,246,0.25)'
                      : 'transparent',
                  }}
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.15 + i * 0.07 }}
                  aria-current={activeSection === link.href.slice(1) ? 'page' : undefined}
                  whileHover={{ color: '#fff' }}
                >
                  {link.name}
                  {activeSection === link.href.slice(1) && (
                    <motion.span
                      className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8B5CF6]"
                      layoutId="nav-pill-dot"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                </motion.a>
              ))}
            </motion.div>

            {/* Right — ThemeToggle */}
            <motion.div
              className="hidden md:flex items-center"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <ThemeToggle />
            </motion.div>

            {/* Mobile burger */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <button
                className="relative z-[10000] p-2 transition-colors touch-manipulation hover:text-[#8B5CF6]"
                style={{ color: 'var(--text-muted)' }}
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
      </nav>

      {/* Nav pill colour for dark mode — injected via CSS variable via style tag trick */}
      <style>{`
        :root { --nav-pill-bg: #1A1A1A; }
        .dark  { --nav-pill-bg: rgba(255,255,255,0.07); }
      `}</style>

      {mounted && createPortal(mobileMenuContent, document.body)}
    </>
  )
}
