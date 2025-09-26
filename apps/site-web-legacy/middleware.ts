import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityHeaders } from '../packages/security/headers';

export function middleware(req: NextRequest){
  const res = NextResponse.next();
  for(const [k,v] of securityHeaders()){
    res.headers.set(k, v);
  }
  // SameSite=Lax default for session cookies (if any app sets)
  res.headers.set('Set-Cookie', '__Host-avpref=1; Path=/; SameSite=Lax');
  return res;
}
