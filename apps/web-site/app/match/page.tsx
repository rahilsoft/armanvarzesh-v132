
'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'user','x-user-id':'user-demo'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const params = useSearchParams();
  const serviceType = (params.get('serviceType')||'COACH') as 'COACH'|'NUTRITION'|'CORRECTIVE'|'FULL';
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(()=>{ (async()=>{ setLoading(true); if (serviceType==='FULL'){ const roles:['COACH','NUTRITION','CORRECTIVE'] = ['COACH','NUTRITION','CORRECTIVE']; const bundles:any = {}; for (const r of roles){ const res = await gql(`query($t:ServiceType!){ recommendSpecialists(serviceType:$t) }`, { t: r }); bundles[r] = JSON.parse(res.recommendSpecialists||'[]').slice(0,1); } setList(bundles); } else { const res = await gql(`query($t:ServiceType!){ recommendSpecialists(serviceType:$t) }`, { t: serviceType }); setList(JSON.parse(res.recommendSpecialists||'[]')); } setLoading(false); })(); }, [serviceType]);
  const startChat = async (specId:string, role?:'COACH'|'NUTRITION'|'CORRECTIVE')=>{ const t = (serviceType==='FULL'? (role||'COACH') : serviceType) as any; await gql(`mutation($sid:String!,$t:ServiceType!){ ensureLead(specialistId:$sid, serviceType:$t) }`, { sid: specId, t }); window.location.href = `/chat/${specId}`; };
  return <div style={{ padding:24 }}>
    <h1>پیشنهادهای هوشمند</h1>
    {loading? <div>...</div> : serviceType!=='FULL' ?
      <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(3,1fr)' }}>
        {list.map((s:any)=> (
          <div key={s.specialistId} style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700 }}>{s.specialistId}</div>
            <div style={{ fontSize:12, opacity:.6 }}>امتیاز: {Math.round((s.totalScore||0)*100)/100}</div>
            <div style={{ marginTop:8 }}>
              <button onClick={()=> startChat(s.specialistId)} style={{ padding:'8px 10px', borderRadius:8 }}>گفتگوی رایگان</button>
            </div>
          </div>
        ))}
      </div>
      : <div style={{ display:'grid', gap:12, gridTemplateColumns:'repeat(3,1fr)' }}>
        {(['COACH','NUTRITION','CORRECTIVE'] as const).map((role)=> (
          <div key={role} style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:700, marginBottom:8 }}>{role==='COACH'?'مربی': role==='NUTRITION'?'تغذیه':'حرکات اصلاحی'}</div>
            {(list as any)[role]?.map((s:any)=> (
              <div key={s.specialistId} style={{ border:'1px solid #f0f0f0', borderRadius:10, padding:10, marginBottom:8 }}>
                <div style={{ fontWeight:700 }}>{s.specialistId}</div>
                <div style={{ fontSize:12, opacity:.6 }}>امتیاز: {Math.round((s.totalScore||0)*100)/100}</div>
                <button onClick={()=> startChat(s.specialistId, role)} style={{ marginTop:6, padding:'6px 10px', borderRadius:8 }}>گفتگوی رایگان</button>
              </div>
            ))}
          </div>
        ))}
      </div>
    }
  </div>;
}
