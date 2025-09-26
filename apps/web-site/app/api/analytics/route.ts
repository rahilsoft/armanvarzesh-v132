
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    // TODO: send to central telemetry (ClickHouse/Kafka). For now, just log.
    console.log('[analytics]', body?.name, body?.payload);
    return NextResponse.json({ ok: true });
  }catch(e:any){
    return NextResponse.json({ ok:false, error: e?.message || 'ERR' }, { status: 400 });
  }
}
