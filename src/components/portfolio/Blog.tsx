import { motion, useInView } from 'motion/react'
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  Sparkles,
  ExternalLink,
  RefreshCw,
} from 'lucide-react'
import { useRef, useState } from 'react'
import type { MediumPost } from '@/server/functions/portfolio'

interface BlogProps {
  posts?: MediumPost[]
  blogSiteUrl?: string
  mediumUrl?: string
}

/** Update CSS custom props for spotlight effect on card */
function handleSpotlight(e: React.MouseEvent<HTMLElement>) {
  const rect = e.currentTarget.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  e.currentTarget.style.setProperty('--mouse-x', `${x}px`)
  e.currentTarget.style.setProperty('--mouse-y', `${y}px`)
}

export function Blog({
  posts = [],
  blogSiteUrl = 'https://dinmaysblog.onrender.com',
  mediumUrl = 'https://medium.com/@dinmaybrahma',
}: BlogProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })
  const [isRefreshing, setIsRefreshing] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const categoryColors: Record<string, string> = {
    'Machine Learning': 'from-[#8B5CF6] to-[#7E69AB]',
    MLOps: 'from-[#0EA5E9] to-[#8B5CF6]',
    'Open Source': 'from-[#10B981] to-[#0EA5E9]',
    'Deep Learning': 'from-[#D946EF] to-[#8B5CF6]',
    AI: 'from-[#F97316] to-[#D946EF]',
    Python: 'from-[#3B82F6] to-[#10B981]',
    Programming: 'from-[#6366F1] to-[#8B5CF6]',
    Technology: 'from-[#0EA5E9] to-[#6366F1]',
    Blog: 'from-[#8B5CF6] to-[#D946EF]',
  }

  const getCategoryColor = (category: string): string => {
    return categoryColors[category] || 'from-[#8B5CF6] to-[#D946EF]'
  }

  const getPostImage = (post: MediumPost, index: number): string => {
    if (post.thumbnail) return post.thumbnail
    const placeholders = [
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
      'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&q=80',
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80',
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
    ]
    return placeholders[index % placeholders.length]
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    window.location.reload()
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <section
        ref={sectionRef}
        id="blog"
        className="py-16 sm:py-20 lg:py-32 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[#FAFAF8] dark:bg-[#0A0A0F]" />
        <div className="absolute inset-0 grid-bg opacity-40" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6]/5 to-[#D946EF]/5 dark:from-[#8B5CF6]/10 dark:to-[#D946EF]/10 rounded-full mb-6 border border-[#8B5CF6]/20">
              <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
              <span className="text-xs sm:text-sm font-medium text-[#8B5CF6]">
                Blog & Articles
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1F2C] dark:text-white mb-6">
              Thoughts &{' '}
              <span className="gradient-text">Insights</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-[#8E9196] max-w-2xl mx-auto mb-10 px-4">
              I write about AI, machine learning, and software development.
              Check out my blog for the latest articles and tutorials.
            </p>

            {/* Blog Site Card - Spotlight + animated border */}
            <motion.a
              href={blogSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block max-w-xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <div
                className="spotlight-card animated-border relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] p-6 sm:p-8 text-left group border border-white/5 hover-lift"
                style={{ borderRadius: '1rem' }}
                onMouseMove={handleSpotlight}
              >
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] flex items-center justify-center shrink-0 shadow-lg shadow-[#8B5CF6]/25">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white">
                        Dinmay's Blog
                      </h3>
                      <p className="text-white/50 text-xs sm:text-sm truncate">
                        dinmaysblog.onrender.com
                      </p>
                    </div>
                  </div>
                  <p className="text-white/60 mb-4 text-sm sm:text-base">
                    Visit my personal blog for in-depth articles on machine
                    learning, MLOps, and software engineering best practices.
                  </p>
                  <div className="flex items-center gap-2 text-[#D946EF] font-semibold text-sm">
                    <span>Visit Blog</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </motion.a>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <motion.a
                href={mediumUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="neon-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white font-semibold rounded-2xl shadow-lg shadow-[#8B5CF6]/25 hover:shadow-xl hover:shadow-[#8B5CF6]/40 transition-all text-sm touch-manipulation"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                View on Medium
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section
      ref={sectionRef}
      id="blog"
      className="py-16 sm:py-20 lg:py-32 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[#FAFAF8] dark:bg-[#0A0A0F]" />
      <div className="absolute inset-0 grid-bg opacity-40" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-gradient-to-tr from-[#D946EF]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12 sm:mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#8B5CF6]/5 to-[#D946EF]/5 dark:from-[#8B5CF6]/10 dark:to-[#D946EF]/10 rounded-full mb-6 border border-[#8B5CF6]/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <BookOpen className="w-4 h-4 text-[#8B5CF6]" />
            <span className="text-xs sm:text-sm font-medium text-[#8B5CF6]">
              Blog & Articles
            </span>
            <span
              className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"
              title="Live from Medium"
            />
          </motion.div>

          <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A1F2C] dark:text-white mb-6">
            Thoughts &{' '}
            <span className="gradient-text">Insights</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-[#8E9196] max-w-2xl mx-auto px-4">
            Sharing knowledge about AI, machine learning, and software
            development through articles and tutorials.
          </p>

          {/* Live indicator */}
          <motion.div
            className="flex items-center justify-center gap-3 mt-4 text-xs sm:text-sm text-[#8E9196]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5 }}
          >
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/5 border border-green-500/10">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live from Medium
            </span>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1.5 px-3 py-1 rounded-full hover:bg-[#8B5CF6]/5 hover:text-[#8B5CF6] transition-all touch-manipulation"
              disabled={isRefreshing}
            >
              <RefreshCw
                className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`}
              />
              Refresh
            </button>
          </motion.div>
        </motion.div>

        {/* Featured Post - Hero card with spotlight + animated border */}
        {posts.length > 0 && (
          <motion.article
            className="mb-8 sm:mb-12"
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <a
              href={posts[0].link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div
                className="spotlight-card animated-border relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1A1F2C] to-[#2A2F3C] dark:from-[#111118] dark:to-[#0A0A0F] border border-white/5 transition-all duration-500 shadow-xl hover:shadow-2xl hover:shadow-[#8B5CF6]/10"
                style={{ borderRadius: '1.5rem' }}
                onMouseMove={handleSpotlight}
              >
                <div className="grid lg:grid-cols-2 gap-0">
                  {/* Image */}
                  <div className="relative h-48 sm:h-64 lg:h-auto lg:min-h-[320px] overflow-hidden">
                    <motion.img
                      src={getPostImage(posts[0], 0)}
                      alt={posts[0].title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-[#1A1F2C]/80 via-[#1A1F2C]/40 to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="relative p-6 sm:p-8 lg:p-12 flex flex-col justify-center z-10">
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap">
                      {posts[0].categories.slice(0, 2).map((category, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(category)} rounded-full shadow-sm`}
                        >
                          {category}
                        </span>
                      ))}
                      <span className="px-3 py-1 text-xs font-semibold text-white/80 bg-white/10 backdrop-blur-sm rounded-full flex items-center gap-1 border border-white/5">
                        <Sparkles className="w-3 h-3" />
                        Latest
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-[#D946EF] transition-colors line-clamp-2 neon-text-hover">
                      {posts[0].title}
                    </h3>

                    <p className="text-white/60 leading-relaxed mb-6 line-clamp-2 sm:line-clamp-3 text-sm sm:text-base">
                      {posts[0].description}
                    </p>

                    <div className="flex items-center gap-4 text-white/40 text-xs sm:text-sm mb-6">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(posts[0].pubDate)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {posts[0].readTime}
                      </span>
                    </div>

                    <span className="inline-flex items-center gap-2 text-white font-semibold text-sm group/link">
                      Read on Medium
                      <ExternalLink className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </div>
              </div>
            </a>
          </motion.article>
        )}

        {/* Other Posts Grid - Spotlight cards */}
        {posts.length > 1 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {posts.slice(1).map((post, index) => (
              <motion.article
                key={post.id}
                className="spotlight-card animated-border group relative bg-white dark:bg-[#111118] overflow-hidden border border-[#E8E8E6]/50 dark:border-white/5 transition-all duration-500 hover-lift"
                style={{ borderRadius: '1rem' }}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                onMouseMove={handleSpotlight}
              >
                <a
                  href={post.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  {/* Image */}
                  <div className="relative h-40 sm:h-48 overflow-hidden">
                    <img
                      src={getPostImage(post, index + 1)}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#111118] via-transparent to-transparent" />

                    {/* Category badge */}
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      {post.categories.slice(0, 1).map((category, idx) => (
                        <span
                          key={idx}
                          className={`px-3 py-1 text-xs font-semibold text-white bg-gradient-to-r ${getCategoryColor(category)} rounded-full shadow-lg`}
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 sm:p-6 relative z-10">
                    <div className="flex items-center gap-3 text-[#8E9196] text-xs mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(post.pubDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-[#1A1F2C] dark:text-white mb-3 group-hover:text-[#8B5CF6] transition-colors line-clamp-2 neon-text-hover">
                      {post.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#8E9196] leading-relaxed mb-4 line-clamp-2">
                      {post.description}
                    </p>

                    <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[#8B5CF6] group-hover:text-[#D946EF] transition-colors">
                      Read on Medium
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </a>
              </motion.article>
            ))}
          </div>
        )}

        {/* View All CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.a
            href={mediumUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neon-btn w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white font-semibold rounded-2xl shadow-lg shadow-[#8B5CF6]/25 hover:shadow-xl hover:shadow-[#8B5CF6]/40 transition-all text-sm touch-manipulation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View All on Medium
            <ExternalLink className="w-4 h-4" />
          </motion.a>
          <motion.a
            href={blogSiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="animated-border w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-[#111118] text-[#1A1F2C] dark:text-white font-semibold border border-[#E8E8E6] dark:border-white/10 hover:text-[#8B5CF6] transition-all text-sm touch-manipulation"
            style={{ borderRadius: '1rem' }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Visit Blog Site
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}
