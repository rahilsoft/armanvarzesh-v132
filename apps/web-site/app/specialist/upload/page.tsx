'use client';

import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json','x-role':'specialist'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

export default function Page(){
  const [conds, setConds] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [equipment, setEquipment] = useState('');
  const [notes, setNotes] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [voiceUrl, setVoiceUrl] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(()=>{ (async()=>{ const a = await gql(`query{ correctiveConditions{ code nameFa } }`); setConds(a.correctiveConditions||[]); })(); }, []);

  const requestUpload = async (file:File)=>{
  const meta = await gql(`mutation($folder:String!,$ct:String!){ requestUploadUrl(folder:$folder, contentType:$ct) }`, { folder:'corrective', ct: file.type||'application/octet-stream' });
  const { uploadUrl, key } = JSON.parse(meta.requestUploadUrl);
  await fetch(uploadUrl, { method:'PUT', body: file, headers:{ 'Content-Type': file.type||'application/octet-stream' } });
  return { key, url: (process.env.NEXT_PUBLIC_CDN_BASE? `${process.env.NEXT_PUBLIC_CDN_BASE}/${key}` : uploadUrl.split('?')[0]) };
};
const submit = async ()=>{
    setMsg('');
    try{
      await gql(`mutation($input:CreateCorrectiveVideoInput!){ uploadCorrectiveVideo(input:$input){ id } }`, { input:{ title, url, equipment, notes, voiceUrl, conditions: selected, uploadedBy: 'me' } });
      setMsg('ثبت شد و در انتظار تایید ادمین است ✓');
      setTitle(''); setUrl(''); setEquipment(''); setNotes(''); setSelected([]);
    }catch(e:any){ setMsg(e.message||'خطا'); }
  };

  return (
    <div style={{ padding:24 }}>
      <h1>آپلود ویدئوی اصلاحی</h1>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <label>عنوان</label>
          <input value={title} onChange={e=> setTitle(e.target.value)} />
          <label>فایل ویدئو یا لینک</label>
          <input type='file' accept='video/*' onChange={async (e)=>{ const f=e.target.files?.[0]; if (f){ const r=await requestUpload(f); setUrl(r.url); } }} />
          <input placeholder='یا لینک مستقیم' value={url} onChange={e=> setUrl(e.target.value)} />
          <label>تجهیزات (اختیاری)</label>
          <input value={equipment} onChange={e=> setEquipment(e.target.value)} />
          <label>یادداشت (اختیاری)</label>
          <textarea value={notes} onChange={e=> setNotes(e.target.value)} />
          <button onClick={submit} style={{ marginTop:8, padding:'10px 12px', borderRadius:8, background:'#111', color:'#fff' }}>ارسال برای بررسی</button>
          {msg && <div style={{ marginTop:6 }}>{msg}</div>}
        
          <label>فایل صوتی (اختیاری)</label>
          <input type='file' accept='audio/*' onChange={async (e)=>{ const f=e.target.files?.[0]; if (!f) return; const meta = await gql(`mutation($folder:String!,$ct:String!){ requestUploadUrl(folder:$folder, contentType:$ct) }`, { folder:'corrective-voice', ct: f.type||'audio/mpeg' }); const { uploadUrl, key } = JSON.parse(meta.requestUploadUrl); await fetch(uploadUrl, { method:'PUT', body: f, headers:{ 'Content-Type': f.type||'audio/mpeg' } }); const final = (process.env.NEXT_PUBLIC_CDN_BASE? `${process.env.NEXT_PUBLIC_CDN_BASE}/${key}` : uploadUrl.split('?')[0]); setVoiceUrl(final); }} />
        </div>
        <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>

          <div style={{ fontWeight:700, marginBottom:8 }}>انتخاب ناهنجاری‌ها</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {conds.map((c:any)=> <button key={c.code} onClick={()=> setSelected(selected.includes(c.code)? selected.filter(x=> x!==c.code) : [...selected, c.code])} style={{ padding:'6px 10px', borderRadius:100, border:'1px solid #eee', background: selected.includes(c.code)? '#111':'#fff', color: selected.includes(c.code)? '#fff':'#111' }}>{c.nameFa}</button>)}
          </div>
        </div>
      </div>
    </div>
  );
}
