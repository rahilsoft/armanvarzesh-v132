
'use client';
import React, { useEffect, useRef, useState } from 'react';
const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'specialist','x-user-id':'me-specialist'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}
export default function Page({ params }:{ params:{ threadId:string }}){
  const { threadId } = params;
  const [msgs, setMsgs] = useState<any[]>([]);
  const [body, setBody] = useState('');
  const last = useRef<string|undefined>(undefined);

  const load = async ()=>{
    const res = await gql(`query($id:String!,$after:String){ messages(threadId:$id, after:$after) }`, { id: threadId, after: last.current });
    const arr = JSON.parse(res.messages||'[]');
    if (arr.length){ last.current = arr[arr.length-1].createdAt; setMsgs((m)=> [...m, ...arr]); }
  };
  useEffect(()=>{ load(); const t = setInterval(load, 15000); const base = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000/ws'; const ws = new WebSocket(base); ws.addEventListener('open', ()=> ws.send(JSON.stringify({ type:'subscribe', threadId }))); ws.addEventListener('message', (ev)=>{ try{ const m = JSON.parse(ev.data||'{}'); if (m.type==='message' && m.threadId===threadId){ setMsgs((arr)=> [...arr, m.payload]); last.current = m.payload.createdAt; } }catch(e){} }); return ()=> { clearInterval(t); try{ ws.close(); }catch(e){} }; },[]);

  const send = async ()=>{
    if (!body.trim()) return;
    await gql(`mutation($id:String!,$b:String){ sendMessage(threadId:$id, body:$b) }`, { id: threadId, b: body.trim() });
    setBody(''); await load();
  };

  return (
    <div style={{ padding:24 }}>
      <h1>چت</h1>
      <div style={{ border:'1px solid #eee', borderRadius:12, padding:12, minHeight:300 }}>
        {msgs.map((m:any)=> <div key={m.id} style={{ margin:'6px 0', textAlign: m.senderRole==='specialist'?'right':'left' }}><div style={{ display:'inline-block', background:'#f2f2f2', padding:'6px 8px', borderRadius:8 }}>{m.body||'—'}</div></div>)}
      </div>
      <div style={{ display:'flex', gap:8, marginTop:8 }}>
        <input value={body} onChange={e=> setBody(e.target.value)} placeholder="پیام..." style={{ flex:1 }} />
        <button onClick={send}>ارسال</button>
      </div>
    </div>
  );
}
