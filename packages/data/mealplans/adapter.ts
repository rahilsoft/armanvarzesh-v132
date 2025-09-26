const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { MealPlan } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let PLANS: MealPlan[] = [
  { id:'mp1', title:'پلن ۷ روزه کات', kcalTarget: 2000, days:[{day:1, mealIds:['m1']},{day:2, mealIds:['m1']} ] }
];
export async function list(){ if(MODE==='mock'){ await delay(60); return PLANS.slice(); }
  const res = await fetcher('/api/bff/mealplans/list'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function assign(planId:string, userId:string){ if(MODE==='mock'){ await delay(60); return { ok:true, planId, userId }; }
  const res = await fetcher('/api/bff/mealplans/assign',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ planId, userId })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
