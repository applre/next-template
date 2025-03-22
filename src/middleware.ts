import { authMiddleware } from '@/lib/auth';
import createMiddleware from 'next-intl/middleware';
import { NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard'];

// Create the next-intl middleware using the shared routing config
const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  return authMiddleware(request)(async (req) => {
    // Use type assertion for auth property
    interface RequestWithAuth extends NextRequest {
      auth?: { user: { id: string } };
    }
    const isLoggedIn = !!(req as RequestWithAuth).auth;
    const { nextUrl } = req;

    // Check if the current path requires auth
    const isProtectedRoute = PROTECTED_PATHS.some((path) => nextUrl.pathname.startsWith(path));

    // If the route requires auth but the user is not logged in, redirect to the login page.
    if (isProtectedRoute && !isLoggedIn) {
      const redirectUrl = new URL('/sign-in', nextUrl.origin);
      // Save the original access URL as the callback address
      redirectUrl.searchParams.set('callbackUrl', nextUrl.href);
      return NextResponse.redirect(redirectUrl);
    }

    // If the auth check passes, return the i18n middleware response
    return intlMiddleware(req);
  });
}

// Use the same matcher pattern as defined in routing config
export const config = {
  matcher: ['/((?!api|_next|.*\\..*|favicon.ico|sitemap.xml|robots.txt).*)'],
};
