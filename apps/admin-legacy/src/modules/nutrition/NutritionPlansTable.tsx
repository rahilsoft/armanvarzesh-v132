import React from 'react';
import { usePlan } from '../../../../packages/data/nutrition/hooks';
export default function NutritionPlansTable(){
  const { data, loading, error } = usePlan();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  if(!data) return <div>Empty</div>;
  const totalCal = data.meals.reduce((s,m)=>s+m.calories,0);
  const totalProt = data.meals.reduce((s,m)=>s+m.protein,0);
  return (
    <div dir="rtl">
      <h3>{data.title}</h3>
      <div>کل کالری امروز: {totalCal} — کل پروتئین: {totalProt} g</div>
      <table>
        <thead><tr><th>وعده</th><th>کالری</th><th>پروتئین</th><th>زمان</th></tr></thead>
        <tbody>{data.meals.map(m=> <tr key={m.id}><td>{m.name}</td><td>{m.calories}</td><td>{m.protein}</td><td>{new Date(m.at).toLocaleTimeString('fa-IR')}</td></tr>)}</tbody>
      </table>
    </div>
  );
}
