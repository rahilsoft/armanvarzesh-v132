import React, { useMemo, useState } from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { useRouter } from 'next/router';
import { Card } from '../../../../packages/ui/components/Card';
import { Button } from '../../../../packages/ui/components/Button';
import { useSurvey, useSurveySubmit } from '../../../../packages/data/surveys/hooks';

export default function SurveyPage(){
  const router = useRouter();
  const id = String(router.query.id||'sv_nps');
  const { data, loading, error } = useSurvey(id);
  const { mutate: submit, loading: sending } = useSurveySubmit();
  const [answers,setAnswers] = useState<Record<string,any>>({});
  const valid = useMemo(()=> data? data.questions.every(q=> answers[q.id]!==undefined && answers[q.id]!=='' ) : false, [answers, data]);

  async function onSend(){
    await submit(id, answers); alert('متشکریم!'); setAnswers({});
  }

  if(loading) return <div dir="rtl">...</div>;
  if(error) return <div dir="rtl">خطا</div>;
  if(!data) return <div dir="rtl">نظرسنجی یافت نشد</div>;

  return (
    <div dir="rtl">
      <Head><title>نظرسنجی — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <Card>
        <h1>{data.title}</h1>
        {(data.questions||[]).map(q=> <div key={q.id} style={{margin:'8px 0'}}>
          <div>{q.text}</div>
          {q.type==='nps' && <input type="number" min={0} max={10} value={answers[q.id]||''} onChange={e=> setAnswers(a=> ({...a,[q.id]: Number(e.target.value)}))} />}
          {q.type==='text' && <textarea value={answers[q.id]||''} onChange={e=> setAnswers(a=> ({...a,[q.id]: e.target.value}))} />}
        </div>)}
        <Button onClick={onSend} disabled={!valid} busy={sending}>ارسال</Button>
      </Card>
    </div>
  );
}
