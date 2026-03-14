import { useState, useEffect, useCallback, useRef } from 'react'
import { motion } from 'motion/react'
import { MapPin, Sparkles, ArrowRight, ChevronDown } from 'lucide-react'

interface HeroProps {
  profile?: {
    displayName?: string | null
    tagline?: string | null
    heroTitle?: string | null
    heroSubtitle?: string | null
    avatarUrl?: string | null
    location?: string | null
  } | null
}

function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayText, setDisplayText] = useState('')
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    const startTimeout = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayText(text.slice(0, i + 1))
          i++
        } else {
          clearInterval(interval)
          setTimeout(() => setShowCursor(false), 2000)
        }
      }, 60)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(startTimeout)
  }, [text, delay])

  return (
    <span>
      {displayText}
      {showCursor && (
        <span
          className="inline-block w-[3px] h-[0.85em] bg-[#8B5CF6] ml-1 align-text-bottom rounded-sm"
          style={{ animation: 'typewriter-cursor 0.8s step-end infinite' }}
        />
      )}
    </span>
  )
}

export function Hero({ profile }: HeroProps) {
  const heroRef = useRef<HTMLElement>(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!heroRef.current) return
    const rect = heroRef.current.getBoundingClientRect()
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }, [])

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const name = profile?.displayName || 'Welcome'
  const title = profile?.heroTitle || profile?.tagline || 'Developer & Creator'
  const subtitle = profile?.heroSubtitle || 'Building amazing things with code'
  const avatar =
    profile?.avatarUrl ||
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80'
  const location = profile?.location || ''

  return (
    <section
      ref={heroRef}
      id="home"
      onMouseMove={handleMouseMove}
      className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16 sm:pt-0"
    >
      {/* Base background */}
      <div className="absolute inset-0 bg-[#FAFAF8] dark:bg-[#0A0A0F]" />

      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-bg opacity-60" />

      {/* Mouse-following spotlight */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300"
        style={{
          background: `radial-gradient(800px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139,92,246,0.07), transparent 40%)`,
        }}
      />

      {/* Animated gradient orbs */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full opacity-20 dark:opacity-15 animate-morph"
        style={{
          background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)',
        }}
        animate={{ x: [0, 30, -20, 0], y: [0, -20, 30, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/4 w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full opacity-15 dark:opacity-10 animate-morph"
        style={{
          background: 'radial-gradient(circle, rgba(217,70,239,0.5) 0%, transparent 70%)',
          animationDelay: '4s',
        }}
        animate={{ x: [0, -30, 20, 0], y: [0, 20, -30, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Subtle noise texture */}
      <div className="absolute inset-0 noise-overlay pointer-events-none" />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            {/* Status badge with animated border */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 dark:border-[#8B5CF6]/30 mb-6 animated-border animated-border-always"
              style={{ borderRadius: '9999px' }}
            >
              <span className="relative flex h-2 w-2 z-10">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]" />
              </span>
              {location ? (
                <span className="text-xs sm:text-sm font-medium text-[#8B5CF6] z-10">
                  <MapPin size={12} className="inline mr-1" />
                  {location}
                </span>
              ) : (
                <span className="text-xs sm:text-sm font-medium text-[#8B5CF6] z-10">
                  Available for work
                </span>
              )}
            </motion.div>

            {/* Name with typewriter */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1A1F2C] dark:text-white leading-[1.1] mb-4 sm:mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <TypewriterText text={name} delay={300} />
            </motion.h1>

            {/* Title with gradient */}
            <motion.p
              className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 sm:mb-5"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className="gradient-text">{title}</span>
            </motion.p>

            {/* Subtitle */}
            <motion.p
              className="text-sm sm:text-base md:text-lg text-[#8E9196] leading-relaxed mb-8 sm:mb-10 max-w-lg mx-auto lg:mx-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {subtitle}
            </motion.p>

            {/* CTA Buttons with neon glow */}
            <motion.div
              className="flex flex-col sm:flex-row flex-wrap justify-center lg:justify-start gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {/* Primary CTA - Neon glow button */}
              <motion.button
                onClick={scrollToProjects}
                className="neon-btn group relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white text-sm font-semibold rounded-2xl overflow-hidden shadow-lg shadow-[#8B5CF6]/25 hover:shadow-[#8B5CF6]/50 transition-all duration-300"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                <span className="relative flex items-center justify-center gap-2 z-10">
                  <Sparkles size={16} />
                  View Projects
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>

              {/* Secondary CTA - Animated border on hover */}
              <motion.a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault()
                  document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="animated-border group w-full sm:w-auto px-8 py-4 text-sm font-semibold text-center transition-all duration-300 bg-white dark:bg-[#0A0A0F] text-[#1A1F2C] dark:text-white hover:text-[#8B5CF6] border border-[#E8E8E6] dark:border-white/10 hover:border-transparent"
                style={{ borderRadius: '1rem' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="relative flex items-center justify-center gap-2 z-10">
                  Get in Touch
                </span>
              </motion.a>
            </motion.div>
          </div>

          {/* Avatar - Creative floating design */}
          <motion.div
            className="order-1 lg:order-2 flex justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative animate-float">
              {/* Outer glow ring */}
              <div className="absolute -inset-6 sm:-inset-8 rounded-full bg-gradient-to-r from-[#8B5CF6]/20 via-[#D946EF]/20 to-[#0EA5E9]/20 animate-spin-slow blur-xl" />

              {/* Orbiting dot 1 */}
              <motion.div
                className="absolute -inset-4 sm:-inset-6"
                animate={{ rotate: 360 }}
                transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#8B5CF6] shadow-lg shadow-[#8B5CF6]/50" />
              </motion.div>

              {/* Orbiting dot 2 */}
              <motion.div
                className="absolute -inset-8 sm:-inset-12"
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-2 h-2 rounded-full bg-[#D946EF] shadow-lg shadow-[#D946EF]/50" />
              </motion.div>

              {/* Orbiting dot 3 */}
              <motion.div
                className="absolute -inset-10 sm:-inset-16"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              >
                <div className="absolute bottom-0 left-1/4 w-1.5 h-1.5 rounded-full bg-[#0EA5E9] shadow-lg shadow-[#0EA5E9]/50" />
              </motion.div>

              {/* Avatar container */}
              <div className="relative w-48 h-48 sm:w-60 sm:h-60 md:w-72 md:h-72 lg:w-80 lg:h-80">
                {/* Gradient border ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#D946EF] to-[#0EA5E9] animate-pulse-ring" />

                {/* Image */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white dark:border-[#0A0A0F]">
                  <img
                    src={avatar}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#8B5CF6]/10 to-transparent" />
                </div>
              </div>

              {/* Floating glassmorphism badge */}
              <motion.div
                className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 px-4 py-2 rounded-2xl glass shadow-xl border border-[#8B5CF6]/20"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span className="text-xs sm:text-sm font-semibold text-[#1A1F2C] dark:text-white flex items-center gap-1.5">
                  <Sparkles size={14} className="text-[#8B5CF6]" />
                  Open to work
                </span>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <motion.button
            onClick={scrollToProjects}
            className="flex flex-col items-center gap-2 group cursor-pointer"
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span className="text-[10px] text-[#8E9196] tracking-widest uppercase group-hover:text-[#8B5CF6] transition-colors">
              Scroll
            </span>
            <ChevronDown size={16} className="text-[#8E9196] group-hover:text-[#8B5CF6] transition-colors" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
