/**
 * Database layer — replaces Appwrite TablesDB with Vercel Postgres (@vercel/postgres).
 *
 * Key design decisions:
 * - Returns objects with $id, $createdAt, $updatedAt for backward compatibility
 * - camelCase in JS ↔ snake_case in Postgres
 * - Array fields (interests, customSkills, featuredRepos, technologies) stored as JSON TEXT
 * - Query compatibility object mimics Appwrite's Query.equal(), Query.limit(), etc.
 */

import { sql } from '@vercel/postgres'
import { randomUUID } from 'crypto'
import type {
  BaseRow,
  ProfileSettings,
  CustomProjects,
  ContactMessages,
} from './appwrite.types'

// ─── Field mapping: camelCase JS ↔ snake_case Postgres ──────────────

const FIELD_MAP: Record<string, string> = {
  // BaseRow
  $id: 'id',
  $createdAt: 'created_at',
  $updatedAt: 'updated_at',
  // Common
  createdBy: 'created_by',
  // ProfileSettings
  displayName: 'display_name',
  avatarUrl: 'avatar_url',
  githubUsername: 'github_username',
  linkedinUrl: 'linkedin_url',
  twitterUrl: 'twitter_url',
  huggingfaceUrl: 'huggingface_url',
  kaggleUrl: 'kaggle_url',
  resumeUrl: 'resume_url',
  heroTitle: 'hero_title',
  heroSubtitle: 'hero_subtitle',
  aboutTitle: 'about_title',
  customSkills: 'custom_skills',
  featuredRepos: 'featured_repos',
  themeAccentColor: 'theme_accent_color',
  showGithubStats: 'show_github_stats',
  // CustomProjects
  imageUrl: 'image_url',
  githubUrl: 'github_url',
  liveUrl: 'live_url',
  sortOrder: 'sort_order',
  isFromGithub: 'is_from_github',
  githubRepoName: 'github_repo_name',
  // ContactMessages
  senderName: 'sender_name',
  senderEmail: 'sender_email',
  isRead: 'is_read',
  isArchived: 'is_archived',
}

// JSON array fields that need serialization/deserialization
const JSON_FIELDS = new Set([
  'interests',
  'customSkills',
  'featuredRepos',
  'technologies',
])

function camelToSnake(field: string): string {
  return FIELD_MAP[field] || field
}

function snakeToCamel(field: string): string {
  for (const [camel, snake] of Object.entries(FIELD_MAP)) {
    if (snake === field) return camel
  }
  return field
}

// ─── Row mapping ────────────────────────────────────────────────────

/** Convert a Postgres row to a JS object with $id/$createdAt/$updatedAt + camelCase */
function mapRowFromDb<T extends BaseRow>(row: Record<string, unknown>): T {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(row)) {
    const camelKey = snakeToCamel(key)

    // Map id → $id, created_at → $createdAt, updated_at → $updatedAt
    if (key === 'id') {
      result.$id = value
    } else if (key === 'created_at') {
      result.$createdAt =
        value instanceof Date ? value.toISOString() : String(value ?? '')
    } else if (key === 'updated_at') {
      result.$updatedAt =
        value instanceof Date ? value.toISOString() : String(value ?? '')
    } else {
      // Deserialize JSON array fields
      if (JSON_FIELDS.has(camelKey) && typeof value === 'string') {
        try {
          result[camelKey] = JSON.parse(value)
        } catch {
          result[camelKey] = null
        }
      } else {
        result[camelKey] = value
      }
    }
  }

  return result as T
}

/** Convert a JS data object to snake_case + serialize arrays for INSERT/UPDATE */
function mapDataToDb(
  data: Record<string, unknown>,
): Record<string, unknown> {
  const result: Record<string, unknown> = {}

  for (const [key, value] of Object.entries(data)) {
    // Skip $-prefixed base row fields (these are managed by DB)
    if (key.startsWith('$')) continue

    const snakeKey = camelToSnake(key)

    // Serialize JSON array fields
    if (JSON_FIELDS.has(key) && Array.isArray(value)) {
      result[snakeKey] = JSON.stringify(value)
    } else {
      result[snakeKey] = value
    }
  }

  return result
}

// ─── Query compatibility (mimics Appwrite's Query API) ──────────────

type QueryClause =
  | { type: 'equal'; field: string; values: unknown[] }
  | { type: 'limit'; value: number }
  | { type: 'orderAsc'; field: string }
  | { type: 'orderDesc'; field: string }

/** Appwrite-compatible Query builder. Returns serialized strings parsed by the db layer. */
export const Query = {
  equal(field: string, values: unknown[]): string {
    return JSON.stringify({ type: 'equal', field, values } as QueryClause)
  },
  limit(value: number): string {
    return JSON.stringify({ type: 'limit', value } as QueryClause)
  },
  orderAsc(field: string): string {
    return JSON.stringify({ type: 'orderAsc', field } as QueryClause)
  },
  orderDesc(field: string): string {
    return JSON.stringify({ type: 'orderDesc', field } as QueryClause)
  },
}

/** Parse query strings into SQL fragments */
function parseQueries(queries?: string[]): {
  whereClauses: string[]
  whereValues: unknown[]
  orderBy: string | null
  limit: number | null
} {
  const whereClauses: string[] = []
  const whereValues: unknown[] = []
  let orderBy: string | null = null
  let limit: number | null = null

  if (!queries) return { whereClauses, whereValues, orderBy, limit }

  for (const q of queries) {
    const parsed: QueryClause = JSON.parse(q)

    switch (parsed.type) {
      case 'equal': {
        const snakeField = camelToSnake(parsed.field)
        if (parsed.values.length === 1) {
          whereClauses.push(`${snakeField} = $${whereValues.length + 1}`)
          whereValues.push(parsed.values[0])
        } else {
          const placeholders = parsed.values.map(
            (_, i) => `$${whereValues.length + i + 1}`,
          )
          whereClauses.push(`${snakeField} IN (${placeholders.join(', ')})`)
          whereValues.push(...parsed.values)
        }
        break
      }
      case 'limit':
        limit = parsed.value
        break
      case 'orderAsc':
        orderBy = `${camelToSnake(parsed.field)} ASC`
        break
      case 'orderDesc':
        orderBy = `${camelToSnake(parsed.field)} DESC`
        break
    }
  }

  return { whereClauses, whereValues, orderBy, limit }
}

// ─── Generic CRUD for a table ───────────────────────────────────────

function createTableOps<T extends BaseRow>(tableName: string) {
  return {
    async create(
      data: Omit<T, keyof BaseRow>,
      options?: { rowId?: string },
    ): Promise<T> {
      const id = options?.rowId || randomUUID()
      const dbData = mapDataToDb(data as Record<string, unknown>)
      const columns = ['id', ...Object.keys(dbData)]
      const values = [id, ...Object.values(dbData)]
      const placeholders = values.map((_, i) => `$${i + 1}`)

      const query = `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) RETURNING *`
      const result = await sql.query(query, values)
      return mapRowFromDb<T>(result.rows[0])
    },

    async get(id: string): Promise<T> {
      const result = await sql.query(
        `SELECT * FROM ${tableName} WHERE id = $1`,
        [id],
      )
      if (result.rows.length === 0) {
        throw new Error(`Row not found in ${tableName}: ${id}`)
      }
      return mapRowFromDb<T>(result.rows[0])
    },

    async update(
      id: string,
      data: Partial<Omit<T, keyof BaseRow>>,
    ): Promise<T> {
      const dbData = mapDataToDb(data as Record<string, unknown>)
      const setClauses: string[] = []
      const values: unknown[] = []
      let paramIndex = 1

      for (const [key, value] of Object.entries(dbData)) {
        setClauses.push(`${key} = $${paramIndex}`)
        values.push(value)
        paramIndex++
      }

      // Always update the updated_at timestamp
      setClauses.push(`updated_at = NOW()`)
      values.push(id)

      const query = `UPDATE ${tableName} SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`
      const result = await sql.query(query, values)
      if (result.rows.length === 0) {
        throw new Error(`Row not found in ${tableName}: ${id}`)
      }
      return mapRowFromDb<T>(result.rows[0])
    },

    async delete(id: string): Promise<void> {
      await sql.query(`DELETE FROM ${tableName} WHERE id = $1`, [id])
    },

    async list(
      queries?: string[],
    ): Promise<{ rows: T[]; total: number }> {
      const { whereClauses, whereValues, orderBy, limit } =
        parseQueries(queries)

      let query = `SELECT * FROM ${tableName}`
      if (whereClauses.length > 0) {
        query += ` WHERE ${whereClauses.join(' AND ')}`
      }
      if (orderBy) {
        query += ` ORDER BY ${orderBy}`
      }
      if (limit !== null) {
        query += ` LIMIT ${limit}`
      }

      const result = await sql.query(query, whereValues)
      return {
        rows: result.rows.map((row: Record<string, unknown>) =>
          mapRowFromDb<T>(row),
        ),
        total: result.rows.length,
      }
    },
  }
}

// ─── Database instance ──────────────────────────────────────────────

export const db = {
  profileSettings: createTableOps<ProfileSettings>('profile_settings'),
  customProjects: createTableOps<CustomProjects>('custom_projects'),
  contactMessages: createTableOps<ContactMessages>('contact_messages'),

  /** Users table — for auth (new, was handled by Appwrite internally) */
  users: {
    async create(data: {
      email: string
      passwordHash: string
      name?: string
    }): Promise<{ id: string; email: string; name: string | null }> {
      const id = randomUUID()
      const result = await sql.query(
        `INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4) RETURNING *`,
        [id, data.email, data.passwordHash, data.name || null],
      )
      const row = result.rows[0]
      return { id: row.id, email: row.email, name: row.name }
    },

    async findByEmail(
      email: string,
    ): Promise<{
      id: string
      email: string
      name: string | null
      passwordHash: string
    } | null> {
      const result = await sql.query(
        `SELECT * FROM users WHERE email = $1`,
        [email],
      )
      if (result.rows.length === 0) return null
      const row = result.rows[0]
      return {
        id: row.id,
        email: row.email,
        name: row.name,
        passwordHash: row.password_hash,
      }
    },

    async findById(
      id: string,
    ): Promise<{
      id: string
      email: string
      name: string | null
    } | null> {
      const result = await sql.query(
        `SELECT id, email, name FROM users WHERE id = $1`,
        [id],
      )
      if (result.rows.length === 0) return null
      const row = result.rows[0]
      return { id: row.id, email: row.email, name: row.name }
    },
  },
}
