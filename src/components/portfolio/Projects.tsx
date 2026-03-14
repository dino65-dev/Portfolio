import { motion, useInView } from 'motion/react'
import { ExternalLink, Github, ArrowUpRight, Layers, Sparkles } from 'lucide-react'
import { useRef } from 'react'

interface Project {
  id: string
  title: string
  description?: string | null
  imageUrl?: string | null
  githubUrl?: string | null
  liveUrl?: string | null
  technologies?: string[] | null
  featured: boolean
}

interface ProjectsProps {
  projects?: Project[]
}

/** Update CSS custom props for spotlight effect on card */
function handleSpotlight(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
}

/** Update CSS custom props for 3D tilt effect */
function handleTilt(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
  const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
  e.currentTarget.style.setProperty('--tilt-x', `${x}`)
  e.currentTarget.style.setProperty('--tilt-y', `${y}`)
}

function resetTilt(e: React.MouseEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--tilt-x', '0')
  e.currentTarget.style.setProperty('--tilt-y', '0')
}

export function Projects({ projects = [] }: ProjectsProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const featuredProjects = projects.filter((p) => p.featured)
  const otherProjects = projects.filter((p) => !p.featured)

  if (projects.length === 0) {
    return (
      <section
        ref={sectionRef}
        id="projects"
        className="py-16 sm:py-20 lg:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white dark:bg-[#0A0A0F]" />
        <div className="absolute inset-0 grid-bg opacity-40" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="mb-12 sm:mb-16 lg:mb-20"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-full mb-6 border border-[#8B5CF6]/20">
              <Layers className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-xs sm:text-sm font-medium text-[#8B5CF6]">Portfolio</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1F2C] dark:text-white mb-4">
              Selected{' '}
              <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#8E9196] max-w-2xl">
              Projects will appear here once added from the admin panel.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="projects"
      className="py-16 sm:py-20 lg:py-32 relative overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-white dark:bg-[#0A0A0F]" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#8B5CF6]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-[#D946EF]/5 to-transparent rounded-full blur-3xl" />
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
            <Layers className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs sm:text-sm font-medium text-[#8B5CF6]">Portfolio</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#1A1F2C] dark:text-white mb-4">
            Selected{' '}
            <span className="gradient-text">Projects</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#8E9196] max-w-2xl">
            A collection of projects showcasing my work and skills.
          </p>
        </motion.div>

        {/* Featured Projects - Spotlight cards with animated borders */}
        {featuredProjects.length > 0 && (
          <div className="space-y-8 sm:space-y-12 mb-16 sm:mb-20">
            {featuredProjects.map((project, index) => (
              <motion.article
                key={project.id}
                className="spotlight-card animated-border group relative rounded-3xl overflow-hidden bg-white dark:bg-[#111118] border border-[#E8E8E6]/50 dark:border-white/5 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-[#8B5CF6]/10"
                style={{ borderRadius: '1.5rem' }}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                onMouseMove={(e) => {
                  handleSpotlight(e)
                }}
              >
                <div className={`grid lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Image with overlay */}
                  <div className={`relative overflow-hidden ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <motion.img
                      src={
                        project.imageUrl ||
                        'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80'
                      }
                      alt={project.title}
                      className="w-full aspect-[4/3] lg:aspect-auto lg:h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#8B5CF6]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Featured badge with glow */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-[#111118]/90 backdrop-blur-sm rounded-full text-xs font-semibold text-[#8B5CF6] border border-[#8B5CF6]/20 shadow-lg shadow-[#8B5CF6]/10">
                        <Sparkles size={12} />
                        Featured
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`p-6 sm:p-8 lg:p-12 flex flex-col justify-center relative z-10 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1F2C] dark:text-white mb-3 sm:mb-4 group-hover:text-[#8B5CF6] transition-colors duration-300 neon-text-hover">
                      {project.title}
                    </h3>
                    <p className="text-sm sm:text-base text-[#8E9196] leading-relaxed mb-6">
                      {project.description || 'No description available.'}
                    </p>

                    {/* Technologies - Skill chips */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech, techIdx) => (
                          <motion.span
                            key={tech}
                            className="skill-chip px-3 py-1.5 text-xs font-medium text-[#8B5CF6] bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-full border border-[#8B5CF6]/10 dark:border-[#8B5CF6]/20"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: 0.4 + techIdx * 0.05 }}
                          >
                            {tech}
                          </motion.span>
                        ))}
                      </div>
                    )}

                    {/* Links with neon hover */}
                    <div className="flex flex-wrap gap-4">
                      {project.githubUrl && (
                        <motion.a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neon-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-[#1A1F2C] dark:text-white bg-[#F5F5F3] dark:bg-white/5 rounded-xl hover:bg-[#8B5CF6] hover:text-white transition-all duration-300 group/btn touch-manipulation"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Github size={16} />
                          <span className="hidden sm:inline">View Code</span>
                          <span className="sm:hidden">Code</span>
                          <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                          />
                        </motion.a>
                      )}
                      {project.liveUrl && (
                        <motion.a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="neon-btn inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] rounded-xl shadow-lg shadow-[#8B5CF6]/20 hover:shadow-xl hover:shadow-[#8B5CF6]/40 transition-all group/btn touch-manipulation"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <ExternalLink size={16} />
                          <span className="hidden sm:inline">Live Demo</span>
                          <span className="sm:hidden">Demo</span>
                          <ArrowUpRight
                            size={14}
                            className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                          />
                        </motion.a>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* Other Projects - 3D tilt cards with spotlight */}
        {otherProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-[#1A1F2C] dark:text-white mb-8 flex items-center gap-2">
              <span className="w-8 h-[2px] bg-gradient-to-r from-[#8B5CF6] to-[#D946EF]" />
              More Projects
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {otherProjects.map((project, index) => (
                <motion.a
                  key={project.id}
                  href={project.githubUrl || project.liveUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="spotlight-card animated-border tilt-3d group relative p-5 sm:p-6 border border-[#E8E8E6]/50 dark:border-white/5 bg-white dark:bg-[#111118] transition-all duration-300 touch-manipulation overflow-hidden"
                  style={{ borderRadius: '1rem' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  onMouseMove={(e) => {
                    handleSpotlight(e)
                    handleTilt(e)
                  }}
                  onMouseLeave={resetTilt}
                >
                  <div className="relative z-10 tilt-content">
                    {/* Arrow icon */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6]/10 to-[#D946EF]/10 flex items-center justify-center group-hover:from-[#8B5CF6]/20 group-hover:to-[#D946EF]/20 transition-colors group-hover:shadow-lg group-hover:shadow-[#8B5CF6]/10">
                        <ArrowUpRight
                          size={18}
                          className="text-[#8B5CF6] transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                    </div>

                    <h4 className="text-base sm:text-lg font-bold text-[#1A1F2C] dark:text-white mb-2 group-hover:text-[#8B5CF6] transition-colors neon-text-hover">
                      {project.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#8E9196] leading-relaxed mb-4 line-clamp-2">
                      {project.description || 'No description available.'}
                    </p>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="px-2.5 py-0.5 text-[10px] sm:text-xs font-medium text-[#8B5CF6] bg-[#8B5CF6]/5 dark:bg-[#8B5CF6]/10 rounded-full border border-[#8B5CF6]/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  )
}
