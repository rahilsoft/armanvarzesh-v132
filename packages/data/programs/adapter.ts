const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Program } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
const PROGRAMS: Program[] = [
  { id:'p1', title:'چالش ۴ هفته‌ای', weeks:4, level:'beginner', plan:[{day:1, workoutId:'w2'},{day:3, workoutId:'w1'}] }
];
export async function list(){ if(MODE==='mock'){ await delay(60); return PROGRAMS; }
  const res = await fetcher('/api/bff/programs/list'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function get(id:string){ if(MODE==='mock'){ await delay(40); return PROGRAMS.find(p=> p.id===id)||null; }
  const res = await fetcher('/api/bff/programs/get?id='+id); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function create(p: Program){ if(MODE==='mock'){ await delay(80); PROGRAMS.unshift(p); return p; }
  const res = await fetcher('/api/bff/programs/create',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(p)}); if(!res.ok) throw new Error('Network'); return await res.json(); }
