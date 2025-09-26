
'use client';
import React, { useEffect, useState } from 'react';

function Card({ title, children }:{ title:string; children:any }){
  return <div style={{padding:16, border:'1px solid #eee', borderRadius:12, boxShadow:'0 10px 30px rgba(0,0,0,.04)'}}>
    <h3 style={{marginTop:0}}>{title}</h3>
    {children}
  </div>;
}

async function fetchMetric(name:string){
  const r = await fetch('/api/metrics?name=' + encodeURIComponent(name));
  const j = await r.json();
  // clickhouse JSON: { data: [...], meta: [...] }
  return j.data || [];
}

export default function Experiments(){
  const [ctrTile, setCtrTile] = useState<any[]>([]);
  const [convTile, setConvTile] = useState<any[]>([]);
  const [abZ, setAbZ] = useState<any[]>([]);
  const [utm, setUtm] = useState<any[]>([]);
  const [wv, setWv] = useState<any[]>([]);

  useEffect(()=>{
    fetchMetric('ctr_per_tile').then(setCtrTile);
    fetchMetric('conversion_from_tile').then(setConvTile);
    fetchMetric('ab_significance').then(setAbZ);
    fetchMetric('ctr_by_utm').then(setUtm);
    fetchMetric('webvitals_p95').then(setWv);
  }, []);

  return (
    <div style={{padding:24, display:'grid', gap:16}}>
      <h1>Experiments & KPIs</h1>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <Card title="CTR per Tile (7d)">
          <table style={{width:'100%'}}><thead><tr><th>Tile</th><th>Var</th><th>Imp</th><th>Clk</th><th>CTR%</th></tr></thead>
          <tbody>{ctrTile.map((r:any,i:number)=> <tr key={i}><td>{r.id}</td><td>{r.variant}</td><td>{r.imp}</td><td>{r.clk}</td><td>{r.ctr_pct}</td></tr>)}</tbody></table>
        </Card>
        <Card title="Conversion from Tile → Signup (7d)">
          <table style={{width:'100%'}}><thead><tr><th>Tile</th><th>Var</th><th>Clicks</th><th>Signups</th><th>CR%</th></tr></thead>
          <tbody>{convTile.map((r:any,i:number)=> <tr key={i}><td>{r.id}</td><td>{r.variant}</td><td>{r.clicks}</td><td>{r.signups}</td><td>{r.cr_pct}</td></tr>)}</tbody></table>
        </Card>
        <Card title="A/B z-score (14d)">
          <table style={{width:'100%'}}><thead><tr><th>Tile</th><th>A</th><th>CTR A</th><th>B</th><th>CTR B</th><th>z</th></tr></thead>
          <tbody>{abZ.map((r:any,i:number)=> <tr key={i}><td>{r.id}</td><td>{r.variant_a}</td><td>{(r.ctr_a*100).toFixed(2)}%</td><td>{r.variant_b}</td><td>{(r.ctr_b*100).toFixed(2)}%</td><td>{r.z_score?.toFixed(2)}</td></tr>)}</tbody></table>
          <p style={{opacity:.7, fontSize:12}}>قاعدهٔ سرانگشتی: |z| ≥ 1.96 → p≈0.05 (معنادار)</p>
        </Card>
        <Card title="CTR by UTM (7d)">
          <table style={{width:'100%'}}><thead><tr><th>Tile</th><th>Var</th><th>Source</th><th>Campaign</th><th>CTR%</th></tr></thead>
          <tbody>{utm.map((r:any,i:number)=> <tr key={i}><td>{r.id}</td><td>{r.variant}</td><td>{r.utm_source}</td><td>{r.utm_campaign}</td><td>{r.ctr_pct}</td></tr>)}</tbody></table>
        </Card>
      </div>
      <Card title="Web Vitals p95 (7d)">
        <table style={{width:'100%'}}><thead><tr><th>Metric</th><th>p95</th></tr></thead>
        <tbody>{wv.map((r:any,i:number)=> <tr key={i}><td>{r.metric}</td><td>{Number(r.p95).toFixed(2)}</td></tr>)}</tbody></table>
      </Card>
    </div>
  );
}
