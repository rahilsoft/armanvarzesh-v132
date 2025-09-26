import React, { useState } from 'react';
import Head from 'next/head';
import '../../../styles/booking.module.css';
import { useRouter } from 'next/router';
import { Card } from '../../../../packages/ui/components/Card';
import { Button } from '../../../../packages/ui/components/Button';
import { useAssessment, useSubmitAssessment } from '../../../../packages/data/assessments/hooks';

export default function AssessmentFill(){
  const router = useRouter();
  const id = String(router.query.id||'a1');
  const { data, loading, error } = useAssessment(id);
  const { mutate: submit, loading: submitting } = useSubmitAssessment();
  const [answers,setAnswers] = useState<Record<string, any>>({});
  return (
    <div dir="rtl">
      <Head><title>ارزیابی — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>ارزیابی</h1>
      {loading? <p>...</p> : error? <p>خطا</p> : !data? <p>یافت نشد</p> :
        <Card>
          <h3>{data.title}</h3>
          {data.questions.map(q=> <div key={q.id} style={{margin:'8px 0'}}>
            <label>{q.label}</label>
            {q.type==='bool' && <select onChange={e=>setAnswers({...answers,[q.id]: e.target.value==='true'})}><option value="true">بله</option><option value="false">خیر</option></select>}
            {q.type==='scale' && <input type="range" min={q.min||0} max={q.max||10} onChange={e=>setAnswers({...answers,[q.id]: Number(e.target.value)})} />}
            {q.type==='text' && <input onChange={e=>setAnswers({...answers,[q.id]: e.target.value})} />}
          </div>)}
          <Button busy={submitting} onClick={async()=>{ await submit(id, answers); alert('ثبت شد'); }}>ارسال</Button>
        </Card>
      }
    </div>
  );
}
