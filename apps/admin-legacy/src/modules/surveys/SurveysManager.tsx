import React from 'react';
import { useSurvey } from '../../../../packages/data/surveys/hooks';
export default function SurveysManager(){
  const { data, loading } = useSurvey('sv_nps');
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>Surveys</h2>
      <div>Default: {data?.title}</div>
    </div>
  );
}
