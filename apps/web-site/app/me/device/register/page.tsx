
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'user','x-user-id':'user-1'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [platform, setPlatform] = useState('web');
  const [token, setToken] = useState('demo-token-123');
  const [rows, setRows] = useState<any[]>([]);
  const reg = async ()=>{
    await gql(`mutation($u:String!,$p:String!,$t:String!){ registerDeviceToken(userId:$u, platform:$p, token:$t) }`, { u:'user-1', p:platform, t:token });
    await load();
  };
  const load = async ()=>{
    const d = await gql(`query($u:String!){ listDeviceTokens(userId:$u) }`, { u:'user-1' });
    setRows(JSON.parse(d.listDeviceTokens||'[]'));
  };
  useEffect(()=>{ load(); }, []);
  return <div style={{ padding:24 }}>
    <h1>ثبت دستگاه برای پوش</h1>
    <div style={{ display:'grid', gridTemplateColumns:'140px 1fr 120px', gap:8, width:640 }}>
      <select value={platform} onChange={e=> setPlatform(e.target.value)}><option>web</option><option>ios</option><option>android</option></select>
      <input value={token} onChange={e=> setToken(e.target.value)} placeholder="device token" />
      <button onClick={reg}>ثبت</button>
    </div>
    <h3 style={{ marginTop:16 }}>دستگاه‌های ثبت‌شده</h3>
    <ul>{rows.map((r:any)=> <li key={r.id}>{r.platform} — {r.token} — {r.enabled? '✔' : '✖'}</li>)}</ul>
  </div>;
}
