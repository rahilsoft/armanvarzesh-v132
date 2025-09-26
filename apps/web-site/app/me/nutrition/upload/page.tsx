
'use client';
import React, { useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'user','x-user-id':'user-1'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [photo, setPhoto] = useState('https://example.com/meal.jpg');
  const [day, setDay] = useState(0);
  const [meal, setMeal] = useState('breakfast');
  const send = async ()=>{
    const d = await gql(`mutation($u:String!,$p:String!,$d:Int!,$m:String!,$url:String!){ analyzeMealPhoto(userId:$u, planId:$p, dayIndex:$d, mealKey:$m, photoUrl:$url) }`, { u:'user-1', p:'', d: day, m: meal, url: photo });
    alert('Sent photo (demo).');
  };
  return <div style={{ padding:24 }}>
    <h1>آنالیز تصویری وعده</h1>
    <label>روز<input type="number" value={day} onChange={e=> setDay(parseInt(e.target.value||'0'))} /></label>
    <label>وعده<select value={meal} onChange={e=> setMeal(e.target.value)}><option>breakfast</option><option>lunch</option><option>dinner</option><option>snack</option></select></label>
    <label>Photo URL<input value={photo} onChange={e=> setPhoto(e.target.value)} /></label>
    <button onClick={send}>ارسال</button>
  </div>;
}
