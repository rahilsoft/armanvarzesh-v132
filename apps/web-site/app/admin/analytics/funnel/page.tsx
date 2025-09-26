
'use client';
import React, { useEffect, useRef, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [role, setRole] = useState<'COACH'|'NUTRITION'|'CORRECTIVE'|''>('');
  const [from, setFrom] = useState<string>(new Date(Date.now()-1000*60*60*24*30).toISOString());
  const [to, setTo] = useState<string>(new Date().toISOString());
  const [data, setData] = useState<any>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const load = async ()=>{
    const res = await gql(`query($f:String!,$t:String!,$r:ServiceType){ funnelMetrics(from:$f, to:$t, role:$r) }`, { f: from, t: to, r: role||undefined });
    setData(JSON.parse(res.funnelMetrics||'{}'));
  };
  useEffect(()=>{ load(); }, []);
  useEffect(()=>{
    if (!canvas.current || !data) return;
    const ctx = canvas.current.getContext('2d'); if (!ctx) return;
    const w = canvas.current.width, h = canvas.current.height;
    ctx.clearRect(0,0,w,h);
    const steps = ['leads','chats','conversions','renewals'];
    const max = Math.max(...steps.map(k=> data[k]||0), 1);
    steps.forEach((k,i)=>{
      const x = 40 + i*(w-80)/3;
      const val = data[k]||0;
      const barH = Math.max(4, (val/max) * (h-60));
      ctx.fillStyle = '#111';
      ctx.fillRect(x-30, h-40-barH, 60, barH);
      ctx.fillStyle = '#555';
      ctx.fillText(k, x-30, h-20);
      ctx.fillText(String(val), x-30, h-45-barH);
    });
  }, [data]);

  return <div style={{ padding:24 }}>
    <h1>Funnel — Lead → Chat → Conversion → Renewal</h1>
    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
      <input value={from} onChange={e=> setFrom(e.target.value)} style={{ width:320 }} />
      <input value={to} onChange={e=> setTo(e.target.value)} style={{ width:320 }} />
      <select value={role} onChange={e=> setRole(e.target.value as any)}>
        <option value="">All</option>
        <option value="COACH">COACH</option>
        <option value="NUTRITION">NUTRITION</option>
        <option value="CORRECTIVE">CORRECTIVE</option>
      </select>
      <button onClick={load}>Load</button>
    </div>
    <canvas ref={canvas} width={800} height={320} style={{ border:'1px solid #eee', borderRadius:8, marginTop:12 }} />
  </div>;
}
