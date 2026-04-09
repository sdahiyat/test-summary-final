import { createClient } from '@supabase/supabase-js';
import type { Database } from './supabase.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export default supabase;

/**
 * Service-role Supabase client for server-side admin operations.
 * This bypasses Row Level Security — use only in trusted server contexts.
 * Never import this in client-side (browser) code.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error('Missing env var: SUPABASE_SERVICE_ROLE_KEY');
  }

  return createClient<Database>(supabaseUrl!, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export type { Database };
export * from './supabase.types';
