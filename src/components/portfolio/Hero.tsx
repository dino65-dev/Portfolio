import { useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'

interface HeroProps {
  profile?: {
    displayName?: string | null
    tagline?: string | null
    heroTitle?: string | null
    heroSubtitle?: string | null
    avatarUrl?: string | null
    location?: string | null
    linkedinUrl?: string | null
  } | null
}

export function Hero({ profile }: HeroProps) {
  const [mode, setMode] = useState<'available' | 'busy'>('available')

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const name = profile?.displayName || 'Welcome'
  const title = profile?.heroTitle || profile?.tagline || 'Developer & Creator'
  const subtitle =
    profile?.heroSubtitle || 'Building amazing things with code'
  const avatar =
    profile?.avatarUrl ||
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=800&q=80'
  const location = profile?.location || ''
  const linkedinUrl = profile?.linkedinUrl

  // Split name into words for stacked display
  const nameWords = name.split(' ')

  return (
    <section
      id="home"
      className="fold-glow relative min-h-screen flex overflow-hidden"
    >
      {/* ════════════════════════════════
          LEFT PANEL — text content
          ════════════════════════════════ */}
      <div
        className="w-full lg:w-[54%] xl:w-[52%] relative flex flex-col justify-center
                   px-8 sm:px-12 lg:px-16 xl:px-24 pt-24 pb-16 lg:pb-24 z-10"
        style={{ backgroundColor: 'var(--left-panel-bg)' }}
      >
        {/* ── Availability mode toggle (bartbeyond.art "Real / Corporate" style) ── */}
        <motion.div
          className="flex items-center gap-3 mb-10"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
        >
          <span
            className="text-sm font-semibold"
            style={{
              color: mode === 'available' ? '#8B5CF6' : 'var(--text-muted)',
            }}
          >
            Available
          </span>
          {/* Toggle switch */}
          <button
            onClick={() => setMode(mode === 'available' ? 'busy' : 'available')}
            className="relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none"
            style={{
              backgroundColor: mode === 'available' ? '#8B5CF6' : 'var(--border-warm)',
            }}
            aria-label="Toggle availability"
          >
            <span
              className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300"
              style={{
                transform: mode === 'available' ? 'translateX(0)' : 'translateX(20px)',
              }}
            />
          </button>
          <span
            className="text-sm font-semibold"
            style={{
              color: mode === 'busy' ? '#8B5CF6' : 'var(--text-muted)',
            }}
          >
            Busy
          </span>
          {location && (
            <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              · {location}
            </span>
          )}
        </motion.div>

        {/* ── Name — stacked, massive, bold ── */}
        <h1
          className="font-black tracking-tight leading-[0.92] uppercase mb-6"
          style={{
            fontSize: 'clamp(3.2rem, 9vw + 0.5rem, 7.5rem)',
            color: 'var(--text-primary)',
          }}
        >
          {nameWords.map((word, i) => (
            <motion.div
              key={word + i}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.65,
                delay: 0.1 + i * 0.12,
                ease: [0.23, 1, 0.32, 1],
              }}
            >
              {word}
            </motion.div>
          ))}
        </h1>

        {/* ── Title — italic accent line ── */}
        <motion.p
          className="font-semibold italic mb-5"
          style={{
            fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
            color: '#8B5CF6',
          }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 + nameWords.length * 0.12 }}
        >
          {title}
        </motion.p>

        {/* ── Subtitle ── */}
        <motion.p
          className="leading-relaxed mb-10 max-w-md"
          style={{
            fontSize: 'clamp(0.9rem, 1.6vw, 1.05rem)',
            color: 'var(--text-muted)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.15 + nameWords.length * 0.12,
          }}
        >
          {subtitle}
        </motion.p>

        {/* ── CTAs — purple pill + text link (bartbeyond.art "Scroll for work" style) ── */}
        <motion.div
          className="flex flex-wrap items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.55,
            delay: 0.22 + nameWords.length * 0.12,
          }}
        >
          <motion.button
            onClick={scrollToProjects}
            className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-semibold text-sm text-white
                       bg-[#8B5CF6] hover:bg-[#7C3AED] transition-all duration-300
                       hover:shadow-[0_0_28px_rgba(139,92,246,0.5)]"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Scroll for work
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>

          {/* Secondary — text link (like "LinkedIn, if you must") */}
          {linkedinUrl ? (
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium transition-colors hover:text-[#8B5CF6] underline underline-offset-4"
              style={{ color: '#8B5CF6' }}
            >
              LinkedIn, if you must
            </a>
          ) : (
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="text-sm font-medium transition-colors hover:text-[#8B5CF6] underline underline-offset-4"
              style={{ color: '#8B5CF6' }}
            >
              Get in touch
            </motion.a>
          )}
        </motion.div>

        {/* Scroll indicator — bottom of left panel */}
        <motion.button
          onClick={scrollToProjects}
          className="absolute bottom-8 left-8 sm:left-12 lg:left-16 xl:left-24
                     hidden md:flex flex-col items-start gap-1 group cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <motion.span
            className="text-[10px] tracking-[0.2em] uppercase transition-colors"
            style={{ color: 'var(--text-muted)' }}
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            Scroll
          </motion.span>
          <ChevronDown
            size={14}
            style={{ color: 'var(--text-muted)' }}
            className="group-hover:text-[#8B5CF6] transition-colors"
          />
        </motion.button>
      </div>

      {/* ════════════════════════════════
          RIGHT PANEL — warped glass strips
          ════════════════════════════════ */}
      <motion.div
        className="hidden lg:block lg:w-[46%] xl:w-[48%] relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
      >
        {/* SVG filter: ribbed-glass refraction displacement
            feTurbulence high-X / low-Y frequency → vertical stripe noise
            feDisplacementMap shifts pixels horizontally per stripe → refraction
        */}
        <svg className="absolute" width="0" height="0" aria-hidden="true">
          <defs>
            <filter id="ribbed-glass-refraction" x="0%" y="0%" width="100%" height="100%">
              {/* Vertical-band noise: 0.04 X = ~20 columns, 0.001 Y = near-constant top-to-bottom */}
              <feTurbulence
                type="turbulence"
                baseFrequency="0.04 0.001"
                numOctaves={3}
                seed={5}
                result="noise"
              />
              {/* Displace source image by the noise — horizontal shift per column */}
              <feDisplacementMap
                in="SourceGraphic"
                in2="noise"
                scale={18}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>

        {/* Base image — refraction-distorted + subtle brightness/contrast */}
        <img
          src={avatar}
          alt={name}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            filter: 'url(#ribbed-glass-refraction) brightness(0.82) contrast(1.05) saturate(0.9)',
          }}
        />

        {/* ── Vertical ribbed glass strips ──
            Each strip is a thin vertical pane of frosted glass.
            Effect: blur-only backdropFilter (no brightness reduction),
            near-invisible white frost tint, bright left-edge hairline.
            Varying blur across strips simulates refractive distortion.
        */}
        {[
          { left:  '0.00%', width: '2.5%', blur:  3 },
          { left:  '2.50%', width: '2.5%', blur: 14 },
          { left:  '5.00%', width: '2.5%', blur:  5 },
          { left:  '7.50%', width: '2.5%', blur: 18 },
          { left: '10.00%', width: '2.5%', blur:  4 },
          { left: '12.50%', width: '2.5%', blur: 22 },
          { left: '15.00%', width: '2.5%', blur:  6 },
          { left: '17.50%', width: '2.5%', blur: 16 },
          { left: '20.00%', width: '2.5%', blur:  3 },
          { left: '22.50%', width: '2.5%', blur: 20 },
          { left: '25.00%', width: '2.5%', blur:  5 },
          { left: '27.50%', width: '2.5%', blur: 12 },
          { left: '30.00%', width: '2.5%', blur:  7 },
          { left: '32.50%', width: '2.5%', blur: 24 },
          { left: '35.00%', width: '2.5%', blur:  4 },
          { left: '37.50%', width: '2.5%', blur: 18 },
          { left: '40.00%', width: '2.5%', blur:  6 },
          { left: '42.50%', width: '2.5%', blur: 14 },
          { left: '45.00%', width: '2.5%', blur:  3 },
          { left: '47.50%', width: '2.5%', blur: 20 },
          { left: '50.00%', width: '2.5%', blur:  5 },
          { left: '52.50%', width: '2.5%', blur: 16 },
          { left: '55.00%', width: '2.5%', blur:  8 },
          { left: '57.50%', width: '2.5%', blur: 22 },
          { left: '60.00%', width: '2.5%', blur:  4 },
          { left: '62.50%', width: '2.5%', blur: 12 },
          { left: '65.00%', width: '2.5%', blur:  6 },
          { left: '67.50%', width: '2.5%', blur: 18 },
          { left: '70.00%', width: '2.5%', blur:  3 },
          { left: '72.50%', width: '2.5%', blur: 24 },
          { left: '75.00%', width: '2.5%', blur:  5 },
          { left: '77.50%', width: '2.5%', blur: 14 },
          { left: '80.00%', width: '2.5%', blur:  7 },
          { left: '82.50%', width: '2.5%', blur: 20 },
          { left: '85.00%', width: '2.5%', blur:  4 },
          { left: '87.50%', width: '2.5%', blur: 16 },
          { left: '90.00%', width: '2.5%', blur:  6 },
          { left: '92.50%', width: '2.5%', blur: 22 },
          { left: '95.00%', width: '2.5%', blur:  3 },
          { left: '97.50%', width: '2.5%', blur: 10 },
        ].map((s, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{
              left: s.left,
              width: s.width,
              /* Blur only — no brightness modifier to avoid dark/black strips */
              backdropFilter: `blur(${s.blur}px)`,
              WebkitBackdropFilter: `blur(${s.blur}px)`,
              /* Near-invisible white frost — just enough to feel like glass */
              background: 'rgba(255,255,255,0.018)',
              /* Bright hairline on left edge: light catching the glass seam */
              borderLeft: '1px solid rgba(255,255,255,0.13)',
            }}
          />
        ))}

        {/* Left edge-blend — left panel bg bleeds in */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to right, var(--left-panel-bg) 0%, transparent 22%)',
          }}
        />

        {/* Location tag — bottom-left */}
        {location && (
          <div
            className="absolute bottom-5 left-6 text-[10px] tracking-widest uppercase z-10"
            style={{ color: 'rgba(255,255,255,0.22)' }}
          >
            {location}
          </div>
        )}
      </motion.div>

      {/* Mobile-only: small circular avatar below content (lg: hidden) */}
      <motion.div
        className="lg:hidden absolute bottom-8 right-6 w-20 h-20 rounded-full overflow-hidden
                   border-2 border-[#8B5CF6]/40 shadow-lg shadow-[#8B5CF6]/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <img src={avatar} alt={name} className="w-full h-full object-cover" />
      </motion.div>
    </section>
  )
}
