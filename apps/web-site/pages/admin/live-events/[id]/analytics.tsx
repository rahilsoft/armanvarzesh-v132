import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authHeaders } from '../../../../src/utils/adminAuth';

function Sparkline({ points }:{ points:number[] }){
  if (!points || !points.length) return <svg width="200" height="40"></svg>;
  const w=200,h=40,pad=2;
  const max=Math.max(...points), min=Math.min(...points);
  const scaleX=(i:number)=> pad + i*( (w-2*pad)/(points.length-1||1) );
  const scaleY=(v:number)=> h-pad - ( (v-min)/(max-min||1) )*(h-2*pad);
  const d=points.map((v,i)=> (i===0?'M':'L')+scaleX(i)+','+scaleY(v)).join(' ');
  return <svg width={w} height={h}><path d={d} fill="none" stroke="currentColor" strokeWidth={2} /></svg>;
}

function toCSV(rows:any[]){
  if (!rows || !rows.length) return '';
  const headers = Object.keys(rows[0] || {date:'',ticketsSold:0,revenueGross:0,revenueNet:0,viewersUnique:0,peakConcurrent:0,chats:0});
  const esc = (v:any) => {
    if (v===null || v===undefined) return '';
    const s = String(v).replace(/"/g,'""');
    return /[",\n]/.test(s) ? '"' + s + '"' : s;
  };
  const head = headers.join(',');
  const body = rows.map(r => headers.map(h => esc(r[h])).join(',')).join('\n');
  return head + '\n' + body;
}
function exportCSV(name:string, rows:any[]){
  const csv = toCSV(rows);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
export default function AnalyticsPage(){
  const router = useRouter();
  const { id } = router.query as { id: string };
  const [kpi, setKpi] = useState<any>(null);
  const [agg, setAgg] = useState<any[]>([]);
  const api = process.env.NEXT_PUBLIC_API_BASE || '';

  useEffect(()=>{
    if (!id) return;
    const h = { ...(authHeaders() as any) } as any;
    fetch(`${api}/live/analytics/event/${id}`, { headers: h }).then(r=>r.json()).then(setKpi);
    fetch(`${api}/live/analytics/event/${id}/aggregate`, { headers: h }).then(r=>r.json()).then(setAgg);
  },[id]);

  const rev = agg.map(a=>a.revenueNet||0);
  const viewers = agg.map(a=>a.viewersUnique||0);
  const peak = agg.map(a=>a.peakConcurrent||0);
  const chats = agg.map(a=>a.chats||0);

  return <div style={padding:24}>
    <h2>Analytics</h2>
    <div style={display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:16}>
      <div style={border:'1px solid #eee',borderRadius:8,padding:12}>
        <div>Revenue (Net)</div>
        <div style={fontSize:20,fontWeight:600}>{Intl.NumberFormat().format(rev.reduce((s,v)=>s+v,0))}</div>
        <Sparkline points={rev} />
      </div>
      <div style={border:'1px solid #eee',borderRadius:8,padding:12}>
        <div>Unique Viewers</div>
        <div style={fontSize:20,fontWeight:600}>{kpi?.viewersUnique ?? 0}</div>
        <Sparkline points={viewers} />
      </div>
      <div style={border:'1px solid #eee',borderRadius:8,padding:12}>
        <div>Peak Concurrent</div>
        <div style={fontSize:20,fontWeight:600}>{kpi?.peakConcurrent ?? 0}</div>
        <Sparkline points={peak} />
      </div>
      <div style={border:'1px solid #eee',borderRadius:8,padding:12}>
        <div>Chats</div>
        <div style={fontSize:20,fontWeight:600}>{kpi?.chats ?? 0}</div>
        <Sparkline points={chats} />
      </div>
    </div>

    <h3 style={marginTop:24}>Timeline</h3>
    <table style={width:'100%',borderCollapse:'collapse'}>
      <thead><tr><th style={textAlign:'left'}>Date</th><th>Tickets</th><th>Revenue Gross</th><th>Revenue Net</th><th>Unique</th><th>Peak</th><th>Chats</th></tr></thead>
      <tbody>
        {agg.map((a,i)=> <tr key={i}>
          <td style={padding:'6px 0'}>{new Date(a.date).toLocaleString()}</td>
          <td style={textAlign:'center'}>{a.ticketsSold ?? 0}</td>
          <td style={textAlign:'center'}>{a.revenueGross ?? 0}</td>
          <td style={textAlign:'center'}>{a.revenueNet ?? 0}</td>
          <td style={textAlign:'center'}>{a.viewersUnique ?? 0}</td>
          <td style={textAlign:'center'}>{a.peakConcurrent ?? 0}</td>
          <td style={textAlign:'center'}>{a.chats ?? 0}</td>
        </tr>)}
      </tbody>
    </table>
  </div>;
}
