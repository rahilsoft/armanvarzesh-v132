import React from 'react';
import { usePrograms } from '../../../../packages/data/programs/hooks';
export default function ProgramsManager(){
  const { data, loading } = usePrograms();
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>برنامه‌ها</h2>
      <ul>{(data||[]).map(p=> <li key={p.id}>{p.title} — {p.weeks} هفته</li>)}</ul>
    </div>
  );
}
