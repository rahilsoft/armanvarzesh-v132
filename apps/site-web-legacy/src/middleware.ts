import { NextResponse, NextRequest } from 'next/server';

export function middleware(req: NextRequest){
  const url = req.nextUrl.clone();
  const role = req.cookies.get('av_role')?.value || 'guest';
  const pathname = url.pathname;

  const protectedRoutes = ['/checkout','/wallet','/admin'];
  const isProtected = protectedRoutes.some(p=> pathname.startsWith(p));
  if(isProtected && role==='guest'){
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ['/checkout','/wallet','/admin/:path*'] };
