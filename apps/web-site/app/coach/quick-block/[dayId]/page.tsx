
'use client';
import React, { useEffect, useMemo, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function QuickBlock({ params }:{ params:{ dayId:string } }){
  const dayId = params.dayId;
  const [q, setQ] = useState('');
  const [muscle, setMuscle] = useState('');
  const [list, setList] = useState<any[]>([]);
  const [sel, setSel] = useState<Record<string, boolean>>({});
  const [type, setType] = useState<'SINGLE'|'SUPERSET'|'TRISET'|'CIRCUIT'>('SINGLE');
  const [section, setSection] = useState<'WARMUP'|'MAIN'|'COOLDOWN'>('MAIN');
  const [rounds, setRounds] = useState<number>(3);
  const [restBetween, setRestBetween] = useState<number>(20);
  const [protocol, setProtocol] = useState<string>('');
  const [paramsJSON, setParamsJSON] = useState<string>('{}');
  const [msg, setMsg] = useState('');

  const load = async ()=>{
    const vars:any = { input:{ q } };
    if (muscle.trim()) vars.input.muscles = [muscle.trim()];
    const data = await gql(`query($input:SearchExerciseInput!){ searchExercises(input:$input){ id title durationSec primaryMuscles } }`, vars);
    setList(data.searchExercises||[]);
  };
  useEffect(()=>{ load(); }, []);

  const toggle = (id:string)=> setSel(prev=> ({ ...prev, [id]: !prev[id] }));
  const selectedIds = useMemo(()=> Object.keys(sel).filter(k=> sel[k]), [sel]);

  const create = async ()=>{
    if (selectedIds.length===0){ setMsg('حداقل یک حرکت انتخاب کنید'); return; }
    setMsg('');
    try{
      const res = await gql(`mutation($input:ComplexBlockInput!){ createComplexBlock(input:$input) }`, { input: { dayId, section, type, exerciseIds: selectedIds, rounds: rounds||null, restBetweenItemsSec: restBetween||null, protocol: protocol||null, params: paramsJSON||null } });
      setMsg('بلوک ساخته شد ✓');
      setSel({});
    }catch(e:any){ setMsg(e.message||'خطا'); }
  };

  return (
    <div style={{ padding:24, display:'grid', gap:12 }}>
      <h1>ساخت سریع بلوک تمرین</h1>
      <div style={{ display:'grid', gap:8, gridTemplateColumns:'2fr 1fr' }}>
        <div>
          <div style={{ display:'flex', gap:8 }}>
            <input placeholder='جستجوی عنوان…' value={q} onChange={e=> setQ(e.target.value)} />
            <input placeholder='کُد عضله (مثلاً lat)' value={muscle} onChange={e=> setMuscle(e.target.value)} />
            <button onClick={load}>جستجو</button>
          </div>
          <div style={{ marginTop:8, display:'grid', gap:8 }}>
            {list.map((it:any)=> (
              <label key={it.id} style={{ display:'flex', gap:8, alignItems:'center', border:'1px solid #eee', borderRadius:10, padding:8 }}>
                <input type='checkbox' checked={!!sel[it.id]} onChange={()=> toggle(it.id)} />
                <div>
                  <div style={{ fontWeight:700 }}>{it.title}</div>
                  <div style={{ opacity:.6, fontSize:12 }}>{(it.primaryMuscles||[]).join(', ')}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
        <div>
          <div>بخش (Section):</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {(['WARMUP','MAIN','COOLDOWN'] as const).map(s=> <button key={s} onClick={()=> setSection(s)} style={{ padding:'6px 10px', borderRadius:100, background: section===s? '#111':'#f2f2f2', color: section===s? '#fff':'#111' }}>{s}</button>)}
          </div>
          <div style={{ height:8 }} />
          <div>نوع بلوک:</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {(['SINGLE','SUPERSET','TRISET','CIRCUIT'] as const).map(t=> <button key={t} onClick={()=> setType(t)} style={{ padding:'6px 10px', borderRadius:100, background: type===t? '#111':'#f2f2f2', color: type===t? '#fff':'#111' }}>{t}</button>)}
          </div>
          {(type!=='SINGLE') && (
            <div style={{ display:'grid', gap:6, marginTop:8 }}>
              <label>rounds</label>
              <input type='number' value={rounds} onChange={e=> setRounds(parseInt(e.target.value||'0'))} />
              <label>restBetweenItemsSec</label>
              <input type='number' value={restBetween} onChange={e=> setRestBetween(parseInt(e.target.value||'0'))} />
            </div>
          )}
          <div style={{ display:'grid', gap:6, marginTop:8 }}>
            <label>protocol (اختیاری: 5x5, GVT, EMOM, HIIT)</label>
            <input value={protocol} onChange={e=> setProtocol(e.target.value)} />
            <label>params (JSON)</label>
            <textarea value={paramsJSON} onChange={e=> setParamsJSON(e.target.value)} placeholder='مثلاً {"minutes":20} یا {"work":20,"rest":10}' />
          </div>
          <div style={{ height:8 }} />
          <button onClick={create} style={{ padding:'10px 12px', borderRadius:10, background:'#111', color:'#fff' }}>ساخت بلوک از موارد انتخاب‌شده</button>
          {!!msg && <div style={{ marginTop:8, color: msg.includes('✓')? '#1f8f4f':'crimson' }}>{msg}</div>}
        </div>
      </div>
    </div>
  );
}
