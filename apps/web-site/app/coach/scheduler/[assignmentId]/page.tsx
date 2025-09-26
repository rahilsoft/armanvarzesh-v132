
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function Scheduler({ params }:{ params:{ assignmentId:string } }){
  const assignmentId = params.assignmentId;
  const [start, setStart] = useState<string>(()=> new Date().toISOString().slice(0,10));
  const [spw, setSpw] = useState(3);
  const [rest, setRest] = useState<number[]>([5]); // جمعه
  const [msg, setMsg] = useState('');

  const toggleRest = (d:number)=> setRest(prev => prev.includes(d)? prev.filter(x=> x!==d) : [...prev, d]);

  const submit = async ()=>{
    setMsg('');
    try{
      await gql(`mutation($a:String!,$s:String!,$n:Int!,$r:String){ generatePlanSchedule(assignmentId:$a, startDate:$s, sessionsPerWeek:$n, restDays:$r) }`, { a: assignmentId, s: start, n: spw, r: JSON.stringify(rest) });
      setMsg('برنامهٔ یک‌ماهه تولید شد ✓');
    }catch(e:any){ setMsg(e.message||'خطا'); }
  };

  return (
    <div style={{ padding:24 }}>
      <h1>زمان‌بندی یک‌ماهه</h1>
      <div style={{ display:'grid', gap:12, maxWidth:480 }}>
        <label>تاریخ شروع</label>
        <input type="date" value={start} onChange={e=> setStart(e.target.value)} />
        <label>جلسه در هفته</label>
        <input type="number" value={spw} onChange={e=> setSpw(parseInt(e.target.value||'3'))} min={1} max={7} />
        <label>روزهای استراحت</label>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['ی', 'د', 'س', 'چ', 'پ', 'ج', 'ش'].map((n,i)=> (
            <button key={i} onClick={()=> toggleRest(i)} style={{ padding:'6px 10px', borderRadius:100, background: rest.includes(i)? '#111':'#f2f2f2', color: rest.includes(i)? '#fff':'#111' }}>{n}</button>
          ))}
        </div>
        <button onClick={submit} style={{ padding:'10px 12px', borderRadius:10, background:'#111', color:'#fff' }}>تولید جلسات</button>
        {!!msg && <div style={{ color: msg.includes('✓')? '#1f8f4f':'crimson' }}>{msg}</div>}
      </div>
    </div>
  );
}
