
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [rows, setRows] = useState<any[]>([]);
  const load = async ()=>{ const res = await gql(`query{ mediaJobs }`); setRows(JSON.parse(res.mediaJobs||'[]')); };
  useEffect(()=>{ load(); }, []);
  return <div style={{ padding:24 }}>
    <h1>Media Jobs</h1>
    <button onClick={load}>Refresh</button>
    <div style={{ display:'grid', gap:8, marginTop:12 }}>
      {rows.map((m:any)=> <div key={m.id} style={{ border:'1px solid #eee', borderRadius:8, padding:12 }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <b>{m.kind}</b><span>{m.status}</span>
        </div>
        <div style={{ fontSize:12, opacity:.7 }}>{m.url}</div>
        {m.result?.thumbnail && <img src={m.result.thumbnail} style={{ width:200, borderRadius:6, marginTop:6 }} />}
        {m.error && <pre style={{ whiteSpace:'pre-wrap', color:'#b91c1c' }}>{m.error}</pre>}
      </div>)}
    </div>
  </div>;
}
