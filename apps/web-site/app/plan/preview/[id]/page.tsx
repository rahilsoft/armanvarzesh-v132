
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function PlanPreview({ params }:{ params:{ id:string } }){
  const id = params.id;
  const [data, setData] = useState<any>(null);
  useEffect(()=>{
    (async()=>{
      const d = await gql(`query($id:String!){ plan(id:$id){ id title description days{ id order title blocks{ id order section type protocol protocolParams items{ id order note exerciseId sets{ id order reps rest targetWeight targetRPE } } } } } }`, { id });
      setData(d.plan);
    })();
  }, [id]);
  if (!data) return <div style={{ padding:24 }}>در حال بارگذاری…</div>;
  return (
    <div style={{ padding:24 }}>
      <h1>پیش‌نمایش برنامه — {data.title}</h1>
      {data.days.sort((a:any,b:any)=> a.order-b.order).map((d:any)=> (
        <div key={d.id} style={{ border:'1px solid #eee', borderRadius:12, padding:12, marginBottom:12 }}>
          <strong>روز {d.order+1} — {d.title||''}</strong>
          {d.blocks.sort((a:any,b:any)=> a.order-b.order).map((b:any)=> (
            <div key={b.id} style={{ marginTop:8, padding:8, background:'#fafafa', borderRadius:8 }}>
              <div style={{ fontWeight:600 }}>{b.section||'MAIN'} • {b.type} {b.protocol? `• ${b.protocol}`: ''}</div>
              {b.items.sort((a:any,b:any)=> a.order-b.order).map((it:any)=> (
                <div key={it.id} style={{ marginTop:6 }}>
                  <div style={{ opacity:.8 }}>{it.note||'آیتم'}</div>
                  <ul>{it.sets.sort((a:any,b:any)=> a.order-b.order).map((s:any)=> (<li key={s.id}>#{s.order+1} — {s.reps} reps{typeof s.targetWeight==='number'? ` @ ${s.targetWeight}kg`:''}{typeof s.targetRPE==='number'? ` • RPE ${s.targetRPE}`:''} • Rest {s.rest}s</li>))}</ul>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

<style>{`@media print { button, nav { display:none !important } body { color:#000 } }`}</style>
