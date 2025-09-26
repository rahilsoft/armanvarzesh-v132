import dynamic from 'next/dynamic';
'use client';

import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
  const [sex, setSex] = useState<'male'|'female'>('male');
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'specialist'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

function download(name:string, data:any){
  const blob = new Blob([JSON.stringify(data,null,2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  URL.revokeObjectURL(url);
}

const AnatomyBoard = dynamic(()=> import('../_components/AnatomyBoard'), { ssr:false });
export default function Page(){
  const [conds, setConds] = useState<any[]>([]);
  const [sel, setSel] = useState<string[]>([]);
  const [videos, setVideos] = useState<any[]>([]);
  const [days, setDays] = useState<any[]>([{ title:'روز ۱', warmup:[], main:[], cooldown:[] }]);
  useEffect(()=>{ (async()=>{ const a = await gql(`query{ correctiveConditions{ code nameFa } }`); setConds(a.correctiveConditions||[]); })(); }, []);
  const search = async ()=>{
    const res = await gql(`query($input:SearchCorrectiveInput){ searchCorrectiveVideos(input:$input){ id title url conditions } }`, { input:{ conditions: sel, approvedOnly:true } });
    setVideos(res.searchCorrectiveVideos||[]);
  };
  const addTo = (section:'warmup'|'main'|'cooldown', v:any)=>{
    const copy = days.slice(); copy[0][section] = [...copy[0][section], v]; setDays(copy);
  };
  const exportPlan = ()=>{
    const payload = { kind:'CORRECTIVE', createdAt: new Date().toISOString(), days };
    download('corrective_plan.json', payload);
  };
  
const [userId, setUserId] = useState('user-demo');
const [title, setTitle] = useState('برنامه اصلاحی');
const [startDate, setStartDate] = useState<string>(new Date().toISOString().slice(0,10));
const [spw, setSpw] = useState<number>(3);
const [status, setStatus] = useState<string>('');

async function assign(){
  setStatus('');
  try{
    const payload = { kind:'CORRECTIVE', createdAt: new Date().toISOString(), days };
    const planRes = await gql2(`mutation($t:String!,$j:String!){ createCorrectivePlan(title:$t, daysJson:$j) }`, { t: title, j: JSON.stringify(payload) });
    const planId = planRes.createCorrectivePlan;
    const a = await gql2(`mutation($pid:String!,$uid:String!,$sd:String!,$spw:Int){ assignPlanToUser(planId:$pid, userId:$uid, startDate:$sd, sessionsPerWeek:$spw) }`, { pid: planId, uid: userId, sd: startDate, spw });
    setStatus('Assigned ✓');
  }catch(e:any){ setStatus(e.message||'خطا'); }
}

return (

    <div style={{ padding:24 }}>
      <h1>سازندهٔ برنامهٔ اصلاحی</h1>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', margin:'8px 0' }}>
        {conds.map((c:any)=> <button key={c.code} onClick={()=> setSel(sel.includes(c.code)? sel.filter(x=> x!==c.code) : [...sel, c.code])} style={{ padding:'6px 10px', borderRadius:100, border:'1px solid #eee', background: sel.includes(c.code)? '#111':'#fff', color: sel.includes(c.code)? '#fff':'#111' }}>{c.nameFa}</button>)}
        <button onClick={search} style={{ padding:'6px 10px', borderRadius:8 }}>فیلتر</button>
      </div>
      <div style={{ display:'grid', gap:12, gridTemplateColumns:'320px 1fr 1fr' }}>
        <div>
          <AnatomyBoard sex={sex} onPick={(code)=> setSel((s)=> Array.from(new Set([...(s||[]), code]))) } />
        </div>
        <div>
          <div style={{ fontWeight:700, marginBottom:8 }}>ویدئوهای پیشنهادی</div>
          <div style={{ display:'grid', gap:8 }}>
            {videos.map((v:any)=> (
              <div key={v.id} style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
                <div style={{ fontWeight:700 }}>{v.title}</div>
                <video src={v.url} controls style={{ width:'100%', marginTop:8, borderRadius:8 }} />
                <div style={{ display:'flex', gap:6, marginTop:8 }}>
                  <button onClick={()=> addTo('warmup', v)}>گرم کردن</button>
                  <button onClick={()=> addTo('main', v)}>تمرین اصلی</button>
                  <button onClick={()=> addTo('cooldown', v)}>سرد کردن</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontWeight:700, marginBottom:8 }}>روز ۱ — پیش‌نویس</div>
          <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
            <div style={{ fontWeight:600 }}>گرم کردن</div>
            <ol>{days[0].warmup.map((x:any,i:number)=>(<li key={i}>{x.title}</li>))}</ol>
            <div style={{ fontWeight:600, marginTop:6 }}>تمرین اصلی</div>
            <ol>{days[0].main.map((x:any,i:number)=>(<li key={i}>{x.title}</li>))}</ol>
            <div style={{ fontWeight:600, marginTop:6 }}>سرد کردن</div>
            <ol>{days[0].cooldown.map((x:any,i:number)=>(<li key={i}>{x.title}</li>))}</ol>
            <button onClick={exportPlan} style={{ marginTop:8, padding:'6px 10px', borderRadius:8 }}>Export JSON</button>
          </div>
        </div>
      
      <div style={{ marginTop:16, border:'1px solid #eee', borderRadius:12, padding:12 }}>
        <div style={{ fontWeight:700, marginBottom:8 }}>ارسال برنامه به کاربر</div>
        <label>عنوان برنامه</label>
        <input value={title} onChange={e=> setTitle(e.target.value)} />
        <label>شناسه کاربر</label>
        <input value={userId} onChange={e=> setUserId(e.target.value)} />
        <label>تاریخ شروع</label>
        <input type="date" value={startDate} onChange={e=> setStartDate(e.target.value)} />
        <label>جلسه در هفته</label>
        <input type="number" value={spw} onChange={e=> setSpw(parseInt(e.target.value||'3'))} />
        <div style={{ display:'flex', gap:8, marginTop:8 }}>
          <button onClick={exportPlan}>Export JSON</button>
          <button onClick={assign} style={{ background:'#111', color:'#fff', padding:'6px 10px', borderRadius:8 }}>ارسال به کاربر</button>
        </div>
        {!!status && <div style={{ marginTop:6 }}>{status}</div>}
      </div>
    </div>
  );
}

import { useState } from 'react';
const URL2 = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql2(query:string, variables:any={}){
  const r = await fetch(URL2, { method:'POST', headers:{'Content-Type':'application/json','x-role':'specialist','x-user-id':'me-specialist'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
