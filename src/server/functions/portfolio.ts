import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import { db } from '../lib/db'
import { Query } from '../lib/db'
import { authMiddleware } from './auth'

// Medium RSS feed URL for the user
const MEDIUM_USERNAME = 'dinmaybrahma'
const MEDIUM_RSS_URL = `https://medium.com/feed/@${MEDIUM_USERNAME}`
const RSS2JSON_API = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(MEDIUM_RSS_URL)}`
const BLOG_SITE_URL = 'https://dinmaysblog.onrender.com'

// Type for Medium blog post
export interface MediumPost {
  id: string
  title: string
  link: string
  pubDate: string
  creator: string
  categories: string[]
  content: string
  thumbnail: string | null
  description: string
  readTime: string
}

// Type for rss2json API response item
interface Rss2JsonItem {
  guid?: string
  link?: string
  title?: string
  pubDate?: string
  author?: string
  categories?: string[]
  content?: string
  description?: string
  thumbnail?: string
}

// Helper to extract thumbnail from content
function extractThumbnail(content: string): string | null {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/)
  return imgMatch ? imgMatch[1] : null
}

// Helper to strip HTML tags
function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .trim()
}

// Helper to estimate read time
function estimateReadTime(content: string): string {
  const words = stripHtml(content).split(/\s+/).length
  const minutes = Math.ceil(words / 200)
  return `${minutes} min read`
}

// Helper to extract description
function extractDescription(content: string, maxLength: number = 160): string {
  const text = stripHtml(content)
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

// Fetch Medium blog posts using rss2json API
export const getMediumPostsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      // Try rss2json API first (more reliable)
      const response = await fetch(RSS2JSON_API, {
        headers: {
          Accept: 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()

        if (data.status === 'ok' && data.items && data.items.length > 0) {
          const posts: MediumPost[] = data.items
            .slice(0, 6)
            .map((item: Rss2JsonItem, index: number) => ({
              id: item.guid || item.link || `post-${index}`,
              title: item.title || 'Untitled',
              link: item.link || '',
              pubDate: item.pubDate || new Date().toISOString(),
              creator: item.author || 'Dinmay Brahma',
              categories:
                item.categories && item.categories.length > 0
                  ? item.categories
                  : ['Blog'],
              content: item.content || item.description || '',
              thumbnail:
                item.thumbnail ||
                extractThumbnail(item.content || item.description || ''),
              description: extractDescription(
                item.description || item.content || '',
              ),
              readTime: estimateReadTime(
                item.content || item.description || '',
              ),
            }))

          return {
            posts,
            blogSiteUrl: BLOG_SITE_URL,
            mediumUrl: `https://medium.com/@${MEDIUM_USERNAME}`,
            error: null,
          }
        }
      }

      // Fallback: try direct RSS fetch
      const rssResponse = await fetch(MEDIUM_RSS_URL, {
        headers: {
          Accept: 'application/rss+xml, application/xml, text/xml',
          'User-Agent': 'Mozilla/5.0 (compatible; PortfolioBot/1.0)',
        },
      })

      if (!rssResponse.ok) {
        console.error('Failed to fetch Medium RSS:', rssResponse.status)
        return {
          posts: [],
          blogSiteUrl: BLOG_SITE_URL,
          mediumUrl: `https://medium.com/@${MEDIUM_USERNAME}`,
          error: 'Could not fetch blog posts',
        }
      }

      const xmlText = await rssResponse.text()

      // Parse RSS XML
      const posts: MediumPost[] = []

      // Extract items from RSS feed using regex (works server-side without DOM)
      const itemRegex = /<item>([\s\S]*?)<\/item>/g
      let match

      while ((match = itemRegex.exec(xmlText)) !== null && posts.length < 6) {
        const itemContent = match[1]

        // Extract fields
        const titleMatch =
          itemContent.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
          itemContent.match(/<title>([\s\S]*?)<\/title>/)
        const linkMatch = itemContent.match(/<link>([\s\S]*?)<\/link>/)
        const pubDateMatch = itemContent.match(/<pubDate>([\s\S]*?)<\/pubDate>/)
        const creatorMatch =
          itemContent.match(
            /<dc:creator><!\[CDATA\[([\s\S]*?)\]\]><\/dc:creator>/,
          ) || itemContent.match(/<dc:creator>([\s\S]*?)<\/dc:creator>/)
        const contentMatch = itemContent.match(
          /<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/,
        )

        // Extract categories
        const categories: string[] = []
        const categoryRegex =
          /<category><!\[CDATA\[([\s\S]*?)\]\]><\/category>/g
        let catMatch
        while ((catMatch = categoryRegex.exec(itemContent)) !== null) {
          categories.push(catMatch[1])
        }

        const title = titleMatch ? titleMatch[1].trim() : 'Untitled'
        const link = linkMatch ? linkMatch[1].trim() : ''
        const pubDate = pubDateMatch
          ? pubDateMatch[1].trim()
          : new Date().toISOString()
        const creator = creatorMatch ? creatorMatch[1].trim() : 'Dinmay Brahma'
        const content = contentMatch ? contentMatch[1] : ''

        posts.push({
          id: link || `post-${posts.length}`,
          title,
          link,
          pubDate,
          creator,
          categories: categories.length > 0 ? categories : ['Blog'],
          content,
          thumbnail: extractThumbnail(content),
          description: extractDescription(content),
          readTime: estimateReadTime(content),
        })
      }

      return {
        posts,
        blogSiteUrl: BLOG_SITE_URL,
        mediumUrl: `https://medium.com/@${MEDIUM_USERNAME}`,
        error: null,
      }
    } catch (error) {
      console.error('Error fetching Medium posts:', error)
      return {
        posts: [],
        blogSiteUrl: BLOG_SITE_URL,
        mediumUrl: `https://medium.com/@${MEDIUM_USERNAME}`,
        error: 'Failed to fetch blog posts',
      }
    }
  },
)

// ============ PUBLIC FUNCTIONS (No auth required) ============

// Get public profile for portfolio display
export const getPublicProfileFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      const result = await db.profileSettings.list([Query.limit(1)])
      if (!result || !result.rows || result.rows.length === 0) {
        return { profile: null }
      }
      const profile = result.rows[0]
      return {
        profile: {
          displayName: profile.displayName,
          tagline: profile.tagline,
          bio: profile.bio,
          avatarUrl: profile.avatarUrl,
          email: profile.email,
          location: profile.location,
          githubUsername: profile.githubUsername,
          linkedinUrl: profile.linkedinUrl,
          twitterUrl: profile.twitterUrl,
          huggingfaceUrl: profile.huggingfaceUrl,
          kaggleUrl: profile.kaggleUrl,
          resumeUrl: profile.resumeUrl,
          heroTitle: profile.heroTitle,
          heroSubtitle: profile.heroSubtitle,
          aboutTitle: profile.aboutTitle,
          education: profile.education,
          interests: profile.interests,
          customSkills: profile.customSkills,
          featuredRepos: profile.featuredRepos,
          themeAccentColor: profile.themeAccentColor,
          showGithubStats: profile.showGithubStats,
        },
      }
    } catch (error) {
      console.error('Error fetching public profile:', error)
      return { profile: null }
    }
  },
)

// Get public projects for portfolio display
export const getPublicProjectsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    try {
      // First, get the profile owner's ID
      const profileResult = await db.profileSettings.list([Query.limit(1)])

      if (
        !profileResult ||
        !profileResult.rows ||
        profileResult.rows.length === 0
      ) {
        // No profile exists yet, return empty projects
        return { projects: [] }
      }

      const profileOwner = profileResult.rows[0].createdBy

      // Fetch projects that belong to the profile owner
      const result = await db.customProjects.list([
        Query.equal('createdBy', [profileOwner]),
        Query.orderAsc('sortOrder'),
      ])

      if (!result || !result.rows) {
        return { projects: [] }
      }

      return {
        projects: result.rows.map((p) => ({
          id: p.$id,
          title: p.title,
          description: p.description,
          imageUrl: p.imageUrl,
          githubUrl: p.githubUrl,
          liveUrl: p.liveUrl,
          technologies: p.technologies,
          featured: p.featured,
          sortOrder: p.sortOrder,
          isFromGithub: p.isFromGithub,
          githubRepoName: p.githubRepoName,
        })),
      }
    } catch (error) {
      console.error('Error fetching public projects:', error)
      return { projects: [] }
    }
  },
)

// Submit contact message (public)
const contactMessageSchema = z.object({
  senderName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  senderEmail: z.string().email('Please enter a valid email'),
  subject: z.string().max(200).optional().nullable(),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000),
})

export const submitContactMessageFn = createServerFn({ method: 'POST' })
  .inputValidator(contactMessageSchema)
  .handler(async ({ data }) => {
    console.log('Submitting contact message:', {
      senderName: data.senderName,
      senderEmail: data.senderEmail,
      hasSubject: !!data.subject,
      messageLength: data.message.length,
    })

    try {
      // Get the profile owner's ID to associate the message
      const profileResult = await db.profileSettings.list([Query.limit(1)])

      console.log('Profile lookup result:', {
        found: profileResult?.rows?.length > 0,
        rowCount: profileResult?.rows?.length,
      })

      if (
        !profileResult ||
        !profileResult.rows ||
        profileResult.rows.length === 0
      ) {
        console.error('No profile found to receive messages')
        throw new Error(
          'Unable to send message at this time. Please try again later.',
        )
      }

      const profileOwner = profileResult.rows[0].createdBy
      console.log('Profile owner ID:', profileOwner)

      // Create the message (no permissions needed — Postgres uses row-level ownership)
      const messageResult = await db.contactMessages.create({
        createdBy: profileOwner,
        senderName: data.senderName.trim(),
        senderEmail: data.senderEmail.trim().toLowerCase(),
        subject: data.subject?.trim() || null,
        message: data.message.trim(),
        isRead: false,
        isArchived: false,
      })

      console.log('Message created successfully:', messageResult.$id)

      return { success: true }
    } catch (error) {
      console.error('Error submitting contact message:', error)
      throw new Error('Failed to send message. Please try again.')
    }
  })

// ============ PROTECTED FUNCTIONS (Auth required) ============

// Get user's profile settings
export const getProfileSettingsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      const result = await db.profileSettings.list([
        Query.equal('createdBy', [currentUser.$id]),
        Query.limit(1),
      ])

      if (result.rows.length === 0) {
        return { profile: null }
      }

      return { profile: result.rows[0] }
    } catch (error) {
      console.error('Error fetching profile settings:', error)
      return { profile: null }
    }
  },
)

// Create or update profile settings
const profileSettingsSchema = z.object({
  displayName: z.string().max(100).nullable().optional(),
  tagline: z.string().max(200).nullable().optional(),
  bio: z.string().max(5000).nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  location: z.string().max(100).nullable().optional(),
  githubUsername: z.string().max(50).nullable().optional(),
  linkedinUrl: z.string().nullable().optional(),
  twitterUrl: z.string().nullable().optional(),
  huggingfaceUrl: z.string().nullable().optional(),
  kaggleUrl: z.string().nullable().optional(),
  resumeUrl: z.string().nullable().optional(),
  heroTitle: z.string().max(200).nullable().optional(),
  heroSubtitle: z.string().max(500).nullable().optional(),
  aboutTitle: z.string().max(200).nullable().optional(),
  education: z.string().max(500).nullable().optional(),
  interests: z.array(z.string()).nullable().optional(),
  customSkills: z.array(z.string()).nullable().optional(),
  featuredRepos: z.array(z.string()).nullable().optional(),
  themeAccentColor: z.string().max(20).nullable().optional(),
  showGithubStats: z.boolean().optional(),
})

export const saveProfileSettingsFn = createServerFn({ method: 'POST' })
  .inputValidator(profileSettingsSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      // Check if profile exists
      const existing = await db.profileSettings.list([
        Query.equal('createdBy', [currentUser.$id]),
        Query.limit(1),
      ])

      const profileData = {
        displayName: data.displayName?.trim() || null,
        tagline: data.tagline?.trim() || null,
        bio: data.bio?.trim() || null,
        avatarUrl: data.avatarUrl || null,
        email: data.email?.trim() || null,
        location: data.location?.trim() || null,
        githubUsername: data.githubUsername?.trim() || null,
        linkedinUrl: data.linkedinUrl || null,
        twitterUrl: data.twitterUrl || null,
        huggingfaceUrl: data.huggingfaceUrl || null,
        kaggleUrl: data.kaggleUrl || null,
        resumeUrl: data.resumeUrl || null,
        heroTitle: data.heroTitle?.trim() || null,
        heroSubtitle: data.heroSubtitle?.trim() || null,
        aboutTitle: data.aboutTitle?.trim() || null,
        education: data.education?.trim() || null,
        interests: data.interests || null,
        customSkills: data.customSkills || null,
        featuredRepos: data.featuredRepos || null,
        themeAccentColor: data.themeAccentColor || null,
        showGithubStats: data.showGithubStats ?? true,
      }

      if (existing.rows.length > 0) {
        // Update existing
        const profile = await db.profileSettings.update(
          existing.rows[0].$id,
          profileData,
        )
        return { profile, created: false }
      } else {
        // Create new
        const profile = await db.profileSettings.create({
          createdBy: currentUser.$id,
          ...profileData,
        })
        return { profile, created: true }
      }
    } catch (error) {
      console.error('Error saving profile settings:', error)
      throw new Error('Failed to save profile settings')
    }
  })

// Get user's projects
export const getProjectsFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      const result = await db.customProjects.list([
        Query.equal('createdBy', [currentUser.$id]),
        Query.orderAsc('sortOrder'),
      ])

      return { projects: result.rows }
    } catch (error) {
      console.error('Error fetching projects:', error)
      return { projects: [] }
    }
  },
)

// Create project
const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().max(2000).nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  liveUrl: z.string().nullable().optional(),
  technologies: z.array(z.string()).nullable().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
  isFromGithub: z.boolean().optional(),
  githubRepoName: z.string().nullable().optional(),
})

export const createProjectFn = createServerFn({ method: 'POST' })
  .inputValidator(createProjectSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      // Get max sort order
      const existing = await db.customProjects.list([
        Query.equal('createdBy', [currentUser.$id]),
        Query.orderDesc('sortOrder'),
        Query.limit(1),
      ])
      const maxSortOrder =
        existing.rows.length > 0 ? existing.rows[0].sortOrder : 0

      const project = await db.customProjects.create({
        createdBy: currentUser.$id,
        title: data.title.trim(),
        description: data.description?.trim() || null,
        imageUrl: data.imageUrl || null,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        technologies: data.technologies || null,
        featured: data.featured ?? false,
        sortOrder: data.sortOrder ?? maxSortOrder + 1,
        isFromGithub: data.isFromGithub ?? false,
        githubRepoName: data.githubRepoName || null,
      })

      return { project }
    } catch (error) {
      console.error('Error creating project:', error)
      throw new Error('Failed to create project')
    }
  })

// Update project
const updateProjectSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  githubUrl: z.string().nullable().optional(),
  liveUrl: z.string().nullable().optional(),
  technologies: z.array(z.string()).nullable().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

export const updateProjectFn = createServerFn({ method: 'POST' })
  .inputValidator(updateProjectSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      // Verify ownership
      const existing = await db.customProjects.get(data.id)
      if (existing.createdBy !== currentUser.$id) {
        throw new Error('Unauthorized')
      }

      const { id, ...updateData } = data
      const project = await db.customProjects.update(id, {
        ...(updateData.title && { title: updateData.title.trim() }),
        ...(updateData.description !== undefined && {
          description: updateData.description?.trim() || null,
        }),
        ...(updateData.imageUrl !== undefined && {
          imageUrl: updateData.imageUrl,
        }),
        ...(updateData.githubUrl !== undefined && {
          githubUrl: updateData.githubUrl,
        }),
        ...(updateData.liveUrl !== undefined && {
          liveUrl: updateData.liveUrl,
        }),
        ...(updateData.technologies !== undefined && {
          technologies: updateData.technologies,
        }),
        ...(updateData.featured !== undefined && {
          featured: updateData.featured,
        }),
        ...(updateData.sortOrder !== undefined && {
          sortOrder: updateData.sortOrder,
        }),
      })

      return { project }
    } catch (error) {
      console.error('Error updating project:', error)
      throw new Error('Failed to update project')
    }
  })

// Delete project
const deleteProjectSchema = z.object({
  id: z.string(),
})

export const deleteProjectFn = createServerFn({ method: 'POST' })
  .inputValidator(deleteProjectSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      // Verify ownership
      const existing = await db.customProjects.get(data.id)
      if (existing.createdBy !== currentUser.$id) {
        throw new Error('Unauthorized')
      }

      await db.customProjects.delete(data.id)
      return { success: true }
    } catch (error) {
      console.error('Error deleting project:', error)
      throw new Error('Failed to delete project')
    }
  })

// Get contact messages
export const getContactMessagesFn = createServerFn({ method: 'GET' }).handler(
  async () => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      const result = await db.contactMessages.list([
        Query.equal('createdBy', [currentUser.$id]),
        Query.orderDesc('$createdAt'),
      ])

      return { messages: result.rows }
    } catch (error) {
      console.error('Error fetching contact messages:', error)
      return { messages: [] }
    }
  },
)

// Mark message as read
const markMessageReadSchema = z.object({
  id: z.string(),
  isRead: z.boolean(),
})

export const markMessageReadFn = createServerFn({ method: 'POST' })
  .inputValidator(markMessageReadSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      const existing = await db.contactMessages.get(data.id)
      if (existing.createdBy !== currentUser.$id) {
        throw new Error('Unauthorized')
      }

      await db.contactMessages.update(data.id, { isRead: data.isRead })
      return { success: true }
    } catch (error) {
      console.error('Error marking message as read:', error)
      throw new Error('Failed to update message')
    }
  })

// Delete message
const deleteMessageSchema = z.object({
  id: z.string(),
})

export const deleteMessageFn = createServerFn({ method: 'POST' })
  .inputValidator(deleteMessageSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      const existing = await db.contactMessages.get(data.id)
      if (existing.createdBy !== currentUser.$id) {
        throw new Error('Unauthorized')
      }

      await db.contactMessages.delete(data.id)
      return { success: true }
    } catch (error) {
      console.error('Error deleting message:', error)
      throw new Error('Failed to delete message')
    }
  })

// Upload profile image
const uploadImageSchema = z.object({
  base64Data: z.string(),
  fileName: z.string(),
  mimeType: z.string(),
})

export const uploadProfileImageFn = createServerFn({ method: 'POST' })
  .inputValidator(uploadImageSchema)
  .handler(async ({ data }) => {
    const { currentUser } = await authMiddleware()
    if (!currentUser) throw new Error('Unauthorized')

    try {
      const { fileStorage } = await import('../lib/storage')

      const storage = await fileStorage()

      // Strip base64 prefix if present
      const base64Clean = data.base64Data.replace(/^data:[^;]+;base64,/, '')

      // Convert base64 to Buffer
      const buffer = Buffer.from(base64Clean, 'base64')

      // Upload to Vercel Blob
      const file = await storage.create(
        currentUser.$id,
        buffer,
        data.fileName,
        data.mimeType,
      )

      return {
        success: true,
        fileId: file.$id,
        fileUrl: file.url,
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      throw new Error('Failed to upload image')
    }
  })
