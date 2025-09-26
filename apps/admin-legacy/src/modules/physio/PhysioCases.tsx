import React from 'react';
import { usePrescriptions } from '../../../../packages/data/physio/hooks';
export default function PhysioCases(){
  const { data, loading, error } = usePrescriptions();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  if(!data) return <div>Empty</div>;
  return (
    <div dir="rtl">
      <h2>پرونده‌های فیزیوتراپی</h2>
      <ul>{data.map(p=> <li key={p.id}>{p.area} — درد {p.painLevel}</li>)}</ul>
    </div>
  );
}
