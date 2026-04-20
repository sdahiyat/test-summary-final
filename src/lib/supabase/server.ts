import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

/**
 * Creates a Supabase client suitable for use in Next.js Server Components,
 * Server Actions, and API Route Handlers using the public anon key.
 *
 * Session management (cookie parsing) will be handled in Task 2 when the
 * Auth middleware is set up. For now this client is useful for server-side
 * queries that rely on the user's JWT being forwarded manually.
 *
 * @returns SupabaseClient<Database> with anon key
 */
export function createServerSupabaseClient(): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

/**
 * Creates a Supabase client with the service role key for privileged /
 * admin operations that bypass Row Level Security.
 *
 * ⚠️  NEVER expose this client to the browser. Only use it in server-side
 *     code (API routes, server actions, background jobs).
 *
 * @returns SupabaseClient<Database> with service role key
 */
export function createAdminSupabaseClient(): SupabaseClient<Database> {
  if (!supabaseServiceRoleKey) {
    throw new Error('Missing environment variable: SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient<Database>(supabaseUrl!, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}
