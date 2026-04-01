import { NextRequest, NextResponse } from 'next/server';
import { getCookieName, isAuthConfigured, verifyToken } from '@/lib/auth-config';
import { consumeAdminRateLimit } from '@/lib/rate-limit';

const LOGIN_PATH = '/admin/login';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminApi = pathname.startsWith('/api/admin/');

  const rate = isAdminApi ? consumeAdminRateLimit(request) : null;
  const applyRateHeaders = (response: NextResponse) => {
    if (rate) {
      response.headers.set('X-RateLimit-Limit', rate.limit.toString());
      response.headers.set('X-RateLimit-Remaining', Math.max(rate.remaining, 0).toString());
      response.headers.set('X-RateLimit-Reset', Math.ceil(rate.reset / 1000).toString());
    }
    return response;
  };

  if (rate && !rate.ok) {
    const retryAfter = Math.max(1, Math.ceil((rate.reset - Date.now()) / 1000)).toString();
    return applyRateHeaders(NextResponse.json({ error: 'Muitas requisições' }, { status: 429, headers: { 'Retry-After': retryAfter } }));
  }

  if (pathname.startsWith('/api/admin/content')) {
    return applyRateHeaders(NextResponse.next());
  }

  if (pathname.startsWith(LOGIN_PATH)) {
    return applyRateHeaders(NextResponse.next());
  }

  if (!isAuthConfigured()) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return applyRateHeaders(NextResponse.redirect(url));
  }

  const token = request.cookies.get(getCookieName())?.value;
  if (!verifyToken(token)) {
    if (pathname.startsWith('/api/')) {
      return applyRateHeaders(NextResponse.json({ error: 'Não autorizado' }, { status: 401 }));
    }
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    return applyRateHeaders(NextResponse.redirect(url));
  }

  return applyRateHeaders(NextResponse.next());
}

export const config = {
  matcher: ['/admin', '/admin/:path*', '/api/admin/:path*'],
};
