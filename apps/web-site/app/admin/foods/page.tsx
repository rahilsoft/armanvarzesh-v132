
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [rows, setRows] = useState<any[]>([]);
  const [form, setForm] = useState<any>({ nameFa:'برنج', calories:360, protein:7, carbs:80, fat:1, unitsJson:'{"cup":240,"tbsp":15}' });
  const load = async ()=>{ const d=await gql(`query{ listFoods }`); setRows(JSON.parse(d.listFoods||'[]')); };
  useEffect(()=>{ load(); }, []);
  const save = async ()=>{
    await gql(`mutation($n:String!,$cal:Float!,$p:Float!,$c:Float!,$f:Float!,$en:String,$u:String){ upsertFood(nameFa:$n, calories:$cal, protein:$p, carbs:$c, fat:$f, nameEn:$en, unitsJson:$u) }`,
      { n: form.nameFa, cal: +form.calories, p:+form.protein, c:+form.carbs, f:+form.fat, en: form.nameEn||'', u: form.unitsJson||'' });
    await load();
  };
  return <div style={{ padding:24 }}>
    <h1>Food Database (Admin)</h1>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
      <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
        <h3>افزودن/ویرایش</h3>
        {Object.entries(form).map(([k,v])=> <label key={k} style={{ display:'grid', gridTemplateColumns:'120px 1fr', gap:8 }}>
          {k}<input value={v as any} onChange={e=> setForm({...form, [k]: e.target.value})}/>
        </label>)}
        <button onClick={save}>ذخیره</button>
      </div>
      <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
        <h3>لیست</h3>
        <div style={{ maxHeight:360, overflow:'auto', display:'grid', gap:6 }}>
          {rows.map((r:any)=> <div key={r.id} style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr', gap:8 }}>
            <b>{r.nameFa}</b><span>{r.calories}</span><span>{r.protein}</span><span>{r.carbs}</span><span>{r.fat}</span>
          </div>)}
        </div>
      </div>
    </div>
  </div>;
}
