import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * STARTCONNECTI CLIENT MIDDLEWARE FOUNDATION
 * 
 * Note: This middleware is a foundation for future real auth integration.
 * Current auth is handled via client-side RouteGuards and localStorage persistence.
 * 
 * DO NOT add real auth verification here yet as per Phase 10A rules.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Example: Basic redirection logic can be added here once cookies are implemented
  // For now, we allow all requests to pass through to be handled by RouteGuards
  
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
