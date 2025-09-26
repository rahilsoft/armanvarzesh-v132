import React from 'react';
import { useMeals } from '../../../../packages/data/nutrition/hooks';
export default function NutritionManager(){
  const { data, loading } = useMeals();
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>مدیریت وعده‌ها</h2>
      <ul>{(data||[]).map(m=> <li key={m.id}>{m.title} — {Math.round(m.totalKcal)} kcal</li>)}</ul>
    </div>
  );
}
