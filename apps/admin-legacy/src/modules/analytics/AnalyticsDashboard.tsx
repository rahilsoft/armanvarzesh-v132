import React from 'react';
import { useKpis, useWeekly } from '../../../../packages/data/analytics/hooks';
export default function AnalyticsDashboard(){
  const { data:kpis, loading:lk } = useKpis();
  const { data:weekly, loading:lw } = useWeekly();
  return (
    <div dir="rtl">
      <h2>داشبورد تحلیل</h2>
      {lk? <div>Loading KPIs…</div> : <div style={{display:'grid',gap:12,gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
        {kpis?.map(k=> <div key={k.id} style={{border:'1px solid #1f2a3a',padding:12,borderRadius:8}}>
          <div>{k.label}</div><div style={{fontSize:24}}>{k.value} {k.unit||''}</div>
        </div>)}
      </div>}
      {lw? <div>Loading Weekly…</div> : <div style={{marginTop:16}}>
        {(weekly?.points||[]).slice(0,7).map(p=> <div key={p.t}>{new Date(p.t).toLocaleDateString('fa-IR')} — {p.v}</div>)}
      </div>}
    </div>
  );
}
