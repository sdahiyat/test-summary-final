import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { Database } from '@/lib/supabase/types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseAnonKey) {
  throw new Error('Missing environment variable: NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

// Singleton browser client — safe to import in Client Components.
let _browserClient: SupabaseClient<Database> | null = null

/**
 * Returns a typed Supabase client for use in browser / React Client Components.
 * Implements a singleton pattern so only one instance is created per page load.
 */
export function createBrowserClient(): SupabaseClient<Database> {
  if (_browserClient) return _browserClient

  _browserClient = createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return _browserClient
}

/**
 * Convenience singleton export — equivalent to calling createBrowserClient().
 * Import this directly when you just need the client without factory semantics.
 *
 * @example
 * import { supabase } from '@/lib/supabase/client'
 * const { data } = await supabase.from('foods').select('*')
 */
export const supabase = createBrowserClient()
