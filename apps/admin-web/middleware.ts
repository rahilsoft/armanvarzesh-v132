import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
const PUBLIC_PATHS = ['/', '/login', '/manifest.json'];
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_PATHS.includes(pathname) || pathname.startsWith('/api/')) return NextResponse.next();
  const token = req.cookies.get('token')?.value || '';
  if (!token) { const url = req.nextUrl.clone(); url.pathname = '/login'; return NextResponse.redirect(url); }
  return NextResponse.next();
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
