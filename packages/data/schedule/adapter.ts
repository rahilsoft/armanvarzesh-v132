const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { ScheduledSession } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let SCHEDULE: ScheduledSession[] = [
  { id:'sc1', date: new Date(Date.now()+86400000).toISOString(), workoutId:'w1', status:'upcoming' },
  { id:'sc2', date: new Date().toISOString(), workoutId:'w2', status:'upcoming' },
];
export async function list(){ if(MODE==='mock'){ await delay(60); return SCHEDULE.slice(); }
  const res = await fetcher('/api/bff/schedule/list'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function add(date:string, workoutId:string, programId?:string){ if(MODE==='mock'){ await delay(60); const s={ id:'sc_'+Math.random().toString(36).slice(2), date, workoutId, programId, status:'upcoming' }; SCHEDULE.unshift(s); return s; }
  const res = await fetcher('/api/bff/schedule/add',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ date, workoutId, programId })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function setStatus(id:string, status:'upcoming'|'done'|'missed'){ if(MODE==='mock'){ await delay(40); const s=SCHEDULE.find(x=>x.id===id); if(!s) throw new Error('not found'); s.status=status; return s; }
  const res = await fetcher('/api/bff/schedule/status',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
