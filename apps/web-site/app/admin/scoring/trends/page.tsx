
'use client';
import React, { useEffect, useRef, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [id, setId] = useState('specialist-1');
  const [role, setRole] = useState<'COACH'|'NUTRITION'|'CORRECTIVE'>('COACH');
  const [data, setData] = useState<any[]>([]);
  const ref = useRef<HTMLCanvasElement>(null);
  const load = async ()=>{ const res = await gql(`query($id:String!,$r:ServiceType!){ scoreHistory(specialistId:$id, role:$r) }`, { id, r: role }); setData(JSON.parse(res.scoreHistory||'[]')); };
  useEffect(()=>{ load(); }, []);
  useEffect(()=>{
    if (!ref.current) return;
    const ctx = ref.current.getContext('2d'); if (!ctx) return;
    const w = ref.current.width, h = ref.current.height;
    ctx.clearRect(0,0,w,h);
    if (!data.length) return;
    const xs = data.map((d:any,i:number)=> i/(data.length-1||1));
    const ys = data.map((d:any)=> d.totalScore||0);
    const ymin = Math.min(...ys), ymax = Math.max(...ys);
    function yval(v:number){ if (ymax===ymin) return h*0.6; return h - ( (v-ymin)/(ymax-ymin) ) * (h-20) - 10; }
    ctx.beginPath();
    xs.forEach((x,i)=>{
      const px = 10 + x*(w-20);
      const py = yval(ys[i]);
      if (i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
    });
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#111';
    ctx.stroke();
  }, [data]);
  return <div style={{ padding:24 }}>
    <h1>Trend — Specialist Score</h1>
    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
      <input value={id} onChange={e=> setId(e.target.value)} placeholder="specialistId" />
      <select value={role} onChange={e=> setRole(e.target.value as any)}>
        <option value="COACH">COACH</option>
        <option value="NUTRITION">NUTRITION</option>
        <option value="CORRECTIVE">CORRECTIVE</option>
      </select>
      <button onClick={load}>Load</button>
    </div>
    <canvas ref={ref} width={800} height={300} style={{ border:'1px solid #eee', borderRadius:8, marginTop:12 }} />
  </div>;
}
