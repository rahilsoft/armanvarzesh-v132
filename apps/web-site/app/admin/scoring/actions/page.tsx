
'use client';
import React from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const recompute = async ()=>{ await gql(`mutation{ recomputeAll }`); alert('Recomputed'); };
  const genInv = async ()=>{ await gql(`mutation{ generateSurveyInvites }`); alert('Invites generated'); };
  return <div style={{ padding:24 }}>
    <h1>عملیات سریع امتیازدهی/نظرسنجی</h1>
    <div style={{ display:'flex', gap:8 }}>
      <button onClick={recompute}>محاسبهٔ همهٔ امتیازها</button>
      <button onClick={genInv}>تولید دعوت‌نامه‌های دو‌هفته‌ای</button>
    </div>
  </div>;
}
