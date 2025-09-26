import React from 'react';
import { useCoaches } from '../../../packages/data/coaches/hooks';
export default function Coaches(){
  const { data, loading } = useCoaches({});
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>مربی‌ها (PWA)</h3>
      {loading? '...' : (data||[]).map(c=> <div key={c.id}>{c.name}</div>)}
    </div>
  );
}
