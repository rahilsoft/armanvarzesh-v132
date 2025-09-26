
'use client';
import React, { useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'user','x-user-id':'user-demo'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [gender, setGender] = useState<'male'|'female'|'other'>('male');
  const [age, setAge] = useState<number>(28);
  const [goal, setGoal] = useState<string>('fitness');
  const [service, setService] = useState<'COACH'|'NUTRITION'|'CORRECTIVE'|'FULL'>('COACH');
  const submit = async ()=>{
    const profile = { gender, age, goal, service };
    await gql(`mutation($j:String!){ saveUserOnboarding(profileJson:$j) }`, { j: JSON.stringify(profile) });
    const s = service==='FULL'? 'COACH' : service; // first step
    window.location.href = `/match?serviceType=${s}`;
  };
  return <div style={{ padding:24, maxWidth:720, margin:'0 auto' }}>
    <h1>ثبت نام هوشمند</h1>
    <div className="card">
      <label>جنسیت</label>
      <select value={gender} onChange={e=> setGender(e.target.value as any)}>
        <option value="male">مرد</option>
        <option value="female">زن</option>
        <option value="other">سایر</option>
      </select>
      <label>سن</label>
      <input type="number" value={age} onChange={e=> setAge(parseInt(e.target.value||'18'))} />
      <label>هدف</label>
      <select value={goal} onChange={e=> setGoal(e.target.value)}>
        <option value="fitness">تناسب اندام</option>
        <option value="fatloss">کاهش چربی</option>
        <option value="health">بهبود سلامتی</option>
        <option value="corrective">حرکات اصلاحی</option>
      </select>
      <label>نوع خدمت</label>
      <select value={service} onChange={e=> setService(e.target.value as any)}>
        <option value="COACH">برنامه تمرینی</option>
        <option value="NUTRITION">برنامه غذایی</option>
        <option value="CORRECTIVE">حرکات اصلاحی</option>
        <option value="FULL">پکیج کامل</option>
      </select>
      <div style={{ marginTop:12 }}>
        <button onClick={submit} style={{ background:'#111', color:'#fff', padding:'10px 12px', borderRadius:8 }}>ادامه</button>
      </div>
    </div>
  </div>;
}
