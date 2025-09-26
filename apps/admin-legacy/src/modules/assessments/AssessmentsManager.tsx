import React from 'react';
import { useSubmissions } from '../../../../packages/data/assessments/hooks';
export default function AssessmentsManager(){
  const { data, loading, error } = useSubmissions();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  return (
    <div dir="rtl">
      <h2>ارزیابی‌های ارسال‌شده</h2>
      {(data||[]).length===0? 'خالی' : (data||[]).map(s=> <div key={s.id}>{s.id} — {new Date(s.submittedAt).toLocaleString('fa-IR')}</div>)}
    </div>
  );
}
