import React, { useEffect, useState } from 'react';
const API = process.env.NEXT_PUBLIC_ANALYTICS_URL || 'http://localhost:4071';

export default function AnalyticsAdmin(){
  const [kpis, setKpis] = useState<any>(null);
  useEffect(()=>{
    const from = new Date(Date.now()-7*24*60*60*1000).toISOString();
    const to = new Date().toISOString();
    fetch(`${API}/kpis?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`, { headers:{ authorization:'Bearer dev-admin' }})
      .then(r=>r.json()).then(setKpis);
  },[]);

  return <div style={{ padding:16 }}>
    <h2>KPIs (7d)</h2>
    <pre>{JSON.stringify(kpis, null, 2)}</pre>
    <a href={`${API}/kpis/export.csv`} target="_blank">Export CSV</a>
  </div>
}
