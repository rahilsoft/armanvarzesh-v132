'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-user-id':'user-1'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
function Col({ title, items, onStart }:{ title:string, items:any[], onStart:(id:string, role:string)=>void }){
  return <div style={{ flex:1, border:'1px solid #eee', borderRadius:12, padding:12 }}>
    <h3 style={{ marginTop:0 }}>{title}</h3>
    <div style={{ display:'grid', gap:12 }}>
      {items.map((s:any)=> <div key={s.specialistId} style={{ border:'1px solid #f0f0f0', borderRadius:10, padding:10 }}>
        <div style={{ display:'flex', justifyContent:'space-between' }}>
          <b>{s.specialistId}</b>
          <span>{Math.round((s.totalScore||0)*100)/100}</span>
        </div>
        {s.meta?.activeAt && ((Date.now()-new Date(s.meta.activeAt).getTime())/1000<600) ? <span style={{ color:'#059669', fontSize:12 }}>● آنلاین</span> : null}
        {s.meta?.introVideoUrl && <video src={s.meta.introVideoUrl} controls style={{ width:'100%', marginTop:8, borderRadius:8 }} />}
        <div style={{ marginTop:8 }}>
          <button onClick={()=> onStart(s.specialistId, s.role || 'COACH')} style={{ padding:'8px 10px', borderRadius:8 }}>گفتگوی رایگان</button>
        </div>
      </div>)}
    </div>
  </div>;
}

export default function Page(){
  const [coach, setCoach] = useState<any[]>([]);
  const [nutri, setNutri] = useState<any[]>([]);
  const [corr, setCorr] = useState<any[]>([]);
  const load = async ()=>{
    const q = `query($t:ServiceType!){ recommendSpecialists(serviceType:$t) }`;
    const [c,n,k] = await Promise.all([
      gql(q,{t:'COACH'}), gql(q,{t:'NUTRITION'}), gql(q,{t:'CORRECTIVE'})
    ]);
    setCoach(JSON.parse(c.recommendSpecialists||'[]'));
    setNutri(JSON.parse(n.recommendSpecialists||'[]'));
    setCorr(JSON.parse(k.recommendSpecialists||'[]'));
  };
  useEffect(()=>{ load(); }, []);
  const start = async (sid:string, role:string)=>{
    await gql(`mutation($sid:String!,$t:ServiceType!){ ensureLead(specialistId:$sid, serviceType:$t) }`, { sid, t: role });
    alert('چت آغاز شد');
  };
  return <div style={{ padding:24 }}>
    <h1>پکیج کامل — ۳ پیشنهاد برای هر نقش</h1>
    <div style={{ display:'flex', gap:12 }}>
      <Col title="مربی" items={coach} onStart={(id)=> start(id,'COACH')} />
      <Col title="تغذیه" items={nutri} onStart={(id)=> start(id,'NUTRITION')} />
      <Col title="حرکت اصلاحی" items={corr} onStart={(id)=> start(id,'CORRECTIVE')} />
    </div>
  </div>;
}
