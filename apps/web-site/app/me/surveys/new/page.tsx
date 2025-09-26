
'use client';
import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'user','x-user-id':'user-demo'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const params = useSearchParams();
  const template = params.get('template')||'BIWEEKLY';
  const sid = params.get('sid')||'specialist-1';
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const submit = async ()=>{
    await gql(`mutation($tc:String!,$sid:String!,$r:Int!,$c:String){ submitSurvey(templateCode:$tc, specialistId:$sid, rating:$r, comment:$c) }`, { tc: template, sid, r: rating, c: comment });
    alert('ثبت شد'); window.history.back();
  };
  return <div style={{ padding:24, maxWidth:640, margin:'0 auto' }}>
    <h1>نظرسنجی: {template}</h1>
    <label>امتیاز (1..5)</label>
    <input type="number" value={rating} min={1} max={5} onChange={e=> setRating(parseInt(e.target.value||'5'))} />
    <label>نظر</label>
    <textarea value={comment} onChange={e=> setComment(e.target.value)} />
    <div style={{ marginTop:8 }}><button onClick={submit}>ثبت</button></div>
  </div>;
}
