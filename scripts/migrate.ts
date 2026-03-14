/**
 * Database migration script — creates all required tables in Vercel Postgres (Neon).
 *
 * Usage:
 *   POSTGRES_URL="postgres://..." npx tsx scripts/migrate.ts
 *
 * Or via npm script:
 *   npm run db:migrate
 */

import { sql } from '@vercel/postgres'

async function migrate() {
  console.log('Starting database migration...')

  // ─── Users table (NEW — Appwrite handled auth internally) ─────
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  console.log('  Created table: users')

  // ─── Profile Settings ─────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS profile_settings (
      id TEXT PRIMARY KEY,
      created_by TEXT NOT NULL,
      display_name TEXT,
      tagline TEXT,
      bio TEXT,
      avatar_url TEXT,
      email TEXT,
      location TEXT,
      github_username TEXT,
      linkedin_url TEXT,
      twitter_url TEXT,
      huggingface_url TEXT,
      kaggle_url TEXT,
      resume_url TEXT,
      hero_title TEXT,
      hero_subtitle TEXT,
      about_title TEXT,
      education TEXT,
      interests TEXT,
      custom_skills TEXT,
      featured_repos TEXT,
      theme_accent_color TEXT,
      show_github_stats BOOLEAN DEFAULT TRUE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  console.log('  Created table: profile_settings')

  // ─── Custom Projects ──────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS custom_projects (
      id TEXT PRIMARY KEY,
      created_by TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      github_url TEXT,
      live_url TEXT,
      technologies TEXT,
      featured BOOLEAN DEFAULT FALSE,
      sort_order INTEGER DEFAULT 0,
      is_from_github BOOLEAN DEFAULT FALSE,
      github_repo_name TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  console.log('  Created table: custom_projects')

  // ─── Contact Messages ─────────────────────────────────────────
  await sql`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id TEXT PRIMARY KEY,
      created_by TEXT NOT NULL,
      sender_name TEXT NOT NULL,
      sender_email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      is_archived BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )
  `
  console.log('  Created table: contact_messages')

  // ─── Indexes ──────────────────────────────────────────────────
  await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)`
  await sql`CREATE INDEX IF NOT EXISTS idx_profile_settings_created_by ON profile_settings (created_by)`
  await sql`CREATE INDEX IF NOT EXISTS idx_custom_projects_created_by ON custom_projects (created_by)`
  await sql`CREATE INDEX IF NOT EXISTS idx_custom_projects_sort_order ON custom_projects (sort_order)`
  await sql`CREATE INDEX IF NOT EXISTS idx_contact_messages_created_by ON contact_messages (created_by)`
  await sql`CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at)`
  console.log('  Created indexes')

  console.log('Migration complete!')
}

migrate().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
