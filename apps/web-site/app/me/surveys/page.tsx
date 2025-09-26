
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'user','x-user-id':'user-demo'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [rows, setRows] = useState<any[]>([]);
  const load = async ()=>{ const res = await gql(`query{ mySurveyTasks }`); setRows(JSON.parse(res.mySurveyTasks||'[]')); };
  useEffect(()=>{ load(); },[]);
  return <div style={{ padding:24 }}>
    <h1>نظرسنجی‌های من</h1>
    <div style={{ display:'grid', gap:12 }}>
      {rows.map(r=> <div key={r.id} style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
        <div><b>{r.templateCode}</b> • موعد: {new Date(r.dueAt).toLocaleDateString()}</div>
        <a href={`/me/surveys/${r.id}`}>پاسخ دادن</a>
      </div>)}
    </div>
  </div>;
}
