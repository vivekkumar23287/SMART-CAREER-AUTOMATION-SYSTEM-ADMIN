import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('admin_session');
  const { pathname } = request.nextUrl;

  // Allow access to login and public assets
  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    if (session && pathname === '/login') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protect all other routes
  if (!session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
