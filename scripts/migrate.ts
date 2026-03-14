/**
 * Database migration script — creates all required tables in Supabase Postgres.
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/migrate.ts
 *
 * Or via npm script:
 *   npm run db:migrate
 */

import pg from 'pg'

const { Client } = pg

async function migrate() {
  const raw =
    process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL
  if (!raw) {
    throw new Error('POSTGRES_URL or POSTGRES_URL_NON_POOLING env var is required')
  }
  // Replace sslmode=require with no-verify so pg doesn't reject Supabase's cert chain
  const connectionString = raw.replace(/sslmode=require/g, 'sslmode=no-verify')

  const client = new Client({ connectionString })

  await client.connect()
  console.log('Connected to database. Running migrations...')

  try {
    // ─── Users table ─────────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        name TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW(),
        updated_at TIMESTAMPTZ DEFAULT NOW()
      )
    `)
    console.log('  ✓ users')

    // ─── Profile Settings ─────────────────────────────────────────────
    await client.query(`
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
    `)
    console.log('  ✓ profile_settings')

    // ─── Custom Projects ──────────────────────────────────────────────
    await client.query(`
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
    `)
    console.log('  ✓ custom_projects')

    // ─── Contact Messages ─────────────────────────────────────────────
    await client.query(`
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
    `)
    console.log('  ✓ contact_messages')

    // ─── Indexes ──────────────────────────────────────────────────────
    await client.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users (email)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_profile_settings_created_by ON profile_settings (created_by)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_custom_projects_created_by ON custom_projects (created_by)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_custom_projects_sort_order ON custom_projects (sort_order)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_contact_messages_created_by ON contact_messages (created_by)`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages (created_at)`)
    console.log('  ✓ indexes')

    console.log('\nMigration complete!')
  } finally {
    await client.end()
  }
}

migrate().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
