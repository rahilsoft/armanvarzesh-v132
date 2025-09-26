import React from 'react';
import { useAssessments } from '../../../packages/data/assessments/hooks';
export default function Assessments(){
  const { data, loading } = useAssessments();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>ارزیابی‌ها (PWA)</h3>
      {loading? '...' : (data||[]).map(a=> <div key={a.id}>{a.title}</div>)}
    </div>
  );
}
