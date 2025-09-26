
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
function Bar({ v }:{ v:number }){
  const w = Math.max(0, Math.min(100, Math.round(v*100)));
  return <div style={{ background:'#f3f4f6', height:8, borderRadius:4 }}><div style={{ width:`${w}%`, height:8, borderRadius:4, background:'#111' }} /></div>;
}
export default function Page(){
  const [role, setRole] = useState<'COACH'|'NUTRITION'|'CORRECTIVE'>('COACH');
  const [rows, setRows] = useState<any[]>([]);
  const load = async ()=>{
    const res = await gql(`query($r:ServiceType!){ topSpecialists(role:$r, limit:10) }`, { r: role });
    setRows(JSON.parse(res.topSpecialists||'[]'));
  };
  useEffect(()=>{ load(); }, [role]);
  return <div style={{ padding:24 }}>
    <h1>تحلیل امتیازدهی</h1>
    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
      <select value={role} onChange={e=> setRole(e.target.value as any)}>
        <option value="COACH">COACH</option>
        <option value="NUTRITION">NUTRITION</option>
        <option value="CORRECTIVE">CORRECTIVE</option>
      </select>
      <button onClick={load}>Refresh</button>
      <a href="/admin/scoring/weights" style={{ marginInlineStart:'auto' }}>تنظیم وزن‌ها</a>
    </div>
    <div style={{ marginTop:12, display:'grid', gap:12 }}>
      {rows.map((r:any)=> {
        const m = r.metrics||{};
        return <div key={r.specialistId} style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <div style={{ display:'flex', justifyContent:'space-between' }}>
            <b>{r.specialistId}</b>
            <span>امتیاز کل: {Math.round((r.totalScore||0)*100)/100}</span>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'150px 1fr 60px', gap:8, marginTop:8 }}>
            {Object.entries(m).map(([k,v]:any)=> (
              <React.Fragment key={k}>
                <div style={{ textTransform:'none' }}>{k}</div>
                <Bar v={typeof v==='number'? v : 0} />
                <div style={{ textAlign:'end' }}>{typeof v==='number'? (v*100).toFixed(0)+'%' : '-'}</div>
              </React.Fragment>
            ))}
          </div>
        </div>;
      })}
    </div>
  </div>;
}
