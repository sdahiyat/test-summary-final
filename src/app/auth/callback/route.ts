import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/lib/supabase.types';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    try {
      const supabase = createRouteHandlerClient<Database>({ cookies });
      await supabase.auth.exchangeCodeForSession(code);
      return NextResponse.redirect(`${requestUrl.origin}/dashboard`);
    } catch {
      return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth`);
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/login?error=auth`);
}
