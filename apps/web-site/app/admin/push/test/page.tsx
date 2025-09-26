
'use client';
import React, { useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'admin','x-user-id':'admin'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [userId, setUserId] = useState('user-1');
  const [title, setTitle] = useState('Hello');
  const [body, setBody] = useState('Test push');
  const [res, setRes] = useState<any>(null);
  const send = async ()=>{
    const d = await gql(`mutation($u:String!,$t:String!,$b:String!){ sendTestPush(userId:$u, title:$t, body:$b) }`, { u:userId, t:title, b:body });
    setRes(JSON.parse(d.sendTestPush||'{}'));
  };
  return <div style={{ padding:24 }}>
    <h1>ارسال پوش تست</h1>
    <div style={{ display:'grid', gridTemplateColumns:'120px 1fr', gap:8, width:600 }}>
      <label>userId<input value={userId} onChange={e=> setUserId(e.target.value)} /></label>
      <label>title<input value={title} onChange={e=> setTitle(e.target.value)} /></label>
      <label>body<input value={body} onChange={e=> setBody(e.target.value)} /></label>
    </div>
    <button onClick={send} style={{ marginTop:12 }}>ارسال</button>
    {res && <pre style={{ marginTop:12 }}>{JSON.stringify(res, null, 2)}</pre>}
  </div>;
}
