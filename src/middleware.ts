import { NextRequest, NextResponse } from 'next/server';
import { getCookieName, isAuthConfigured, verifyToken } from '@/lib/auth-config';

const LOGIN_PATH = '/admin/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/api/admin/content')) {
    return NextResponse.next();
  }

  if (pathname.startsWith(LOGIN_PATH)) {
    return NextResponse.next();
  }

  if (!isAuthConfigured()) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  const token = request.cookies.get(getCookieName())?.value;
  if (!verifyToken(token)) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
