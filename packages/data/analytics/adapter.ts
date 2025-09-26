const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { KPI, Series } from './schemas';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));

let kpis: KPI[] = [
  { id:'vo2', label:'VO₂max', value:26.4, unit:'ml/kg/min', trend:'up' },
  { id:'load', label:'Weekly Load', value:730, unit:'TRIMP', trend:'flat' },
  { id:'rhr', label:'Resting HR', value:58, unit:'bpm', trend:'down' }
];
let weekly: Series = { id:'weekly', label:'Weekly Load', points: Array.from({length:7}).map((_,i)=>({ t:new Date(Date.now()-i*86400000).toISOString(), v: 500+Math.round(Math.random()*300) })) };

export async function getKpis(){ if(MODE==='mock'){ await delay(200); return kpis; }
  const res = await fetch('/api/bff/analytics/kpis'); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function getWeekly(){ if(MODE==='mock'){ await delay(200); return weekly; }
  const res = await fetch('/api/bff/analytics/weekly'); if(!res.ok) throw new Error('Network'); return await res.json(); }
