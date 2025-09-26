const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Coach, CoachFilter } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));

const COACHES: Coach[] = [
  { id:'c1', name:'Arash', gender:'male', tags:['strength','hiit'], rating:4.7, price:150000, currency:'IRT', experience:6, bio:'HIIT & Strength', languages:['fa','en'] },
  { id:'c2', name:'Narges', gender:'female', tags:['mobility','yoga'], rating:4.9, price:180000, currency:'IRT', experience:8, bio:'Mobility & Yoga', languages:['fa','en'] },
  { id:'c3', name:'Reza', gender:'male', tags:['nutrition','weight-loss'], rating:4.5, price:120000, currency:'IRT', experience:5, bio:'Nutrition-focused', languages:['fa'] },
];

export async function list(filter?: CoachFilter){
  if(MODE==='mock'){ await delay(80); let arr = COACHES.slice();
    if(filter?.q){ arr = arr.filter(c=> c.name.toLowerCase().includes(filter.q!.toLowerCase())); }
    if(filter?.gender && filter.gender!=='any'){ arr = arr.filter(c=> c.gender===filter.gender); }
    if(filter?.tags?.length){ arr = arr.filter(c=> filter.tags!.every(t=> c.tags.includes(t))); }
    if(filter?.priceMax){ arr = arr.filter(c=> c.price <= filter.priceMax!); }
    if(filter?.ratingMin){ arr = arr.filter(c=> c.rating >= filter.ratingMin!); }
    return arr;
  }
  const res = await fetcher('/api/bff/coaches/list', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(filter||{}) });
  if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function get(id:string){
  if(MODE==='mock'){ await delay(50); return COACHES.find(c=> c.id===id)||null; }
  const res = await fetcher('/api/bff/coaches/get?id='+id); if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function update(id:string, patch: Partial<Coach>){
  if(MODE==='mock'){ await delay(80); const c = COACHES.find(x=> x.id===id); if(!c) throw new Error('not found'); Object.assign(c, patch); return c; }
  const res = await fetcher('/api/bff/coaches/update',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id, patch })});
  if(!res.ok) throw new Error('Network'); return await res.json();
}
