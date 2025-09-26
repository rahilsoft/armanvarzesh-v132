
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';
const UPLOAD_KIND = 'audio';
async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json(); if (j.errors) throw new Error(j.errors[0]?.message||'error'); return j.data;
}

function Timer({ type, params }:{ type:'EMOM'|'HIIT'|'CIRCUIT', params:any }){
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const total = type==='EMOM' ? (params.minutes||20)*60 : ((params.rounds||8)*((params.work||20)+(params.rest||10)));
  useEffect(()=>{
    if (!running) return;
    const t = setInterval(()=> setElapsed(e=> e+1), 1000);
    return ()=> clearInterval(t);
  }, [running]);
  const mmss = (s:number)=> `${Math.floor(s/60)}`.padStart(2,'0') + ':' + `${s%60}`.padStart(2,'0');
  return (
    <div style={{ border:'1px solid #eee', borderRadius:8, padding:8, margin:'8px 0' }}>
      <div style={{ fontWeight:600 }}>{type} Timer</div>
      <div style={{ fontSize:24 }}>{mmss(elapsed)} / {mmss(total)}</div>
      <button onClick={()=> setRunning(r=> !r)}>{running? 'توقف':'شروع'}</button>
      <button onClick={()=> { setRunning(false); setElapsed(0); }} style={{ marginInlineStart:8 }}>ریست</button>
    </div>
  );
}


function beep(freq=880, dur=200){
  try{
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator(); const g = ctx.createGain();
    osc.type = 'sine'; osc.frequency.value = freq; osc.connect(g); g.connect(ctx.destination);
    osc.start(); g.gain.setValueAtTime(0.001, ctx.currentTime); g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime+0.01); g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur/1000);
    setTimeout(()=>{ osc.stop(); ctx.close(); }, dur+50);
  }catch(e){}
}

function BlockRunner({ block }:{ block:any }){
  const [running, setRunning] = React.useState(false);
  const [round, setRound] = React.useState(1);
  const [index, setIndex] = React.useState(0); // index within sequence
  const [seconds, setSeconds] = React.useState(0);

  // Build a flat timeline of segments to execute (work/rest)
  const plan = React.useMemo(()=>{
    const t = (block.type||'SINGLE').toUpperCase();
    const items = (block.items||[]).slice().sort((a:any,b:any)=> a.order-b.order);
    const rounds = block.rounds || 1;
    const segments:any[] = [];
    if (block.protocol==='EMOM') return { type:'EMOM', minutes: block.protocolParams?.minutes||20, segments:[] }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
    if (block.protocol==='HIIT') return { type:'HIIT', rounds: block.protocolParams?.rounds||8, work: block.protocolParams?.work||20, rest: block.protocolParams?.rest||10, segments:[] }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
    for (let r=0;r<rounds;r++){
      if (t==='SINGLE'){
        for (const it of items){
          for (const st of (it.sets||[]).sort((a:any,b:any)=> a.order-b.order)){
            segments.push({ kind:'work', label:`${it.note||'Set'} • #${st.order+1}`, secs: Math.max(10, (st.reps||10)*3) });
            segments.push({ kind:'rest', label:`Rest`, secs: st.rest||60 });
          }
        }
      } else { // SUPERSET/TRISET/CIRCUIT
        for (const it of items){
          const st = (it.sets||[])[0] || { reps:10, rest:30 }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
          segments.push({ kind:'work', label:`${it.note||'Item'}`, secs: Math.max(10, (st.reps||10)*3) });
          const rb = block.restBetweenItemsSec || 20;
          segments.push({ kind:'rest', label:`Transition`, secs: rb });
        }
      }
    }
    return { type:'SETS', segments }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
  }, [block]);

  React.useEffect(()=>{
    if (!running) return;
    const t = setInterval(()=> setSeconds(s=> s+1), 1000);
    return ()=> clearInterval(t);
  }, [running]);

  React.useEffect(()=>{
    if (!running) return;
    if (plan.type==='EMOM'){
      const total = (block.protocolParams?.minutes||20)*60;
      if (seconds===0) beep(880, 180);
      if (seconds>0 && seconds % (block.protocolParams?.every||60) === 0){ beep(660, 120); setRound(r=> r+1); }
      if (seconds>=total){ setRunning(false); beep(440, 300); }
      return;
    }
    if (plan.type==='HIIT'){
      const cyc = (block.protocolParams?.work||20) + (block.protocolParams?.rest||10);
      if (seconds===0) beep(880, 180);
      if (seconds % cyc === 0 && seconds>0){ beep(660, 120); setRound(r=> r+1); }
      return;
    }
    const seg = plan.segments[index];
    if (!seg){ setRunning(false); beep(440, 300); return; }
    if (seconds===0) beep(880, 180);
    if (seconds >= seg.secs){ setIndex(i=> i+1); setSeconds(0); beep(seg.kind==='work'? 660: 520, 120); }
  }, [seconds, running]);

  const start = ()=>{ setRunning(true); setSeconds(0); setIndex(0); setRound(1); }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
  const stop = ()=> setRunning(false);
  const mmss = (s:number)=> `${Math.floor(s/60)}`.padStart(2,'0') + ':' + `${s%60}`.padStart(2,'0');

  return (
    <div style={{ border:'1px dashed #ddd', borderRadius:8, padding:8, margin:'8px 0' }}>
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        <strong>Block Runner</strong>
        <div style={{ display:'flex', gap:8 }}>
          {!running ? <button onClick={start}>Start</button> : <button onClick={stop}>Stop</button>}
        </div>
      </div>
      <div style={{ opacity:.7, marginTop:4 }}>Round {round}</div>
      {plan.type==='SETS' ? (
        <div style={{ marginTop:4 }}>
          <div>Segment {index+1}/{plan.segments.length} — {plan.segments[index]?.label||'—'}</div>
          <div style={{ fontSize:24, fontVariant:'tabular-nums' }}>{mmss(seconds)} / {mmss(plan.segments[index]?.secs||0)}</div>
        </div>
      ) : plan.type==='EMOM' ? (
        <div style={{ marginTop:4 }}>
          <div>EMOM — دقیقه {Math.floor(seconds/60)+1}</div>
          <div style={{ fontSize:24, fontVariant:'tabular-nums' }}>{mmss(seconds)} / {mmss((block.protocolParams?.minutes||20)*60)}</div>
        </div>
      ) : (
        <div style={{ marginTop:4 }}>
          <div>HIIT — Round {round}</div>
          <div style={{ fontSize:24, fontVariant:'tabular-nums' }}>{mmss(seconds)}</div>
        </div>
      )}
    </div>
  );
}


  async function listNotes(id:string){
    const d = await gql(`query($id:String!){ sessionNotes(sessionId:$id){ id role text audioUrl createdAt } }`, { id });
    return d.sessionNotes||[];
  }
  async function reqUpload(ext:string){
    const d = await gql(`mutation($k:String!,$e:String!){ requestUploadUrl(kind:$k, ext:$e){ url } }`, { k: UPLOAD_KIND, e: ext });
    return JSON.parse(d.requestUploadUrl.url);
  }
  async function saveNote(sessionId:string, payload:any){
    const d = await gql(`mutation($in:UpsertSessionNoteInput!){ upsertSessionNote(input:$in){ id } }`, { in: { sessionId, ...payload } });
    return d.upsertSessionNote?.id;
  }


function NotesPanel({ sessionId }:{ sessionId:string }){
  const [list, setList] = React.useState<any[]>([]);
  const [text, setText] = React.useState('');
  const [rec, setRec] = React.useState<MediaRecorder|null>(null);
  const [recUrl, setRecUrl] = React.useState<string>('');
  const [busy, setBusy] = React.useState(false);

  const load = async ()=>{ setList(await listNotes(sessionId)); }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
  React.useEffect(()=>{ load(); }, [sessionId]);

  const startRec = async ()=>{
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ audio:true });
      const mr = new MediaRecorder(stream);
      const chunks:BlobPart[] = [];
      mr.ondataavailable = (e)=> chunks.push(e.data);
      mr.onstop = async()=>{
        const blob = new Blob(chunks, { type:'audio/webm' });
        setRecUrl(URL.createObjectURL(blob));
        // upload
        setBusy(true);
        try{
          const up = await reqUpload('webm');
          await fetch(up.uploadUrl, { method:'PUT', body: blob, headers: { 'Content-Type': 'audio/webm' } });
          await saveNote(sessionId, { audioUrl: up.fileUrl, role:'USER' });
          await load();
        }finally{ setBusy(false); }
      }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
      mr.start();
      setRec(mr);
    }catch(e){ alert('Microphone access failed'); }
  }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
  const stopRec = ()=>{ try{ rec?.stop(); }catch(e){} setRec(null); }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };

  const submitText = async ()=>{
    if (!text.trim()) return;
    setBusy(true);
    try{ await saveNote(sessionId, { text, role:'USER' }); setText(''); await load(); } finally { setBusy(false); }
  }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };

  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
      <div style={{ fontWeight:700, marginBottom:8 }}>یادداشت‌های جلسه</div>
      <div style={{ display:'grid', gap:8 }}>
        <textarea placeholder="یادداشت متنی…" value={text} onChange={e=> setText(e.target.value)} style={{ minHeight:70 }} />
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={submitText} disabled={busy || !text.trim()}>ثبت متن</button>
          {!rec ? <button onClick={startRec}>شروع ضبط صوت</button> : <button onClick={stopRec}>پایان ضبط</button>}
        </div>
        {busy && <div style={{ opacity:.7 }}>در حال ذخیره…</div>}
        <div style={{ height:8 }} />
        <div style={{ display:'grid', gap:8, maxHeight:240, overflow:'auto' }}>
          {list.map((n:any)=> (
            <div key={n.id} style={{ padding:8, border:'1px solid #f0f0f0', borderRadius:8, background:'#fafafa' }}>
              <div style={{ fontSize:12, opacity:.7 }}>{new Date(n.createdAt).toLocaleString()} • {n.role}</div>
              {n.text && <div style={{ marginTop:4 }}>{n.text}</div>}
              {n.audioUrl && <audio controls src={n.audioUrl} style={{ marginTop:6, width:'100%' }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


const QKEY = (sid:string)=> `pendingLogs:${sid}`;
function qLoad(sid:string){ try{ return JSON.parse(localStorage.getItem(QKEY(sid))||'[]'); }catch{ return []; } }
function qSave(sid:string, arr:any[]){ localStorage.setItem(QKEY(sid), JSON.stringify(arr)); }
async function qFlush(sessionId:string){
  const arr = qLoad(sessionId);
  if (!arr.length) return 0;
  let ok=0, rest: any[] = [];
  for (const it of arr){
    try{
      await gql(`mutation($id:String!,$a:SetLogInput!){ logSet(id:$id, actual:$a){ id } }`, { id: it.id, a: it.actual });
      ok++;
    }catch(e){ rest.push(it); }
  }
  qSave(sessionId, rest);
  return ok;
}

export default function SessionPage({ params, searchParams }:{ params:{ id:string }, searchParams:any }){
  const id = params.id;
  const clientId = searchParams?.clientId || 'demo-client';
  const [data, setData] = useState<any>(null);
  const [log, setLog] = useState<Record<string, { reps:number, weight?:number, rpe?:number }>>({});

  const load = async ()=>{
    const d = await gql(`query($id:String!){ sessionDetail(id:$id){ id date status dayIndex blocks{ id type section protocol protocolParams items{ id note exerciseId sets{ id order reps rest targetWeight targetRPE } } } } }`, { id });
    setData(d.sessionDetail);
  }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
  useEffect(()=>{ load(); }, [id]);

  const doStart = async ()=>{ await gql(`mutation($id:String!){ startSession(sessionId:$id){ id } }`, { id }); load(); }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
  const doComplete = async ()=>{ await gql(`mutation($id:String!){ completeSession(sessionId:$id){ id } }`, { id }); load(); }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };
  const submitSet = async (setId:string)=>{
    const v = log[setId]; if (!v) return;
    await gql(`mutation($s:String!,$p:String!,$r:Int!,$w:Float,$e:Int){ logSet(sessionId:$s, planSetId:$p, reps:$r, weight:$w, rpe:$e){ id } }`, { s:id, p:setId, r:v.reps, w:v.weight||null, e:v.rpe||null });
    const n = { ...log }; delete n[setId]; setLog(n);
  }catch(e){ try{ const payload = (log && typeof log==='object')? log[sid] || {} : {}; qSave(id, [...qLoad(id), { id: sid, actual: payload }]); alert('ذخیرهٔ آفلاین؛ بعداً همگام‌سازی می‌شود.'); }catch(_){} };

  if (!data) return <div style={{ padding:24 }}>در حال بارگذاری…</div>;

  return (
    <div style={{ padding:24, display:'grid', gridTemplateColumns:'1fr 360px', gap:16 }}>
      <div>
        <h1>جلسهٔ امروز — #{data.dayIndex+1}</h1>
        {data.blocks.map((b:any)=> (
          <div key={b.id} style={{ border:'1px solid #eee', borderRadius:12, padding:12, marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between' }}>
              <strong>{b.section||'MAIN'} • {b.type}</strong>
              {!!b.protocol && <span style={{ opacity:.7 }}>{b.protocol}</span>}
            </div>
            {!!b.protocol && (b.protocol==='EMOM' || b.protocol==='HIIT') && <Timer type={b.protocol} params={b.protocolParams||{}} />}
            <BlockRunner block={b} />
            {b.items.map((it:any)=> (
              <div key={it.id} style={{ marginTop:8, padding:8, borderRadius:8, background:'#fafafa' }}>
                <div style={{ fontWeight:600 }}>{it.note||'آیتم'}</div>
                <table style={{ width:'100%', fontSize:13 }}>
                  <thead><tr><th align='left'>ست</th><th align='left'>هدف</th><th align='left'>ثبت</th><th /></tr></thead>
                  <tbody>
                    {it.sets.map((s:any)=> (
                      <tr key={s.id}>
                        <td>#{s.order+1}</td>
                        <td>{s.reps} reps{typeof s.targetWeight==='number' ? ` @ ${s.targetWeight}kg` : ''}{typeof s.targetRPE==='number' ? ` • RPE ${s.targetRPE}` : ''}</td>
                        <td>
                          <input type='number' placeholder='تکرار' style={{ width:64 }} value={log[s.id]?.reps||''} onChange={e=> setLog(prev=> ({ ...prev, [s.id]: { ...(prev[s.id]||{}), reps: Number(e.target.value) } }))} />
                          <input type='number' placeholder='وزن' style={{ width:64, marginInlineStart:6 }} value={log[s.id]?.weight||''} onChange={e=> setLog(prev=> ({ ...prev, [s.id]: { ...(prev[s.id]||{}), weight: Number(e.target.value) } }))} />
                          <input type='number' placeholder='RPE' style={{ width:64, marginInlineStart:6 }} value={log[s.id]?.rpe||''} onChange={e=> setLog(prev=> ({ ...prev, [s.id]: { ...(prev[s.id]||{}), rpe: Number(e.target.value) } }))} />
                        </td>
                        <td><button onClick={()=> submitSet(s.id)}>ثبت</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div>
        <div style={{ border:'1px solid #eee', borderRadius:12, padding:12 }}>
          <div style={{ fontWeight:700, marginBottom:8 }}>کنترل جلسه</div>

        <NotesPanel sessionId={id} />
        <div style={{ height:12 }} />
          <div style={{ display:'flex', gap:8 }}>
            {data.status!=='IN_PROGRESS' && <button onClick={doStart}>شروع</button>}
            {data.status==='IN_PROGRESS' && <button onClick={doComplete}>پایان</button>}
            <a href={`/me/today?clientId=${clientId}`} style={{ marginInlineStart:'auto' }}>بازگشت</a>
          </div>
        </div>
      </div>
    </div>
  );
}
