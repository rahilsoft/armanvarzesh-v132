'use client';

import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'specialist'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function Page(){
  const [conds, setConds] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  useEffect(()=>{ (async()=>{
    const a = await gql(`query{ correctiveConditions{ code nameFa } }`);
    setConds(a.correctiveConditions||[]);
    const b = await gql(`query{ searchCorrectiveVideos{ id title status conditions } }`);
    setVideos(b.searchCorrectiveVideos||[]);
  })(); },[]);
  return (
    <div style={{ padding:24 }}>
      <h1>داشبورد کارشناس حرکت اصلاحی</h1>
      <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(3,1fr)' }}>
        <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700 }}>ناهنجاری‌ها</div>
          <ul>{conds.map((c:any)=> <li key={c.code}>{c.nameFa} <span style={{opacity:.5}}>({c.code})</span></li>)}</ul>
        </div>
        <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700 }}>ویدئوهای من</div>
          <div style={{ fontSize:28 }}>{videos.length}</div>
        </div>
        <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700 }}>میانبرها</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            <a href="/specialist/library">کتابخانهٔ اصلاحی</a>
            <a href="/specialist/upload">آپلود ویدئو</a>
            <a href="/specialist/plan">سازندهٔ برنامهٔ اصلاحی</a>
          </div>
        </div>
      </div>
    </div>
  );
}
