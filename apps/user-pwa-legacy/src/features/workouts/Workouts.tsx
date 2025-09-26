import React from 'react';
import { useWorkouts } from '../../../packages/data/workouts/hooks';
export default function Workouts(){
  const { data, loading } = useWorkouts();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>تمرین‌ها (PWA)</h3>
      {loading? '...' : (data||[]).map(w=> <div key={w.id}>{w.title}</div>)}
    </div>
  );
}
