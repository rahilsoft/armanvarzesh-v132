
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [list, setList] = useState<any[]>([]);
  const [f, setF] = useState<any>({ specialistId:'specialist-1', role:'COACH', displayName:'نام نمایشی', bio:'', avatarUrl:'', introVideoUrl:'', tags:[] });
  const load = async ()=>{
    const r = await gql(`query{ listSpecialistProfiles }`); setList(JSON.parse(r.listSpecialistProfiles||'[]'));
  };
  useEffect(()=>{ load(); },[]);
  const save = async ()=>{
    await gql(`mutation($sid:String!,$r:ServiceType!,$name:String!,$bio:String,$av:String,$iv:String,$tags:String){ upsertSpecialistProfile(specialistId:$sid, role:$r, displayName:$name, bio:$bio, avatarUrl:$av, introVideoUrl:$iv, tagsJson:$tags) }`, 
      { sid:f.specialistId, r:f.role, name:f.displayName, bio:f.bio, av:f.avatarUrl, iv:f.introVideoUrl, tags: JSON.stringify(f.tags||[]) });
    await load();
  };
  return <div style={{ padding:24 }}>
    <h1>پروفایل متخصصان</h1>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:16 }}>
      <div>
        <input placeholder="specialistId" value={f.specialistId} onChange={e=> setF({...f, specialistId:e.target.value})} />
        <select value={f.role} onChange={e=> setF({...f, role:e.target.value})}>
          <option value="COACH">COACH</option>
          <option value="NUTRITION">NUTRITION</option>
          <option value="CORRECTIVE">CORRECTIVE</option>
        </select>
        <input placeholder="displayName" value={f.displayName} onChange={e=> setF({...f, displayName:e.target.value})} />
        <input placeholder="avatarUrl" value={f.avatarUrl} onChange={e=> setF({...f, avatarUrl:e.target.value})} />
        <input placeholder="introVideoUrl" value={f.introVideoUrl} onChange={e=> setF({...f, introVideoUrl:e.target.value})} />
        <textarea placeholder="bio" value={f.bio} onChange={e=> setF({...f, bio:e.target.value})} />
        <textarea placeholder="tags JSON []" value={JSON.stringify(f.tags)} onChange={e=> setF({...f, tags: JSON.parse(e.target.value||'[]') })} />
        <button onClick={save}>ثبت/بروزرسانی</button>
      </div>
      <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(3,1fr)' }}>
        {list.map((p:any)=> (
          <div key={p.specialistId} style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700 }}>{p.displayName}</div>
            <div style={{ fontSize:12, opacity:.6 }}>{p.specialistId} • {p.role}</div>
            {p.introVideoUrl && <video src={p.introVideoUrl} controls style={{ width:'100%', borderRadius:8, marginTop:8 }} />}
          </div>
        ))}
      </div>
    </div>
  </div>;
}
