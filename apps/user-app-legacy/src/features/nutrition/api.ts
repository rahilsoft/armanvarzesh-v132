import { ENV } from '../lib/env';

export async function logMeal(items: { barcode?:string; name?:string; calories:number; proteinG:number; carbsG:number; fatG:number }[]){
  const url = `${ENV.NUTRITION_URL}/nutrition/log`;
  const res = await fetch(url, { method:'POST', headers:{ 'content-type':'application/json', authorization:'Bearer dev-u1' }, body: JSON.stringify({ items }) });
  if (!res.ok) throw new Error('log failed');
  return await res.json();
}

export async function daySummary(dateIso: string){
  const url = `${ENV.NUTRITION_URL}/nutrition/day?date=${encodeURIComponent(dateIso)}`;
  const res = await fetch(url, { headers:{ authorization:'Bearer dev-u1' } });
  if (!res.ok) throw new Error('day failed');
  return await res.json();
}
