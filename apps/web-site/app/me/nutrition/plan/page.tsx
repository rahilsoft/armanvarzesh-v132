
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'user','x-user-id':'user-1'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [plan, setPlan] = useState<any>(null);
  const load = async ()=>{ const d=await gql(`query{ getNutritionPlan(userId:"user-1") }`); setPlan(JSON.parse(d.getNutritionPlan||'{}')); };
  useEffect(()=>{ load(); }, []);
  const tick = async (didx:number, mealKey:string, checked:boolean)=>{
    if (!plan?.id) return;
    await gql(`mutation($u:String!,$p:String!,$d:Int!,$m:String!,$c:Boolean!){ markMealChecked(userId:$u, planId:$p, dayIndex:$d, mealKey:$m, checked:$c) }`,
      { u:'user-1', p: plan.id, d: didx, m: mealKey, c: checked });
    alert('Saved');
  };
  if (!plan?.json) return <div style={{ padding:24 }}>برنامه‌ای وجود ندارد.</div>;
  const days = plan.json.days||[];
  return <div style={{ padding:24 }}>
    <h1>برنامهٔ غذایی من</h1>
    <div style={{ display:'grid', gap:12 }}>
      {days.map((d:any, i:number)=> <div key={i} style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
        <b>روز {i+1}</b> — کالری: {d.totals?.calories}
        <div style={{ display:'grid', gap:8, marginTop:8 }}>
          {d.meals.map((m:any, j:number)=> <div key={j} style={{ padding:8, border:'1px dashed #ddd', borderRadius:8 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <span>{m.name}</span>
              <label style={{ fontSize:12 }}><input type="checkbox" onChange={e=> tick(i, m.name, e.target.checked)} /> مصرف شد</label>
            </div>
            <ul>{m.items.map((it:any,k:number)=> <li key={k}>{it.food?.nameFa||it.foodId} — {it.grams}g ({it.macros?.calories} kcal)</li>)}</ul>
          </div>)}
        </div>
      </div>)}
    </div>
  </div>;
}
