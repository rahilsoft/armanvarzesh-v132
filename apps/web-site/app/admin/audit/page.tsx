
'use client';
import React, { useEffect, useMemo, useState } from 'react';

const CONTENT_SERVICE_URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';

type Audit = {
  id: string; tileId: string; page?: string; variant?: string;
  action: string; actorId?: string; fromState?: string; toState?: string;
  snapshot?: string; createdAt: string;
};

function jsonDiff(a: any, b: any, path: string[] = []): { path:string; from:any; to:any }[] {
  const diffs: any[] = [];
  const keys = new Set<string>([...Object.keys(a||{}), ...Object.keys(b||{})]);
  keys.forEach(k=>{
    const pa = [...path, k];
    if (typeof (a||{})[k] === 'object' && a?.[k] && typeof (b||{})[k] === 'object' && b?.[k]){
      diffs.push(...jsonDiff(a[k], b[k], pa));
    } else {
      if (JSON.stringify((a||{})[k]) !== JSON.stringify((b||{})[k])){
        diffs.push({ path: pa.join('.'), from: (a||{})[k], to: (b||{})[k] });
      }
    }
  });
  return diffs;
}

export default function AuditPage(){
  const [logs, setLogs] = useState<Audit[]>([]);
  const [error, setError] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);

  async function load(){
    try{
      const q = `query A($limit:Int){ auditLogs(limit:$limit){ id tileId page variant action actorId fromState toState snapshot createdAt } }`;
      const res = await fetch(CONTENT_SERVICE_URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query: q, variables: { limit: 100 } }) });
      const j = await res.json();
      setLogs(j?.data?.auditLogs || []);
    }catch(e:any){ setError(e?.message || 'load_error'); }
  }
  useEffect(()=>{ load(); }, []);

  const selectedDiff = useMemo(()=>{
    if (selected.length !== 2) return null;
    const s = logs.find(l=> l.id === selected[0]);
    const t = logs.find(l=> l.id === selected[1]);
    if (!s || !t) return null;
    let a:any = {}; let b:any = {};
    try{ a = s.snapshot ? JSON.parse(s.snapshot) : {}; }catch{}
    try{ b = t.snapshot ? JSON.parse(t.snapshot) : {}; }catch{}
    return jsonDiff(a,b);
  }, [selected, logs]);

  return (
    <div style={{padding:'24px'}}>
      <h1>لاگ انتشار و تغییرات</h1>
      {error && <p style={{color:'crimson'}}>{error}</p>}
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div>
          <h3>رخدادها</h3>
          <table style={{width:'100%', borderCollapse:'collapse'}}>
            <thead><tr><th></th><th>زمان</th><th>اکشن</th><th>صفحه</th><th>Tile</th><th>Variant</th><th>By</th></tr></thead>
            <tbody>
              {logs.map(l=> (
                <tr key={l.id} style={{borderBottom:'1px solid #eee'}}>
                  <td><input type="checkbox" checked={selected.includes(l.id)} onChange={(e)=>{
                    const val = e.target.checked;
                    setSelected(prev=>{
                      let out = prev.filter(x=>x!==l.id);
                      if (val) out = [...out.slice(-1), l.id]; // keep max 2
                      return out;
                    });
                  }} /></td>
                  <td>{new Date(l.createdAt).toLocaleString()}</td>
                  <td>{l.action}</td>
                  <td>{l.page}</td>
                  <td style={{fontFamily:'monospace'}}>{l.tileId.slice(0,8)}…</td>
                  <td>{l.variant||''}</td>
                  <td>{l.actorId||''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <h3>Diff (۲ مورد را تیک بزن)</h3>
          {!selectedDiff && <p style={{opacity:.6}}>برای مقایسه، دو رخداد را انتخاب کن.</p>}
          {selectedDiff && (
            <div style={{maxHeight:'60vh', overflow:'auto', border:'1px solid #eee', borderRadius:8, padding:12}}>
              {selectedDiff.map((d,i)=> (
                <div key={i} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, borderBottom:'1px dashed #eee', padding:'6px 0'}}>
                  <div style={{opacity:.7}}>{d.path}</div>
                  <pre style={{margin:0, whiteSpace:'pre-wrap', background:'#fafafa', padding:6, borderRadius:6}}>{JSON.stringify(d.from, null, 0)}</pre>
                  <pre style={{margin:0, whiteSpace:'pre-wrap', background:'#f3fbff', padding:6, borderRadius:6}}>{JSON.stringify(d.to, null, 0)}</pre>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
