/**
 * Type definitions for the portfolio database.
 * Replaces Appwrite's Models.Row with a custom BaseRow for Vercel Postgres compatibility.
 */

/** Base row fields that every database record has (mirrors Appwrite's Models.Row) */
export type BaseRow = {
  $id: string
  $createdAt: string
  $updatedAt: string
}

/** Auth user type returned from JWT auth (mirrors Appwrite's Models.User) */
export type AuthUser = {
  $id: string
  email: string
  name?: string
}

export type ProfileSettings = BaseRow & {
  createdBy: string
  displayName: string | null
  tagline: string | null
  bio: string | null
  avatarUrl: string | null
  email: string | null
  location: string | null
  githubUsername: string | null
  linkedinUrl: string | null
  twitterUrl: string | null
  huggingfaceUrl: string | null
  kaggleUrl: string | null
  resumeUrl: string | null
  heroTitle: string | null
  heroSubtitle: string | null
  aboutTitle: string | null
  education: string | null
  interests: string[] | null
  customSkills: string[] | null
  featuredRepos: string[] | null
  themeAccentColor: string | null
  showGithubStats: boolean
}

export type CustomProjects = BaseRow & {
  createdBy: string
  title: string
  description: string | null
  imageUrl: string | null
  githubUrl: string | null
  liveUrl: string | null
  technologies: string[] | null
  featured: boolean
  sortOrder: number
  isFromGithub: boolean
  githubRepoName: string | null
}

export type ContactMessages = BaseRow & {
  createdBy: string
  senderName: string
  senderEmail: string
  subject: string | null
  message: string
  isRead: boolean
  isArchived: boolean
}
