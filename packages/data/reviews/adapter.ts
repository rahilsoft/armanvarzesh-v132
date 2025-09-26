const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Review } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let REVIEWS: Review[] = [
  { id:'r1', coachId:'c1', userId:'u1', stars:5, comment:'عالی بود', at:new Date().toISOString(), status:'published' },
  { id:'r2', coachId:'c2', userId:'u2', stars:4, comment:'خیلی خوب', at:new Date().toISOString(), status:'published' },
];
export async function list(coachId:string){ if(MODE==='mock'){ await delay(60); return REVIEWS.filter(r=> r.coachId===coachId && r.status==='published'); }
  const res = await fetcher('/api/bff/reviews/list?coachId='+coachId); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function add(coachId:string, stars:number, comment?:string){ if(MODE==='mock'){ await delay(80); const r: Review = { id:'rv_'+Math.random().toString(36).slice(2), coachId, userId:'u1', stars, comment, at:new Date().toISOString(), status:'pending' }; REVIEWS.unshift(r); return r; }
  const res = await fetcher('/api/bff/reviews/add',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ coachId, stars, comment })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function moderate(id:string, status:'published'|'hidden'){ if(MODE==='mock'){ await delay(60); const r = REVIEWS.find(x=> x.id===id); if(!r) throw new Error('not found'); r.status=status; return r; }
  const res = await fetcher('/api/bff/reviews/moderate',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, status })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
