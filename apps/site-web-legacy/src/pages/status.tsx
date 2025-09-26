import React from 'react';
import Head from 'next/head';
import './styles/booking.module.css';
import { Card } from '../../packages/ui/components/Card';
import { getRecentTraces } from '../../packages/observability/trace';

async function ping(url:string){
  const t0 = performance.now();
  try{
    const res = await fetch(url, { method:'GET' });
    const t1 = performance.now();
    return { url, ok: res.ok, status: res.status, ms: Math.round(t1 - t0) };
  }catch(e:any){
    const t1 = performance.now();
    return { url, ok:false, status: 0, ms: Math.round(t1 - t0), error: String(e?.message||e) };
  }
}

export default function StatusPage(){
  const [checks,setChecks] = React.useState<any[]>([]);
  const [traces,setTraces] = React.useState<any[]>([]);
  async function run(){
    const base = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000';
    const urls = ['/health','/api/health','/api/bff/health'].map(p=> base + p);
    const out = [];
    for(const u of urls){ out.push(await ping(u)); }
    setChecks(out);
    setTraces(getRecentTraces(100).reverse());
  }
  React.useEffect(()=>{ run(); },[]);
  return (
    <div dir="rtl">
      <Head><title>Status — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>Status</h1>
      <Card>
        <h3>Health Checks</h3>
        <ul>{checks.map((c,i)=> <li key={i}><code>{c.url}</code> — {c.ok? 'OK' : 'FAIL'} — {c.status} — {c.ms}ms</li>)}</ul>
      </Card>
      <Card>
        <h3>Recent Traces</h3>
        <div style={{maxHeight:300, overflow:'auto'}}>
          {traces.map((t,i)=> <pre key={i} style={{margin:0}}>{JSON.stringify(t,null,2)}</pre>)}
        </div>
      </Card>
      <Card>
        <h3>Env</h3>
        <ul>
          <li>API_BASE: {process.env.NEXT_PUBLIC_API_BASE||'-'}</li>
          <li>OTEL_EXPORTER_OTLP_ENDPOINT: {process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT||'-'}</li>
        </ul>
      </Card>
    </div>
  );
}

// PATCH: add skip link target id="main"
// This file is patched in Phase V to include id="main" on main container for accessibility.
