const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { LiveRoom } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let rooms: LiveRoom[] = [
  { id:'l1', title:'HIIT 20min', coach:'Arash', start:new Date(Date.now()+10*60*1000).toISOString(), status:'scheduled', url:'https://live.example/room/hiit' },
  { id:'l2', title:'Mobility & Stretch', coach:'Narges', start:new Date().toISOString(), status:'live', url:'https://live.example/room/mobility' },
];
export async function list(){ if(MODE==='mock'){ await delay(120); return rooms.slice(); }
  const res = await fetcher('/api/bff/live/list'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function create(title:string, start:string){ if(MODE==='mock'){ await delay(100); const r={ id:String(Date.now()), title, start, coach:'You', status:'scheduled', url:'https://live.example/room/'+Math.random().toString(36).slice(2)}; rooms.unshift(r); return r; }
  const res = await fetcher('/api/bff/live/create',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ title, start })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
