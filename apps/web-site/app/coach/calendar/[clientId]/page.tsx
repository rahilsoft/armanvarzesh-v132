
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function CoachCalendar({ params }:{ params:{ clientId:string } }){
  const { clientId } = params;
  const [list, setList] = useState<any[]>([]);
  const [from, setFrom] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());
  const [to, setTo] = useState<string>(new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).toISOString());

  const load = async ()=>{
    const d = await gql(`query($c:String!,$f:String!,$t:String!){ sessionsByClient(clientId:$c, from:$f, to:$t){ id date dayIndex status } }`, { c: clientId, f: from, t: to });
    setList(d.sessionsByClient||[]);
  };
  useEffect(()=>{ load(); }, [from, to]);

  return (
    <div style={{ padding:24 }}>
      <h1>تقویم جلسات — {clientId}</h1>
      <div style={{ display:'grid', gap:8, gridTemplateColumns:'1fr 1fr 1fr' }}>
        {list.map((s:any)=> (
          <div key={s.id} style={{ border:'1px solid #eee', borderRadius:10, padding:10 }}>
            <div style={{ fontWeight:600 }}>{new Date(s.date).toLocaleDateString()}</div>
            <div style={{ opacity:.7 }}>روز برنامه: {s.dayIndex+1} • وضعیت: {s.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
