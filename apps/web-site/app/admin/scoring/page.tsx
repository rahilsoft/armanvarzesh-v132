
'use client';
import React, { useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [sid, setSid] = useState('specialist-1');
  const [role, setRole] = useState<'COACH'|'NUTRITION'|'CORRECTIVE'>('COACH');
  const recompute = async ()=>{ await gql(`mutation($id:String!,$r:ServiceType!){ recomputeScore(specialistId:$id, role:$r) }`, { id: sid, r: role }); alert('Recomputed'); };
  const top3 = async ()=>{ const res = await gql(`query($r:ServiceType!){ topSpecialists(role:$r) }`, { r: role }); alert(res.topSpecialists); };
  return <div style={{ padding:24 }}>
    <h1>امتیازدهی متخصصان</h1>
    <div style={{ display:'flex', gap:8 }}>
      <input value={sid} onChange={e=> setSid(e.target.value)} placeholder="specialistId" />
      <select value={role} onChange={e=> setRole(e.target.value as any)}>
        <option value="COACH">COACH</option>
        <option value="NUTRITION">NUTRITION</option>
        <option value="CORRECTIVE">CORRECTIVE</option>
      </select>
      <button onClick={recompute}>محاسبه مجدد</button>
      <button onClick={top3}>Top 3</button>
    </div>
  </div>;
}
