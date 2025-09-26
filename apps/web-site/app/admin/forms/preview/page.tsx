
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';

async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json();
  if (j.errors) throw new Error(j.errors[0]?.message||'error');
  return j.data;
}

export default function Preview(){
  const [form, setForm] = useState<any>(null);
  const [answers, setAnswers] = useState<any>({});
  const [msg, setMsg] = useState('');

  useEffect(()=>{
    gql(`query{ activeIntakeForm{ id slug title version questions{ id key label type required placeholder description order validation conditional } } }`).then(d=> setForm(d.activeIntakeForm));
  }, []);

  const visible = (q:any)=>{
    if (!q.conditional) return true;
    const c = q.conditional?.showIf||[];
    return c.every((cond:any)=>{
      const v = answers[cond.key];
      switch(cond.op){ case 'eq': return v===cond.value; case 'neq': return v!==cond.value; case 'gt': return v>cond.value; case 'lt': return v<cond.value; default: return true; }
    });
  };

  const submit = async ()=>{
    if (!form) return;
    setMsg('');
    try{
      await gql(`mutation($userId:String!,$formId:String!,$answers:String!){ submitIntake(userId:$userId, formId:$formId, answers:$answers){ id } }`,
        { userId:'demo-user', formId:form.id, answers: JSON.stringify(answers) });
      setMsg('ثبت شد ✓');
    }catch(e:any){ setMsg(e?.message||'خطا'); }
  };

  if (!form) return <p>...</p>;
  return (
    <div style={{ padding:24, maxWidth:800 }}>
      <h1>پیش‌نمایش فرم: {form.title} (v{form.version})</h1>
      <div style={{ display:'grid', gap:12 }}>
        {form.questions.filter(visible).sort((a:any,b:any)=> a.order-b.order).map((q:any)=> (
          <div key={q.id} style={{ border:'1px solid #eee', borderRadius:10, padding:12 }}>
            <label style={{ display:'block', fontWeight:600 }}>{q.label} {q.required && <span style={{ color:'crimson' }}>*</span>}</label>
            {q.description && <div style={{ fontSize:12, opacity:.7, marginBottom:6 }}>{q.description}</div>}
            {q.type==='TEXT' && <input placeholder={q.placeholder||''} value={answers[q.key]||''} onChange={e=> setAnswers((s:any)=> ({...s, [q.key]: e.target.value }))} />}
            {q.type==='NUMBER' && <input type="number" placeholder={q.placeholder||''} value={answers[q.key]||''} onChange={e=> setAnswers((s:any)=> ({...s, [q.key]: Number(e.target.value) }))} />}
            {q.type==='BOOLEAN' && <input type="checkbox" checked={!!answers[q.key]} onChange={e=> setAnswers((s:any)=> ({...s, [q.key]: e.target.checked }))} />}
            {q.type==='SELECT' && <select value={answers[q.key]||''} onChange={e=> setAnswers((s:any)=> ({...s, [q.key]: e.target.value }))}>
              <option value="">—</option>
              {(q.options||[]).map((o:string)=><option key={o} value={o}>{o}</option>)}
            </select>}
            {q.type==='MULTISELECT' && (
              <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                {(q.options||[]).map((o:string)=>{
                  const selected = (answers[q.key]||[]).includes(o);
                  return <button key={o} onClick={()=>{
                    const cur = new Set(answers[q.key]||[]); selected ? cur.delete(o) : cur.add(o);
                    setAnswers((s:any)=> ({...s, [q.key]: Array.from(cur) }));
                  }} style={{ padding:'4px 10px', borderRadius:100, border:'1px solid #ddd', background:selected?'#111':'#fff', color:selected?'#fff':'#111' }}>{o}</button>
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      <div style={{ height:12 }} />
      <button onClick={submit}>ارسال آزمایشی</button>
      {!!msg && <div style={{ marginTop:8, color: msg.includes('✓') ? '#1f8f4f' : 'crimson' }}>{msg}</div>}
    </div>
  );
}
