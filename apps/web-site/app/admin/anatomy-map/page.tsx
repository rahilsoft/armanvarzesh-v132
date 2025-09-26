
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function AnatomyMapAdmin(){
  const [gender, setGender] = useState<'male'|'female'>('male');
  const [modelUrl, setModelUrl] = useState('');
  const [meshMap, setMeshMap] = useState<Record<string,string>>({});
  const [msg, setMsg] = useState('');

  const load = async ()=>{
    try{
      const d = await gql(`query($g:String!){ anatomyConfig(gender:$g){ id gender modelUrl active meshMap } }`, { g: gender });
      if (d.anatomyConfig){ setModelUrl(d.anatomyConfig.modelUrl); setMeshMap(JSON.parse(d.anatomyConfig.meshMap||'{}')); }
      else { setModelUrl(''); setMeshMap({}); }
    }catch(e:any){ setMsg(e.message||'خطا'); }
  };
  useEffect(()=>{ load(); }, [gender]);

  const save = async ()=>{
    setMsg('');
    try{
      await gql(`mutation($input:UpsertAnatomyInput!){ upsertAnatomyConfig(input:$input){ id } }`, { input: { gender, modelUrl, meshMap: JSON.stringify(meshMap), active: true } });
      setMsg('ذخیره شد ✓');
    }catch(e:any){ setMsg(e.message||'خطا'); }
  };

  const addPair = ()=>{
    const mesh = prompt('نام Mesh در GLB (مثلاً glutes_L)'); if (!mesh) return;
    const code = prompt('کد عضله (مثلاً glutes)'); if (!code) return;
    setMeshMap(prev=> ({ ...prev, [mesh]: code }));
  };

  return (
    <div style={{ padding:24, display:'grid', gridTemplateColumns:'320px 1fr', gap:16 }}>
      <div>
        <h2>تنظیمات آناتومی ۳بعدی</h2>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={()=> setGender('male')} style={{ padding:'6px 12px', borderRadius:100, background: gender==='male'?'#111':'#f2f2f2', color: gender==='male'?'#fff':'#111' }}>مرد</button>
          <button onClick={()=> setGender('female')} style={{ padding:'6px 12px', borderRadius:100, background: gender==='female'?'#111':'#f2f2f2', color: gender==='female'?'#fff':'#111' }}>زن</button>
        </div>
        <div style={{ height:8 }} />
        <label>Model URL</label>
        <input value={modelUrl} onChange={e=> setModelUrl(e.target.value)} placeholder="/assets/anatomy_male.glb" />
        <div style={{ height:8 }} />
        <button onClick={addPair}>+ افزودن نگاشت Mesh→Muscle</button>
        <div style={{ height:8 }} />
        <div style={{ maxHeight:300, overflow:'auto', border:'1px solid #eee', borderRadius:10 }}>
          <table style={{ width:'100%', fontSize:13 }}>
            <thead><tr><th style={{ textAlign:'left' }}>Mesh</th><th style={{ textAlign:'left' }}>Muscle Code</th><th></th></tr></thead>
            <tbody>
              {Object.keys(meshMap).map(k=> (
                <tr key={k}><td>{k}</td><td>{meshMap[k]}</td><td><button onClick={()=>{ const m={...meshMap}; delete m[k]; setMeshMap(m); }}>حذف</button></td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ height:8 }} />
        <button onClick={save}>ذخیره</button>
        {!!msg && <div style={{ marginTop:6, color: msg.includes('✓') ? '#1f8f4f' : 'crimson' }}>{msg}</div>}
      </div>
      <div>
        <p>راهنما: نام Meshها باید دقیقاً همان چیزی باشد که در GLB استفاده شده است (case-sensitive). کد عضله باید با تاکسونومی عضلات (مثل <code>glutes</code>, <code>lats</code>) هم‌راستا باشد.</p>
      </div>
    </div>
  );
}
