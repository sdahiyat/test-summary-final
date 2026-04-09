import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from './supabase.types';

// Requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
export const supabase = createClientComponentClient<Database>();

export default supabase;
