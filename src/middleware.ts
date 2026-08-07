import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/tokens';

const ADMIN_ROUTES = ['/admin'];
const ADMIN_API_ROUTES = [
  '/api/packages',
  '/api/projects',
  '/api/custom-options',
  '/api/orders',
  '/api/terms',
  '/api/privacy',
  '/api/socials',
  '/api/faqs',
  '/api/upload',
];

const PUBLIC_READ_ROUTES = ['/api/faqs', '/api/packages', '/api/projects', '/api/socials', '/api/terms', '/api/privacy'];
const PUBLIC_WRITE_ROUTES = ['/api/reviews', '/api/chat'];

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || 'unknown';

    // Strict rate limit for write operations
    if (request.method !== 'GET') {
      const writeKey = `write:${ip}`;
      if (!checkRateLimit(writeKey, 30, 60000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    }

    // Chat rate limit (very strict)
    if (pathname === '/api/chat') {
      const chatKey = `chat:${ip}`;
      if (!checkRateLimit(chatKey, 10, 60000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    }

    // Upload rate limit
    if (pathname === '/api/upload' && request.method === 'POST') {
      const uploadKey = `upload:${ip}`;
      if (!checkRateLimit(uploadKey, 20, 60000)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
      }
    }

    // Auth check for protected admin API routes (only for write operations)
    if (ADMIN_API_ROUTES.includes(pathname) && request.method !== 'GET') {
      const token = request.cookies.get('admin_session')?.value;
      if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      const payload = verifySessionToken(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
      }
    }

    // Add security headers to API responses
    const response = NextResponse.next();
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    return response;
  }

  // Admin page protection
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    const token = request.cookies.get('admin_session')?.value;
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    const payload = verifySessionToken(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('admin_session');
      return response;
    }
  }

  // Cache static assets
  if (pathname.startsWith('/_next/static/') || pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|css|js|woff|woff2)$/)) {
    const response = NextResponse.next();
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    return response;
  }

  // Security headers for all pages
  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  return response;
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
};
