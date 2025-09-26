import React from 'react';
import { useKpis, useWeekly } from '../../../packages/data/analytics/hooks';
export default function Analytics(){
  const { data:kpis, loading:lk } = useKpis();
  const { data:weekly, loading:lw } = useWeekly();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>تحلیل‌ها (PWA)</h3>
      {lk? '...' : kpis?.map(k=> <div key={k.id}>{k.label}: {k.value} {k.unit||''}</div>)}
      {lw? '...' : weekly?.points.map(p=> <div key={p.t}>{new Date(p.t).toLocaleDateString('fa-IR')} — {p.v}</div>)}
    </div>
  );
}
