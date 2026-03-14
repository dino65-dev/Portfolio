import { motion, useInView } from 'motion/react'
import { GraduationCap, Heart, Zap, User, Code2 } from 'lucide-react'
import { useRef } from 'react'

interface AboutProps {
  profile?: {
    bio?: string | null
    aboutTitle?: string | null
    education?: string | null
    interests?: string[] | null
    customSkills?: string[] | null
  } | null
}

/** Update CSS custom props for spotlight effect on card */
function handleSpotlight(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
}

export function About({ profile }: AboutProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  const bio =
    profile?.bio ||
    'Welcome to my portfolio. I am passionate about creating amazing digital experiences.'
  const aboutTitle = profile?.aboutTitle || 'Get to know me'
  const education = profile?.education
  const interests = profile?.interests || []
  const skills = profile?.customSkills || []

  return (
    <section
      ref={sectionRef}
      id="about"
      className="py-16 sm:py-20 lg:py-32 relative overflow-hidden"
      style={{ backgroundColor: 'var(--page-bg)' }}
    >
      {/* Background */}
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-72 h-72 bg-gradient-to-r from-[#8B5CF6]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-l from-[#D946EF]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-full mb-6 border border-[#8B5CF6]/20">
            <User className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs sm:text-sm font-medium text-[#8B5CF6]">About</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {aboutTitle}
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 sm:gap-10 lg:gap-12">
          {/* Bio Section */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {/* Bio text - Spotlight card */}
            <div
              className="spotlight-card p-6 sm:p-8 rounded-3xl bg-[var(--card-bg-muted)] dark:bg-[var(--card-bg)] border border-[var(--border-warm)] dark:border-white/5 mb-6"
              style={{ borderRadius: '1.5rem' }}
              onMouseMove={handleSpotlight}
            >
              {bio.split('\n\n').map((paragraph, index) => (
                <motion.p
                  key={index}
                  className="text-sm sm:text-base leading-relaxed mb-4 last:mb-0 relative z-10"
                  style={{ color: 'var(--text-muted)' }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>

            {/* Education Card - Animated border + spotlight */}
            {education && (
              <motion.div
                className="spotlight-card animated-border group p-5 sm:p-6 bg-[var(--card-bg-muted)] dark:bg-[var(--card-bg)] border border-[var(--border-warm)] dark:border-white/5 transition-all duration-300 mb-6"
                style={{ borderRadius: '1rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                onMouseMove={handleSpotlight}
              >
                <div className="flex items-start gap-4 relative z-10">
                  <div className="p-3 bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-2xl group-hover:from-[#8B5CF6]/20 group-hover:to-[#D946EF]/20 transition-colors shrink-0 group-hover:shadow-lg group-hover:shadow-[#8B5CF6]/10">
                    <GraduationCap className="w-6 h-6 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-bold mb-1" style={{ color: 'var(--text-primary)' }}>
                      Education
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{education}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Interests - Interactive skill chips */}
            {interests.length > 0 && (
              <motion.div
                className="spotlight-card p-5 sm:p-6 bg-[var(--card-bg-muted)] dark:bg-[var(--card-bg)] border border-[var(--border-warm)] dark:border-white/5"
                style={{ borderRadius: '1rem' }}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                onMouseMove={handleSpotlight}
              >
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <Heart className="w-5 h-5 text-[#D946EF]" />
                  <h3 className="text-base sm:text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    Interests
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 relative z-10">
                  {interests.map((interest, index) => (
                    <motion.span
                      key={interest}
                      className="skill-chip px-4 py-2 text-xs sm:text-sm font-medium bg-[var(--card-bg-muted)] dark:bg-white/5 rounded-full border border-[var(--border-warm)] dark:border-white/5 cursor-default"
                      style={{ color: 'var(--text-primary)' }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.4 + index * 0.05 }}
                    >
                      {interest}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Skills Section - Creative card with animated elements */}
          {skills.length > 0 && (
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="sticky top-24">
                <div
                  className="spotlight-card animated-border-always animated-border p-6 sm:p-8 bg-[var(--card-bg-muted)] dark:bg-[var(--card-bg)] border border-[var(--border-warm)] dark:border-white/5 overflow-hidden relative"
                  style={{ borderRadius: '1.5rem' }}
                  onMouseMove={handleSpotlight}
                >
                  {/* Decorative gradient blob */}
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10 rounded-full blur-2xl" />

                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="p-2 bg-gradient-to-br from-[#8B5CF6] to-[#D946EF] rounded-xl shadow-lg shadow-[#8B5CF6]/20">
                        <Code2 className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                        Skills & Tech
                      </h3>
                    </div>

                    <div className="space-y-1">
                      {skills.map((skill, index) => (
                        <motion.div
                          key={skill}
                          className="group/skill relative"
                          initial={{ opacity: 0, x: 20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.3 + index * 0.04 }}
                        >
                          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#8B5CF6]/5 dark:hover:bg-[#8B5CF6]/10 transition-all duration-200 cursor-default group-hover/skill:translate-x-1">
                            {/* Animated dot */}
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] group-hover/skill:scale-150 group-hover/skill:shadow-lg group-hover/skill:shadow-[#8B5CF6]/40 transition-all duration-200" />
                            <span className="text-sm font-medium group-hover/skill:text-[#8B5CF6] transition-colors" style={{ color: 'var(--text-primary)' }}>
                              {skill}
                            </span>
                            <Zap className="w-3 h-3 text-[#8B5CF6] opacity-0 group-hover/skill:opacity-100 transition-all duration-200 ml-auto" />
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* Skill count badge */}
                    <div className="mt-6 pt-6 border-t border-[var(--border-warm)] dark:border-white/5">
                      <div className="flex items-center justify-between text-sm">
                        <span style={{ color: 'var(--text-muted)' }}>Total Technologies</span>
                        <span className="px-3 py-1 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white font-bold rounded-full text-xs shadow-lg shadow-[#8B5CF6]/20">
                          {skills.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
