const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Food, Meal } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
const FOODS: Food[] = [
  { id:'f1', name:'برنج', kcal:130, protein:2.4, carb:28, fat:0.3, unit:'g' },
  { id:'f2', name:'سینه مرغ', kcal:165, protein:31, carb:0, fat:3.6, unit:'g' },
  { id:'f3', name:'روغن زیتون', kcal:884, protein:0, carb:0, fat:100, unit:'ml' },
];
let MEALS: Meal[] = [
  { id:'m1', title:'ناهار کات', items:[{foodId:'f2',amount:150},{foodId:'f1',amount:200}], totalKcal: 165*1.5 + 130*2 }
];
export async function listFoods(){ if(MODE==='mock'){ await delay(40); return FOODS; }
  const res = await fetcher('/api/bff/nutrition/foods'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function listMeals(){ if(MODE==='mock'){ await delay(60); return MEALS.slice(); }
  const res = await fetcher('/api/bff/nutrition/meals'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function getMeal(id:string){ if(MODE==='mock'){ await delay(40); return MEALS.find(m=> m.id===id)||null; }
  const res = await fetcher('/api/bff/nutrition/meal?id='+id); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function createMeal(meal: Meal){ if(MODE==='mock'){ await delay(80); MEALS.unshift(meal); return meal; }
  const res = await fetcher('/api/bff/nutrition/meal',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(meal)}); if(!res.ok) throw new Error('Network'); return await res.json(); }
