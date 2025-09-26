
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'user','x-user-id':'user-demo'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page({ params }:{ params:{ assignmentId:string }}){
  const { assignmentId } = params;
  const [plan, setPlan] = useState<any>(null);
  const [day, setDay] = useState(0);
  const load = async ()=>{
    const res = await gql(`query($id:String!){ getAssignedPlan(id:$id) }`, { id: assignmentId });
    const j = JSON.parse(res.getAssignedPlan||'{}');
    setPlan(j);
  };
  useEffect(()=>{ load(); },[]);
  const check = async (section:string, idx:number)=>{
    await gql(`mutation($id:String!,$day:Int!,$key:String!,$val:String!){ logCorrectiveCheck(assignmentId:$id, dayIndex:$day, itemKey:$key, value:$val) }`, { id: assignmentId, day, key: `${section}:${idx}`, val: JSON.stringify({ checked:true }) });
  };
  if (!plan) return <div style={{ padding:24 }}>...</div>;
  const d = plan.days?.[day] || { warmup:[], main:[], cooldown:[] };
  return <div style={{ padding:24 }}>
    <h1>جلسه اصلاحی</h1>
    <div>روز: <select value={day} onChange={e=> setDay(parseInt(e.target.value))}>{plan.days?.map((_:any,i:number)=> <option key={i} value={i}>روز {i+1}</option>)}</select></div>
    <section style={{ marginTop:12 }}>
      <h3>گرم کردن</h3>
      <ol>{d.warmup.map((x:any,i:number)=> <li key={i}><label><input type="checkbox" onChange={()=> check('warmup', i)} /> {x.title}</label> {x.url && <a href={x.url} target="_blank">ویدئو</a>}</li>)}</ol>
      <h3>تمرین اصلی</h3>
      <ol>{d.main.map((x:any,i:number)=> <li key={i}><label><input type="checkbox" onChange={()=> check('main', i)} /> {x.title}</label> {x.url && <a href={x.url} target="_blank">ویدئو</a>}</li>)}</ol>
      <h3>سرد کردن</h3>
      <ol>{d.cooldown.map((x:any,i:number)=> <li key={i}><label><input type="checkbox" onChange={()=> check('cooldown', i)} /> {x.title}</label> {x.url && <a href={x.url} target="_blank">ویدئو</a>}</li>)}</ol>
    </section>
  </div>;
}
