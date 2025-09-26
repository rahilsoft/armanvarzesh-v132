
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const FILE = path.join(process.cwd(), 'content', 'vitrine.tiles.json');

async function isAuthed(req: NextRequest){
  // Dev-only: cookie token check. In production, integrate with Identity service.
  const cookie = req.cookies.get('admintoken')?.value || '';
  const secret = process.env.ADMIN_TOKEN || 'devtoken';
  return cookie === secret;
}

export async function GET(req: NextRequest){
  if (!(await isAuthed(req))) return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 });
  try{
    const raw = await fs.readFile(FILE, 'utf-8');
    return NextResponse.json({ ok:true, data: JSON.parse(raw) });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message || 'ERR' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest){
  if (!(await isAuthed(req))) return NextResponse.json({ ok:false, error:'unauthorized' }, { status: 401 });
  try{
    const body = await req.json();
    const json = JSON.stringify(body, null, 2);
    await fs.writeFile(FILE, json, 'utf-8');
    return NextResponse.json({ ok:true });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message || 'ERR' }, { status: 400 });
  }
}
