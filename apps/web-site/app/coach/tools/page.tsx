
'use client';
import React, { useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function CoachTools(){
  const [planId, setPlanId] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [issues, setIssues] = useState<any[]>([]);
  const [sim, setSim] = useState<any>(null);

  return (
    <div style={{ padding:24, display:'grid', gap:12 }}>
      <h1>Coach Tools — Validation & Simulation</h1>
      <div style={{ display:'flex', gap:8 }}>
        <input placeholder='planId' value={planId} onChange={e=> setPlanId(e.target.value)} />
        <button onClick={async()=>{ const d = await gql(`query($id:String!){ validatePlan(planId:$id){ level message blockId } }`, { id: planId }); setIssues(d.validatePlan||[]); }}>Validate</button>
      </div>
      {issues.length>0 && <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
        <strong>Issues</strong>
        <ul>{issues.map((it,i)=> <li key={i}>{it.level} — {it.message} {it.blockId? `(${it.blockId})`:''}</li>)}</ul>
      </div>}
      <div style={{ display:'flex', gap:8 }}>
        <input placeholder='sessionId' value={sessionId} onChange={e=> setSessionId(e.target.value)} />
        <button onClick={async()=>{ const d = await gql(`query($id:String!){ simulateSession(sessionId:$id){ totalSeconds blocks{ blockId seconds rounds } } }`, { id: sessionId }); setSim(d.simulateSession||null); }}>Simulate</button>
      </div>
      {sim && <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
        <div>مجموع زمان برآوردی: <strong>{Math.round(sim.totalSeconds/60)} دقیقه</strong></div>
        <ul>{sim.blocks.map((b:any)=> <li key={b.blockId}>بلوک {b.blockId.slice(0,6)}… — {Math.round(b.seconds/60)} دقیقه{typeof b.rounds==='number'? ` • rounds=${b.rounds}`:''}</li>)}</ul>
      </div>}
    </div>
  );
}
