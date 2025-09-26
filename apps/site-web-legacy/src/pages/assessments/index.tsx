import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import '../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { FormField } from '../../../packages/ui/components/FormField';
import { FormStepper } from '../../../packages/ui/components/FormStepper';
import { useAssessTemplate, useAssessDraft, useDraftSave, useAssessSubmit } from '../../../packages/data/assessments/hooks';

export default function AssessmentsPage(){
  const { data:tpl, loading, error } = useAssessTemplate();
  const { data:draft, reload:reloadDraft } = useAssessDraft(tpl?.id||'gen-health');
  const { mutate: saveDraft, saving } = useDraftSave();
  const { mutate: submit, loading: submitting } = useAssessSubmit();
  const [values,setValues] = useState<Record<string,any>>({});
  const [step,setStep] = useState(1);
  const total = tpl?.steps.length || 1;

  React.useEffect(()=>{
    if(draft){ setValues(draft.values||{}); setStep(draft.step||1); }
  },[draft?.id]);

  const current = useMemo(()=> tpl?.steps[step-1], [tpl, step]);

  async function persist(){
    const d = { id: 'draft_'+tpl?.id, templateId: tpl?.id||'gen-health', values, step, updatedAt: Date.now() };
    await saveDraft(d as any); // optimistic
  }
  async function doSubmit(){
    await submit(values, tpl?.id||'gen-health'); setValues({}); setStep(1); await reloadDraft();
    alert('ارسال شد');
  }

  if(loading) return <div dir="rtl">...</div>;
  if(error) return <div dir="rtl">خطا</div>;
  if(!tpl) return <div dir="rtl">خالی</div>;

  return (
    <div dir="rtl">
      <Head><title>ارزیابی — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <Card>
        <h1>{tpl.title}</h1>
        <FormStepper step={step} total={total} onPrev={()=> setStep(Math.max(1,step-1))} onNext={()=> setStep(Math.min(total, step+1))} />
        {current && <div style={{display:'grid',gap:8,marginTop:12}}>
          {current.fields.map(f=> <FormField key={f.id} label={f.label}>
            {f.type==='number' && <input type="number" value={values[f.id]||''} onChange={e=> setValues(v=> ({...v, [f.id]: Number(e.target.value)}))} />}
            {f.type==='text' && <input value={values[f.id]||''} onChange={e=> setValues(v=> ({...v, [f.id]: e.target.value}))} />}
            {f.type==='select' && <select value={values[f.id]||''} onChange={e=> setValues(v=> ({...v, [f.id]: e.target.value}))}>
              <option value="">—</option>
              {(f.options||[]).map(o=> <option key={o} value={o}>{o}</option>)}
            </select>}
          </FormField>)}
        </div>}
        <div style={{display:'flex',gap:8,marginTop:12}}>
          <Button onClick={persist} busy={saving}>ذخیره پیش‌نویس</Button>
          {step<total? <Button onClick={()=> setStep(step+1)}>بعدی</Button> : <Button onClick={doSubmit} busy={submitting}>ارسال</Button>}
        </div>
      </Card>
    </div>
  );
}
