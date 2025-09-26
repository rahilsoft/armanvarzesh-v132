
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';

async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json();
  if (j.errors) throw new Error(j.errors[0]?.message||'error');
  return j.data;
}

export default function ExercisesAdmin(){
  const [list, setList] = useState<any[]>([]);
  const [sports, setSports] = useState<any[]>([]);
  const [equip, setEquip] = useState<any[]>([]);
  const [muscles, setMuscles] = useState<any[]>([]);
  const [selSports, setSelSports] = useState<string[]>([]);
  const [selEquip, setSelEquip] = useState<string[]>([]);
  const [selPrim, setSelPrim] = useState<string[]>([]);
  const [selSec, setSelSec] = useState<string[]>([]);
  const [form, setForm] = useState<any>({ title:'', videoUrl:'', description:'', level:'beginner', kind:'MAIN' });
  const [msg, setMsg] = useState('');

  const load = async ()=>{
    const d = await gql(`query{ searchExercises{ edges{ id title videoUrl thumbnailUrl durationSec level kind status viewCount likeCount } total pageInfo{ endCursor hasNextPage } } sports{ id name } equipmentCatalogs{ id name } muscles{ id code name } }`);
    setList(d.exercises.edges||[]); setSports(d.sports||[]); setEquip(d.equipmentCatalogs||[]); setMuscles(d.muscles||[]);
  };
  useEffect(()=>{ load(); }, []);

  const submit = async ()=>{
    setMsg('');
    try{
      await gql(`mutation($input:UpsertExerciseInput!){ upsertExercise(input:$input){ id } }`, { input: { ...form, sports: selSports, equipment: selEquip, primaryMuscles: selPrim, secondaryMuscles: selSec } });
      setMsg('ثبت شد ✓'); setForm({ title:'', videoUrl:'', description:'', level:'beginner', kind:'MAIN' }); load();
    }catch(e:any){ setMsg(e.message||'خطا'); }
  };

  const approve = async (id:string)=>{ await gql(`mutation($id:String!,$status:String!){ reviewExercise(id:$id,status:$status){ id } }`, { id, status:'APPROVED' }); load(); };
  const reject = async (id:string)=>{ await gql(`mutation($id:String!,$status:String!){ reviewExercise(id:$id,status:$status){ id } }`, { id, status:'REJECTED' }); load(); };

  return (
    <div style={{ padding:24, display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
      <div>
        <h2>افزودن ویدئو/حرکت</h2>
        <div style={{ display:'grid', gap:8 }}>
          <input placeholder="عنوان" value={form.title} onChange={e=> setForm({...form, title:e.target.value})} />
          <input placeholder="Video URL" value={form.videoUrl} onChange={e=> setForm({...form, videoUrl:e.target.value})} />
          <textarea placeholder="توضیح" value={form.description} onChange={e=> setForm({...form, description:e.target.value})} />
          <select value={form.level} onChange={e=> setForm({...form, level:e.target.value})}>
            <option>beginner</option><option>intermediate</option><option>advanced</option>
          </select>
          <select value={form.kind} onChange={e=> setForm({...form, kind:e.target.value})}>
            <option value="MAIN">MAIN</option>
            <option value="WARMUP">WARMUP</option>
            <option value="COOLDOWN">COOLDOWN</option>
            <option value="GENERAL">GENERAL</option>
          </select>
          
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8 }}>
          <div>
            <div style={{ fontWeight:600, margin:'8px 0' }}>رشته‌ها</div>
            {sports.map((s:any)=> <label key={s.id} style={{ display:'block' }}><input type='checkbox' checked={selSports.includes(s.id)} onChange={(e)=> setSelSports(e.target.checked ? [...selSports, s.id] : selSports.filter(x=> x!==s.id))} /> {s.name}</label>)}
          </div>
          <div>
            <div style={{ fontWeight:600, margin:'8px 0' }}>تجهیزات</div>
            {equip.map((e:any)=> <label key={e.id} style={{ display:'block' }}><input type='checkbox' checked={selEquip.includes(e.id)} onChange={(ev)=> setSelEquip(ev.target.checked ? [...selEquip, e.id] : selEquip.filter(x=> x!==e.id))} /> {e.name}</label>)}
          </div>
          <div>
            <div style={{ fontWeight:600, margin:'8px 0' }}>عضلات اصلی</div>
            {muscles.map((m:any)=> <label key={m.id} style={{ display:'block' }}><input type='checkbox' checked={selPrim.includes(m.id)} onChange={(ev)=> setSelPrim(ev.target.checked ? [...selPrim, m.id] : selPrim.filter(x=> x!==m.id))} /> {m.code} — {m.name}</label>)}
            <div style={{ fontWeight:600, margin:'8px 0' }}>عضلات فرعی</div>
            {muscles.map((m:any)=> <label key={m.id} style={{ display:'block' }}><input type='checkbox' checked={selSec.includes(m.id)} onChange={(ev)=> setSelSec(ev.target.checked ? [...selSec, m.id] : selSec.filter(x=> x!==m.id))} /> {m.code} — {m.name}</label>)}
          </div>
        </div>

          <button onClick={submit}>ثبت و ارسال برای بررسی</button>
          {!!msg && <div style={{ color: msg.includes('✓') ? '#1f8f4f' : 'crimson' }}>{msg}</div>}
        </div>
      </div>
      <div>
        <h2>صف تأیید ویدئوها</h2>
        <div style={{ display:'grid', gap:8 }}>
          {list.map(it=> (
            <div key={it.id} style={{ border:'1px solid #eee', borderRadius:10, padding:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}><strong contentEditable suppressContentEditableWarning onBlur={async(e)=>{ const v = (e.target as any).innerText; if (v && v!==it.title){ await gql(`mutation($input:UpsertExerciseInput!){ upsertExercise(input:$input){ id } }`, { input: { id: it.id, title: v, videoUrl: it.videoUrl } }); load(); } }}>{it.title}</strong><span>{it.status} • 👁 {it.viewCount||0} • ❤ {it.likeCount||0}</span>
            <div style={{ display:'flex', gap:6 }}>
              <button onClick={()=> approve(it.id, 'APPROVED')}>تایید</button>
              <button onClick={()=> approve(it.id, 'REJECTED')}>رد</button>
            </div></div>
              <div style={{ fontSize:12, opacity:.8 }}>{it.level} • {it.kind}</div>
              <video src={it.videoUrl} controls style={{ width:'100%', borderRadius:8, marginTop:6 }} />
          <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:6 }}>
            {it.thumbnailUrl ? <img src={it.thumbnailUrl} style={{ width:120, height:68, objectFit:'cover', borderRadius:8 }} /> : <button onClick={async ()=>{ await gql(`mutation($id:String!){ processExerciseMedia(id:$id){ id } }`, { id: it.id }); load(); }}>تولید Thumbnail</button>}
            {!!it.durationSec && <span style={{ fontSize:12, opacity:.7 }}>⏱ {Math.floor(it.durationSec/60)}:{String(it.durationSec%60).padStart(2,'0')}</span>}
          </div>

              <div style={{ display:'flex', gap:8, marginTop:8 }}>
                <button onClick={()=> approve(it.id)}>تأیید</button>
                <button onClick={()=> reject(it.id)} style={{ color:'crimson' }}>رد</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
