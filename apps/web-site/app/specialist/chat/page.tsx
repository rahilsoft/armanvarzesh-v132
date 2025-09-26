
'use client';
import React, { useEffect, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'specialist'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page(){
  const [threads, setThreads] = useState<any[]>([]);
  const [sid, setSid] = useState('me-specialist');
  useEffect(()=>{ (async()=>{ const t = await gql(`query($sid:String!){ listThreads(specialistId:$sid) }`, { sid }); setThreads(JSON.parse(t.listThreads||'[]')); })(); },[]);
  return <div style={{padding:24}}><h1>گفتگوها</h1><ul>{threads.map((t:any)=> <li key={t.id}><a href={`/specialist/chat/${t.id}`}>{t.userId}</a></li>)}</ul></div>;
}
