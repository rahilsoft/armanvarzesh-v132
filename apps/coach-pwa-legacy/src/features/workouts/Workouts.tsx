import React from 'react';
import { useWorkoutPlan } from '../../../packages/data/workouts/hooks';
export default function Workouts(){
  const { data, loading } = useWorkoutPlan();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>تمرین‌ها (PWA)</h3>
      {loading? '...' : (data?.sessions||[]).map(s=> <div key={s.id}>{new Date(s.date).toLocaleDateString('fa-IR')} — {s.status}</div>)}
    </div>
  );
}
