
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
  const { token } = await req.json();
  const secret = process.env.ADMIN_TOKEN || 'devtoken';
  if (token !== secret){
    return NextResponse.json({ ok:false, error:'invalid' }, { status: 401 });
  }
  const res = NextResponse.json({ ok:true });
  res.cookies.set('admintoken', secret, { httpOnly: false, path: '/', maxAge: 60*60*8 });
  return res;
}
