import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// This middleware will run for all requests
export function middleware(request: NextRequest) {
  // Create a response object to modify
  const response = NextResponse.next();

  // Apply security headers to all responses
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  
  // Allow image optimization from any origin
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');

  // Set cache control for static assets
  if (
    request.nextUrl.pathname.startsWith('/_next/') ||
    request.nextUrl.pathname.startsWith('/images/') ||
    request.nextUrl.pathname.includes('.png') ||
    request.nextUrl.pathname.includes('.jpg') ||
    request.nextUrl.pathname.includes('.svg')
  ) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}

// Configure which paths this middleware will run on
export const config = {
  matcher: [
    // Apply to all routes except api routes and static files
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};