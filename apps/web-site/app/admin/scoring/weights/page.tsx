
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [role, setRole] = useState<'COACH'|'NUTRITION'|'CORRECTIVE'>('COACH');
  const [weights, setWeights] = useState<any>({});
  const load = async ()=>{
    const res = await gql(`query($r:ServiceType!){ topSpecialists(role:$r) }`, { r: role }); // just ping
    // We don't have a query to fetch weights; allow editing ad-hoc and save.
  };
  useEffect(()=>{ load(); }, [role]);
  const keys = ['followup','multimodal','biweekly','endterm','renewal','goalFocus','freeToPremium','contentQuality','responsiveness','baselineBoost'];
  const save = async ()=>{
    await gql(`mutation($role:ServiceType!,$json:JSON!){ upsertWeights(role:$role, json:$json) }`, { role, json: weights });
    alert('ذخیره شد');
  };
  return <div style={{ padding:24 }}>
    <h1>وزن‌دهی امتیازدهی</h1>
    <select value={role} onChange={e=> setRole(e.target.value as any)}>
      <option value="COACH">COACH</option>
      <option value="NUTRITION">NUTRITION</option>
      <option value="CORRECTIVE">CORRECTIVE</option>
    </select>
    <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:12, marginTop:12 }}>
      {keys.map(k=> <div key={k}><label>{k}</label><input type="number" step="0.01" value={weights[k]??''} onChange={e=> setWeights({...weights, [k]: parseFloat(e.target.value||'0')})} /></div>)}
    </div>
    <button onClick={save} style={{ marginTop:12 }}>ذخیره</button>
  </div>;
}
