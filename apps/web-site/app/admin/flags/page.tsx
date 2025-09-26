
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';

export default function FlagsAdmin(){
  const [flags, setFlags] = useState<{key:string; value:boolean}[]>([]);
  const [status, setStatus] = useState<string>('');
  async function load(){
    const q = `query{ featureFlags{ key value } }`;
    const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query: q }) });
    const j = await r.json();
    setFlags(j?.data?.featureFlags || []);
  }
  async function setFlag(key:string, value:boolean){
    const m = `mutation M($key:String!,$value:Boolean!){ setFeatureFlag(key:$key, value:$value) }`;
    const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json', ...(localStorage.getItem('idToken')? {'Authorization': 'Bearer '+localStorage.getItem('idToken')!}:{})}, body: JSON.stringify({ query:m, variables: { key, value } }) });
    const j = await r.json();
    if (j.errors){ setStatus('خطا در ذخیره'); } else { setStatus('ذخیره شد'); load(); }
  }
  useEffect(()=>{ load(); }, []);
  return (
    <div style={{padding:24}}>
      <h1>Feature Flags</h1>
      {status && <p style={{opacity:.7}}>{status}</p>}
      <table style={{width:'100%', maxWidth:720}}>
        <thead><tr><th>نام</th><th>وضعیت</th></tr></thead>
        <tbody>
          {flags.map(f=> (
            <tr key={f.key} style={{borderBottom:'1px solid #eee'}}>
              <td style={{padding:'8px 4px'}}>{f.key}</td>
              <td style={{padding:'8px 4px'}}>
                <label><input type="checkbox" checked={!!f.value} onChange={e=> setFlag(f.key, e.target.checked)} /> فعال</label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{opacity:.7, marginTop:12}}>فلگ‌های متداول: <code>hero_enabled</code>، <code>narrative_enabled</code>، <code>scroll_video_enabled</code></p>
    </div>
  );
}
