import React from 'react';
import { useAssessTemplate } from '../../../packages/data/assessments/hooks';
export default function Assessments(){
  const { data, loading } = useAssessTemplate();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>ارزیابی (PWA)</h3>
      {loading? '...' : <div>{data?.title}</div>}
    </div>
  );
}
