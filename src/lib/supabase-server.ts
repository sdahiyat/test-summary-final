import { createServerComponentClient, createRouteHandlerClient as _createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from './supabase.types';

export function createServerClient() {
  return createServerComponentClient<Database>({ cookies });
}

export function createRouteHandlerClient() {
  return _createRouteHandlerClient<Database>({ cookies });
}
