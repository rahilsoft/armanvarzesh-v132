
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function ReorderPage({ params }:{ params:{ dayId:string } }){
  const dayId = params.dayId;
  const [blocks, setBlocks] = useState<any[]>([]);
  const [msg, setMsg] = useState('');

  const load = async ()=>{
    const d = await gql(`query($id:String!){ planDayById(dayId:$id){ id blocks{ id order section type } } }`, { id: dayId });
    const arr = (d.planDayById?.blocks||[]).slice().sort((a:any,b:any)=> a.order-b.order);
    setBlocks(arr);
  };
  useEffect(()=>{ load(); }, [dayId]);

  const onDragStart = (e:any, id:string)=>{ e.dataTransfer.setData('id', id); };
  const onDrop = (e:any, id:string)=>{
    const fromId = e.dataTransfer.getData('id');
    if (!fromId || fromId===id) return;
    const next = blocks.slice();
    const fromIdx = next.findIndex(x=> x.id===fromId);
    const toIdx = next.findIndex(x=> x.id===id);
    const [m] = next.splice(fromIdx,1);
    next.splice(toIdx,0,m);
    setBlocks(next);
  };
  const onDragOver = (e:any)=> e.preventDefault();

  const save = async ()=>{
    setMsg('');
    const orderedIds = blocks.map(b=> b.id);
    await gql(`mutation($d:String!,$ids:[String!]!){ reorderPlanBlocks(dayId:$d, orderedIds:$ids) }`, { d: dayId, ids: orderedIds });
    setMsg('ذخیره شد ✓'); load();
  };

  return (
    <div style={{ padding:24 }}>
      <h1>مرتب‌سازی بلوک‌ها</h1>
      <div style={{ display:'grid', gap:8 }}>
        {blocks.map(b=> (
          <div key={b.id} draggable onDragStart={(e)=> onDragStart(e,b.id)} onDragOver={onDragOver} onDrop={(e)=> onDrop(e,b.id)} style={{ padding:12, border:'1px dashed #ccc', borderRadius:12, background:'#fff' }}>
            <strong>#{String(b.order+1).padStart(2,'0')}</strong> • {b.section||'MAIN'} • {b.type}
          </div>
        ))}
      </div>
      <div style={{ height:12 }} />
      <button onClick={save} style={{ padding:'8px 12px', borderRadius:8, background:'#111', color:'#fff' }}>ذخیرهٔ ترتیب</button>
      {!!msg && <div style={{ marginTop:8, color: msg.includes('✓')? '#1f8f4f':'crimson' }}>{msg}</div>}
    </div>
  );
}
