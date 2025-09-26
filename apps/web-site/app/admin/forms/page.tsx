
'use client';
import React, { useEffect, useState } from 'react';

const URL = process.env.NEXT_PUBLIC_CONTENT_SERVICE_URL || '';

async function gql(query:string, variables:any={}){
  const r = await fetch(URL, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ query, variables }) });
  const j = await r.json();
  if (j.errors) throw new Error(j.errors[0]?.message||'error');
  return j.data;
}

type Question = { id?:string; key:string; label:string; type:string; description?:string; placeholder?:string; options?:string[]; required?:boolean; section?:string; order?:number; validation?:any; conditional?:any };
type Form = { id:string; slug:string; title:string; active:boolean; version:number; publishedAt?:string; questions: Question[] };

export default function FormsAdmin(){
  const [forms, setForms] = useState<Form[]>([]);
  const [active, setActive] = useState<Form|null>(null);

  const load = async ()=>{
    const data = await gql(`query{ intakeForms{ id slug title active version publishedAt questions{ id key label type description placeholder options required section order validation conditional } } }`);
    setForms(data.intakeForms||[]);
  };
  useEffect(()=>{ load(); }, []);

  const onNew = async ()=>{
    const slug = prompt('slug? (مثلاً: default)')||'';
    const title = prompt('عنوان فرم؟')||'';
    if (!slug || !title) return;
    await gql(`mutation($input:UpsertFormInput!){ upsertIntakeForm(input:$input){ id } }`, { input: { slug, title, active: false } });
    await load();
  };

  const onActivate = async (f:Form)=>{
    await gql(`mutation($input:UpsertFormInput!){ upsertIntakeForm(input:$input){ id } }`, { input: { id: f.id, slug: f.slug, title: f.title, active:true } });
    await load();
  };
  const onPublish = async (f:Form)=>{
    await gql(`mutation($id:String!){ publishIntakeForm(id:$id){ id version active } }`, { id: f.id });
    await load();
  };

  const onEdit = (f:Form)=> setActive(f);
  const onAddQ = async ()=>{
    if (!active) return;
    const key = prompt('کلید؟ (مثلاً weightKg)')||'';
    const label = prompt('برچسب؟')||'';
    const type = prompt('نوع؟ TEXT|NUMBER|SELECT|MULTISELECT|DATE|BOOLEAN|MEASUREMENTS','TEXT')||'TEXT';
    if (!key || !label) return;
    await gql(`mutation($input:UpsertQuestionInput!){ upsertIntakeQuestion(input:$input){ id } }`, { input: { formId: active.id, key, label, type, required:false, order: (active.questions?.length||0) } });
    await load();
  };
  const delQ = async (qid:string)=>{ if (!confirm('حذف شود؟')) return; await gql(`mutation($id:String!){ deleteIntakeQuestion(id:$id) }`, { id: qid }); await load(); };
  const moveQ = async (qid:string, dir:number)=>{
    if (!active) return;
    const qs = [...(active.questions||[])];
    const i = qs.findIndex(q=> q.id===qid); const j = i+dir;
    if (i<0 || j<0 || j>=qs.length) return;
    const a = qs[i], b = qs[j];
    await gql(`mutation($a:UpsertQuestionInput!,$b:UpsertQuestionInput!){ ua: upsertIntakeQuestion(input:$a){ id } ub: upsertIntakeQuestion(input:$b){ id } }`,
      { a: { id:a.id, order:b.order }, b: { id:b.id, order:a.order } });
    await load();
  };
  const toggleReq = async (qid:string, req:boolean)=>{ await gql(`mutation($input:UpsertQuestionInput!){ upsertIntakeQuestion(input:$input){ id } }`, { input: { id: qid, required: req } }); await load(); };
  const editMeta = async (q:Question)=>{
    const desc = prompt('توضیح:', q.description||'')||'';
    const ph = prompt('Placeholder:', q.placeholder||'')||'';
    const section = prompt('بخش:', q.section||'')||'';
    await gql(`mutation($input:UpsertQuestionInput!){ upsertIntakeQuestion(input:$input){ id } }`, { input: { id: q.id, description: desc, placeholder: ph, section } });
    await load();
  };
  const editOptions = async (q:Question)=>{
    const list = prompt('گزینه‌ها را با کاما بنویسید:', (q.options||[]).join(','))||'';
    await gql(`mutation($input:UpsertQuestionInput!){ upsertIntakeQuestion(input:$input){ id } }`, { input: { id: q.id, options: list? list.split(',').map(s=> s.trim()) : [] } });
    await load();
  };
  const editValidation = async (q:Question)=>{
    const min = prompt('حداقل (برای عدد):', q.validation?.min ?? '')||'';
    const max = prompt('حداکثر (برای عدد):', q.validation?.max ?? '')||'';
    const pattern = prompt('الگوی regex (برای متن):', q.validation?.pattern ?? '')||'';
    await gql(`mutation($input:UpsertQuestionInput!){ upsertIntakeQuestion(input:$input){ id } }`, { input: { id:q.id, validation: { min: min!==''?Number(min):undefined, max: max!==''?Number(max):undefined, pattern: pattern||undefined } } });
    await load();
  };
  const editConditional = async (q:Question)=>{
    const key = prompt('نمایش فقط اگر مقدار این فیلد...', q.conditional?.showIf?.[0]?.key || '')||'';
    if (!key) return;
    const op = prompt('عملگر (eq|neq|gt|lt):', q.conditional?.showIf?.[0]?.op || 'eq')||'eq';
    const value = prompt('value:', q.conditional?.showIf?.[0]?.value || '')||'';
    await gql(`mutation($input:UpsertQuestionInput!){ upsertIntakeQuestion(input:$input){ id } }`, { input: { id:q.id, conditional: { showIf: [{ key, op, value }] } } });
    await load();
  };

  return (
    <div style={{ padding:24, display:'grid', gridTemplateColumns:'300px 1fr', gap:16 }}>
      <div>
        <h1>Intake Forms</h1>
        <button onClick={onNew}>+ فرم جدید</button>
        <div style={{ marginTop:12, display:'grid', gap:8 }}>
          {forms.map(f=> (
            <div key={f.id} style={{ border:'1px solid #eee', borderRadius:10, padding:10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:8 }}>
                <div>
                  <strong>{f.title}</strong> <span style={{ opacity:.6 }}>({f.slug})</span>
                  <div style={{ fontSize:12, opacity:.7 }}>v{f.version} {f.publishedAt ? `• ${new Date(f.publishedAt).toLocaleString()}` : ''}</div>
                </div>
                <div style={{ display:'flex', gap:6, alignItems:'center' }}>
                  {f.active ? <span style={{ color:'#1f8f4f' }}>Active</span> : <button onClick={()=> onActivate(f)}>فعال‌سازی</button>}
                  <button onClick={()=> onPublish(f)}>انتشار نسخه</button>
                  <button onClick={()=> setActive(f)}>ویرایش</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        {!active && <p style={{ opacity:.6 }}>یک فرم را برای ویرایش انتخاب کنید. برای مشاهدهٔ اجرای واقعی فرم به <a href="/admin/forms/preview">Preview</a> بروید.</p>}
        {active && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h2>{active.title}</h2>
              <button onClick={onAddQ}>+ افزودن سوال</button>
            </div>
            <div style={{ marginTop:12, display:'grid', gap:8 }}>
              {active.questions?.sort((a,b)=> (a.order||0)-(b.order||0)).map(q=> (
                <div key={q.id} style={{ border:'1px solid #eee', borderRadius:10, padding:10 }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1.2fr 0.8fr 120px 120px 100px 240px', gap:8, alignItems:'center' }}>
                    <div><strong>{q.label}</strong> <span style={{ opacity:.6 }}>({q.key})</span></div>
                    <div style={{ opacity:.7 }}>{q.type}</div>
                    <div><label><input type='checkbox' checked={!!q.required} onChange={e=> toggleReq(q.id!, e.target.checked)} /> اجباری</label></div>
                    <div>
                      <button onClick={()=> moveQ(q.id!, -1)}>↑</button>
                      <button onClick={()=> moveQ(q.id!, +1)} style={{ marginLeft:6 }}>↓</button>
                    </div>
                    <div><button onClick={()=> delQ(q.id!)} style={{ color:'#c00' }}>حذف</button></div>
                    <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                      <button onClick={()=> editMeta(q)}>متا</button>
                      {(q.type==='SELECT' || q.type==='MULTISELECT') && <button onClick={()=> editOptions(q)}>گزینه‌ها</button>}
                      <button onClick={()=> editValidation(q)}>اعتبارسنجی</button>
                      <button onClick={()=> editConditional(q)}>شرط نمایش</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
