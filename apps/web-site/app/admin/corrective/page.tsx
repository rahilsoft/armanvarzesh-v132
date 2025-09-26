
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [list, setList] = useState<any[]>([]);
  const [q, setQ] = useState('');
  const load = async ()=>{
    const res = await gql(`query($input:SearchCorrectiveInput){ searchCorrectiveVideos(input:$input){ id title url voiceUrl uploadedBy status visibility conditions } }`, { input:{ q, approvedOnly:false } });
    setList(res.searchCorrectiveVideos||[]);
  };
  useEffect(()=>{ load(); }, []);
  const act = async (id:string, status:'APPROVED'|'REJECTED', visibility?:'PUBLIC'|'PRIVATE', note?:string)=>{
    await gql(`mutation($id:String!,$st:String,$patch:JSON){ approveCorrectiveVideo(id:$id, status:$st, patch:$patch) }`, { id, st: status, patch:{ visibility, note } });
    await load();
  };
  return <div style={{ padding:24 }}>
    <h1>بازبینی ویدئوهای اصلاحی</h1>
    <div style={{ display:'flex', gap:8, margin:'8px 0' }}>
      <input placeholder="جستجو..." value={q} onChange={e=> setQ(e.target.value)} />
      <button onClick={load}>جستجو</button>
    </div>
    <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(3,1fr)' }}>
      {list.map((v:any)=> (
        <div key={v.id} style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700 }}>{v.title}</div>
          <div style={{ fontSize:12, opacity:.6 }}>{v.uploadedBy} • {v.status} • {v.visibility}</div>
          <video src={v.url} controls style={{ width:'100%', marginTop:8, borderRadius:8 }} />
          {v.voiceUrl && <audio src={v.voiceUrl} controls style={{ width:'100%', marginTop:8 }} />}
          <div style={{ display:'flex', gap:6, marginTop:8 }}>
            <button onClick={()=> act(v.id,'APPROVED','PUBLIC','✓')}>تایید (عمومی)</button>
            <button onClick={()=> act(v.id,'APPROVED','PRIVATE','فقط خصوصی')}>تایید (خصوصی)</button>
            <button onClick={()=> act(v.id,'REJECTED',undefined,'نیاز به اصلاح')}>رد</button>
          </div>
        </div>
      ))}
    </div>
  </div>;
}
