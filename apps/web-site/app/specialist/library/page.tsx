import dynamic from 'next/dynamic';
'use client';

import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
  const [sex, setSex] = useState<'male'|'female'>('male');
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'specialist'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

const AnatomyBoard = dynamic(()=> import('../_components/AnatomyBoard'), { ssr:false });
export default function Page(){
  const [conds, setConds] = useState<any[]>([]);
  const [sel, setSel] = useState<string[]>([]);
  const [q, setQ] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [tab, setTab] = useState<'public'|'private'>('public');
  useEffect(()=>{ (async()=>{ const a = await gql(`query{ correctiveConditions{ code nameFa } }`); setConds(a.correctiveConditions||[]); })(); }, []);
  const search = async ()=>{
    const res = await gql(`query($input:SearchCorrectiveInput){ searchCorrectiveVideos(input:$input){ id title status conditions url voiceUrl visibility } }`, { input:{ q, conditions: sel, approvedOnly: tab==='public', mineOnly: tab==='private', visibility: tab==='private'? 'PRIVATE': undefined } });
    setList(res.searchCorrectiveVideos||[]);
  };
  useEffect(()=>{ search(); }, [sel, tab]);
  return (
    <div style={{ padding:24 }}>
      <h1>کتابخانهٔ حرکات اصلاحی</h1><p style={{opacity:.7}}>عمومی (تاییدشده) و خصوصی (فقط خودم)</p>
      <div style={{ display:'grid', gridTemplateColumns:'320px 1fr', gap:12 }}>
        <AnatomyBoard sex={sex} onPick={(code)=> setQ((q)=> (q? q+' '+code: code))} />
        <div>
          <div style={{ display:'flex', gap:8, margin:'8px 0' }}>
        <div style={{ display:'inline-flex', gap:6, border:'1px solid #eee', borderRadius:100, padding:4 }}>
          <button onClick={()=> setTab('public')} style={{ padding:'6px 10px', borderRadius:100, background: tab==='public'?'#111':'#fff', color: tab==='public'?'#fff':'#111' }}>عمومی</button>
          <button onClick={()=> setTab('private')} style={{ padding:'6px 10px', borderRadius:100, background: tab==='private'?'#111':'#fff', color: tab==='private'?'#fff':'#111' }}>خصوصی من</button>
        </div>
        <input placeholder="جستجو..." value={q} onChange={e=> setQ(e.target.value)} />
        <button onClick={search}>جستجو</button><div style={{flex:1}} /><div>جنسیت: <select value={sex} onChange={e=> setSex(e.target.value as any)}><option value='male'>مرد</option><option value='female'>زن</option></select></div>
      </div>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', margin:'8px 0' }}>
        {conds.map((c:any)=> <button key={c.code} onClick={()=> setSel(sel.includes(c.code)? sel.filter(x=> x!==c.code): [...sel, c.code])} style={{ padding:'6px 10px', borderRadius:100, border:'1px solid #eee', background: sel.includes(c.code)? '#111':'#fff', color: sel.includes(c.code)? '#fff':'#111' }}>{c.nameFa}</button>)}
      </div>
      <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(3,1fr)' }}>
        {list.map((v:any)=> (
          <div key={v.id} style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700 }}>{v.title}</div>
            <div style={{ opacity:.6, fontSize:12 }}>{(v.conditions||[]).join(', ')}</div>
            <video src={v.url} controls style={{ width:'100%', marginTop:8, borderRadius:8 }} />
            <div style={{ opacity:.6, fontSize:12, marginTop:6 }}>وضعیت: {v.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
