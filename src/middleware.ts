import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth is handled client-side via localStorage in each admin page component.
// This middleware simply passes all requests through without NextAuth dependency.
export function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/((?!login|forgot-password|_next/static|_next/image|favicon.ico).*)',
  ],
};
