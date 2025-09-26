import React from 'react';
import { useProtocols } from '../../../../packages/data/physio/hooks';
export default function PhysioProtocols(){
  const { data, loading, error } = useProtocols();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  return (
    <div dir="rtl">
      <h2>پروتکل‌ها</h2>
      <ul>{(data||[]).map(p=> <li key={p.id}>{p.title} — {p.focus}</li>)}</ul>
    </div>
  );
}
