
// Middleware with JWKS verification for /admin/*
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/admin')) return NextResponse.next();

  const token = request.headers.get('authorization')?.replace(/^Bearer\s+/,'')
    || request.cookies.get('idToken')?.value
    || '';

  if (!token) return NextResponse.redirect(new URL('/admin/login', request.url));

  try {
    // jose is edge-compatible
    const { jwtVerify, createRemoteJWKSet } = await import('jose');
    const jwksUrl = process.env.NEXT_PUBLIC_OIDC_JWKS_URL || process.env.OIDC_JWKS_URL;
    if (!jwksUrl) return NextResponse.redirect(new URL('/admin/login', request.url));
    const JWKS = createRemoteJWKSet(new URL(jwksUrl));
    await jwtVerify(token, JWKS, {
      issuer: process.env.NEXT_PUBLIC_OIDC_ISSUER || process.env.OIDC_ISSUER,
      audience: process.env.NEXT_PUBLIC_OIDC_AUDIENCE || process.env.OIDC_AUDIENCE
    });
    return NextResponse.next();
  } catch (e) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

export const config = { matcher: ['/admin/:path*'] };
