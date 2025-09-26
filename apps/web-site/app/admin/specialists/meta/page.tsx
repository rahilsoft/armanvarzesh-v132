
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [id, setId] = useState('specialist-1');
  const [m, setM] = useState<any>({});
  const load = async ()=>{ const res = await gql(`query($id:String!){ getSpecialistMeta(specialistId:$id) }`, { id }); setM(JSON.parse(res.getSpecialistMeta||'{}')); };
  useEffect(()=>{ load(); }, []);
  const save = async ()=>{
    await gql(`mutation($id:String!,$role:ServiceType,$tags:String,$gf:String,$a:Int,$b:Int,$bio:String,$vid:String){
      updateSpecialistMeta(specialistId:$id, role:$role, tags:$tags, genderFocus:$gf, minAge:$a, maxAge:$b, bio:$bio, introVideoUrl:$vid)
    }`, { id, role: m.role||null, tags: m.tags||null, gf: m.genderFocus||null, a: m.minAge||null, b: m.maxAge||null, bio: m.bio||null, vid: m.introVideoUrl||null });
    alert('Saved');
  };
  const change = (k:string, v:any)=> setM((o:any)=> ({ ...o, [k]: v }));
  return <div style={{ padding:24, maxWidth:720 }}>
    <h1>ویرایش متای متخصص</h1>
    <div style={{ display:'grid', gap:8 }}>
      <input value={id} onChange={e=> setId(e.target.value)} placeholder="specialistId" />
      <button onClick={load}>Load</button>
      <label>نقش</label>
      <select value={m.role||''} onChange={e=> change('role', e.target.value)}>
        <option value="">—</option>
        <option value="COACH">COACH</option>
        <option value="NUTRITION">NUTRITION</option>
        <option value="CORRECTIVE">CORRECTIVE</option>
      </select>
      <label>تگ‌ها</label>
      <input value={m.tags||''} onChange={e=> change('tags', e.target.value)} />
      <label>تمرکز جنسیتی</label>
      <select value={m.genderFocus||'any'} onChange={e=> change('genderFocus', e.target.value)}>
        <option value="any">any</option>
        <option value="male">male</option>
        <option value="female">female</option>
      </select>
      <label>حداقل سن</label>
      <input type="number" value={m.minAge||''} onChange={e=> change('minAge', parseInt(e.target.value||'0'))} />
      <label>حداکثر سن</label>
      <input type="number" value={m.maxAge||''} onChange={e=> change('maxAge', parseInt(e.target.value||'0'))} />
      <label>Bio</label>
      <textarea value={m.bio||''} onChange={e=> change('bio', e.target.value)} />
      <label>Intro Video URL</label>
      <input value={m.introVideoUrl||''} onChange={e=> change('introVideoUrl', e.target.value)} />
      <button onClick={save} style={{ background:'#111', color:'#fff', padding:'10px 12px', borderRadius:8 }}>ذخیره</button>
    </div>
  </div>;
}
