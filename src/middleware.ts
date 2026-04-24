import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_ROUTES = ['/dashboard', '/log', '/profile', '/reports', '/goals', '/onboarding'];
const AUTH_ROUTES = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-email'];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isApiRoute = pathname.startsWith('/api');
  const isOnboardingRoute = pathname.startsWith('/onboarding');

  // Redirect unauthenticated users to login
  if (!session && isProtectedRoute) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from auth pages
  if (session && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Onboarding redirect logic for authenticated users
  if (session && !isApiRoute && !isOnboardingRoute) {
    const onboardingCompleted =
      request.cookies.get('onboarding_completed')?.value === 'true';

    if (!onboardingCompleted && isProtectedRoute) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }

  // Prevent completed users from re-visiting onboarding
  if (session && isOnboardingRoute) {
    const onboardingCompleted =
      request.cookies.get('onboarding_completed')?.value === 'true';

    if (onboardingCompleted) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/log/:path*',
    '/profile/:path*',
    '/reports/:path*',
    '/goals/:path*',
    '/onboarding/:path*',
    '/onboarding',
    '/auth/:path*',
  ],
};
