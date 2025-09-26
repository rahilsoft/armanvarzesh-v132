import React from 'react';
import { useWorkouts } from '../../../../packages/data/workouts/hooks';
export default function Catalog(){
  const { data, loading } = useWorkouts();
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>کاتالوگ تمرین</h2>
      <ul>{(data||[]).map(w=> <li key={w.id}>{w.title} — {w.level}</li>)}</ul>
    </div>
  );
}
