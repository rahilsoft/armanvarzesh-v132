
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function TodayPage({ searchParams }:{ searchParams:any }){
  const clientId = searchParams?.clientId || 'demo-client';
  const [sessions, setSessions] = useState<any[]>([]);

  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(); end.setHours(23,59,59,999);

  const load = async ()=>{
    const d = await gql(`query($c:String!,$f:String!,$t:String!){ sessionsByClient(clientId:$c, from:$f, to:$t){ id date status dayIndex } }`, { c: clientId, f: start.toISOString(), t: end.toISOString() });
    setSessions(d.sessionsByClient||[]);
  };
  useEffect(()=>{ load(); }, []);

  return (
    <div style={{ padding:24 }}>
      <h1>امروز من</h1>
      {sessions.length===0 ? <div>امروز جلسه‌ای ندارید.</div> : (
        <div style={{ display:'grid', gap:12 }}>
          {sessions.map(s=> (
            <a key={s.id} href={`/me/session/${s.id}?clientId=${clientId}`} style={{ display:'block', padding:12, border:'1px solid #eee', borderRadius:12 }}>
              <div style={{ fontWeight:700 }}>جلسه #{s.dayIndex+1} — {new Date(s.date).toLocaleTimeString()}</div>
              <div style={{ opacity:.7 }}>{s.status}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
