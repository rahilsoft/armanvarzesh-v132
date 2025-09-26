import React from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useKpis, useWeekly } from '../../../packages/data/analytics/hooks';

export default function AnalyticsPage(){
  const { data:kpis, loading:lk, error:ek, reload:rk } = useKpis();
  const { data:weekly, loading:lw, error:ew, reload:rw } = useWeekly();
  return (
    <div dir="rtl">
      <Head><title>تحلیل‌ها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>تحلیل‌ها</h1>
      <Card>
        {lk? <p>در حال بارگذاری…</p> : ek? <p>خطا <Button onClick={rk}>تلاش مجدد</Button></p> :
          <div style={{display:'grid',gap:12,gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))'}}>
            {kpis?.map(k=> <div key={k.id} className="card"><b>{k.label}</b><div style={{fontSize:24}}>{k.value} {k.unit||''}</div></div>)}
          </div>}
      </Card>
      <Card>
        <h3>بار هفتگی</h3>
        {lw? <p>در حال بارگذاری…</p> : ew? <p>خطا <Button onClick={rw}>Retry</Button></p> :
          <ul>{weekly?.points.map(p=> <li key={p.t}>{new Date(p.t).toLocaleDateString('fa-IR')} — {p.v}</li>)}</ul>}
      </Card>
    </div>
  );
}
