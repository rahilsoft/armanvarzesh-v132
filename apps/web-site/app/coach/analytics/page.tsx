
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function Analytics(){
  const [clientId, setClientId] = useState('demo-client');
  const [from, setFrom] = useState(()=>{ const d = new Date(); d.setDate(d.getDate()-28); return d.toISOString().slice(0,10); });
  const [to, setTo] = useState(()=> new Date().toISOString().slice(0,10));
  const [adh, setAdh] = useState<any>(null);
  const [tops, setTops] = useState<any[]>([]);
  const [load, setLoad] = useState<any[]>([]);
  const loadAll = async ()=>{
    const a = await gql(`query($c:String!,$f:String!,$t:String!){ userAdherence(clientId:$c, from:$f, to:$t){ clientId scheduled completed completionRate } }`, { c: clientId, f: from, t: to });
    setAdh(a.userAdherence);
    const b = await gql(`query{ topExercises(limit:8){ id title viewCount likeCount } }`);
    setTops(b.topExercises||[]);
    const c = await gql(`query($c:String!){ trainingLoadByWeek(clientId:$c){ week load } }`, { c: clientId });
    setLoad(c.trainingLoadByWeek||[]);
  };
  useEffect(()=>{ loadAll(); }, []);
  return (
    <div style={{ padding:24 }}>
      <h1>تحلیل مربی</h1>
      <div style={{ display:'grid', gap:8, gridTemplateColumns:'repeat(3, 1fr)' }}>
        <div style={{ gridColumn:'1 / span 3', display:'flex', gap:8 }}>
          <input placeholder='clientId' value={clientId} onChange={e=> setClientId(e.target.value)} />
          <input type='date' value={from} onChange={e=> setFrom(e.target.value)} />
          <input type='date' value={to} onChange={e=> setTo(e.target.value)} />
          <button onClick={loadAll}>به‌روزرسانی</button>
        </div>
        <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700 }}>پایبندی ۴ هفته</div>
          {adh ? <div style={{ fontSize:24 }}>{Math.round((adh.completionRate||0)*100)}%</div> : '—'}
          <div style={{ opacity:.7 }}>Scheduled: {adh?.scheduled||0} • Completed: {adh?.completed||0}</div>
        </div>
        <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700 }}>Top Exercises</div>
          <ol style={{ marginTop:6 }}>{tops.map((t:any)=> <li key={t.id}>{t.title} • ❤ {t.likeCount} • 👁 {t.viewCount}</li>)}</ol>
        </div>
        <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700 }}>Training Load (هفتگی)</div>
          <ul style={{ marginTop:6 }}>{load.map((l:any)=> <li key={l.week}>{l.week}: {Math.round(l.load)}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
