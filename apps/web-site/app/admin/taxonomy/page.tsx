
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function Taxonomy(){
  const [sports, setSports] = useState<any[]>([]);
  const [equip, setEquip] = useState<any[]>([]);
  const [muscles, setMuscles] = useState<any[]>([]);

  const load = async ()=>{
    const d = await gql(`query{ sports{ id name } equipmentCatalogs{ id name } muscles{ id code name } }`);
    setSports(d.sports||[]); setEquip(d.equipmentCatalogs||[]); setMuscles(d.muscles||[]);
  };
  useEffect(()=>{ load(); }, []);

  const add = async (kind:'sport'|'equip'|'muscle')=>{
    if (kind==='sport'){ const name = prompt('نام رشته؟'); if (!name) return; await gql(`mutation($name:String!){ upsertSport(name:$name){ id } }`, { name }); }
    if (kind==='equip'){ const name = prompt('نام تجهیز؟'); if (!name) return; await gql(`mutation($name:String!){ upsertEquipment(name:$name){ id } }`, { name }); }
    if (kind==='muscle'){ const code = prompt('کد عضله؟ (مثلا glutes)'); const name = prompt('نام نمایشی؟'); if (!code||!name) return; await gql(`mutation($code:String!,$name:String!){ upsertMuscle(code:$code,name:$name){ id } }`, { code, name }); }
    await load();
  };

  return (
    <div style={{ padding:24, display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
      <div>
        <h2>رشته‌های ورزشی</h2>
        <button onClick={()=> add('sport')}>+ افزودن</button>
        <ul>{sports.map((s:any)=><li key={s.id}>{s.name}</li>)}</ul>
      </div>
      <div>
        <h2>تجهیزات</h2>
        <button onClick={()=> add('equip')}>+ افزودن</button>
        <ul>{equip.map((e:any)=><li key={e.id}>{e.name}</li>)}</ul>
      </div>
      <div>
        <h2>عضلات</h2>
        <button onClick={()=> add('muscle')}>+ افزودن</button>
        <ul>{muscles.map((m:any)=><li key={m.id}>{m.code} — {m.name}</li>)}</ul>
      </div>
    </div>
  );
}
