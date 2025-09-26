
'use client';
import React, { useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'user','x-user-id':'user-demo'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page({ params }:{ params:{ taskId:string }}){
  const { taskId } = params;
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const submit = async ()=>{ await gql(`mutation($id:String!,$r:Int!,$c:String){ submitSurveyTask(taskId:$id, rating:$r, comment:$c) }`, { id: taskId, r: rating, c: comment||null }); window.location.href='/me/surveys'; };
  return <div style={{ padding:24, maxWidth:640 }}>
    <h1>پاسخ به نظرسنجی</h1>
    <label>امتیاز (۱ تا ۵)</label>
    <input type="number" min={1} max={5} value={rating} onChange={e=> setRating(parseInt(e.target.value||'5'))} />
    <label>نظر</label>
    <textarea value={comment} onChange={e=> setComment(e.target.value)} />
    <div style={{ marginTop:12 }}>
      <button onClick={submit} style={{ background:'#111', color:'#fff', padding:'8px 12px', borderRadius:8 }}>ارسال</button>
    </div>
  </div>;
}
