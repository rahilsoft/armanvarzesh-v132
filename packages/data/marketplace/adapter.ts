const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Product } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
const PRODUCTS: Product[] = [
  { id:'p1', title:'پروتئین وی ۲ کیلو', price: 3200000, currency:'IRT', category:'supplement', stock: 12 },
  { id:'p2', title:'دمبل ۵ کیلویی', price: 900000, currency:'IRT', category:'equipment', stock: 30 },
];
export async function list(){ if(MODE==='mock'){ await delay(50); return PRODUCTS.slice(); }
  const res = await fetcher('/api/bff/marketplace/list'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function get(id:string){ if(MODE==='mock'){ await delay(40); return PRODUCTS.find(p=> p.id===id)||null; }
  const res = await fetcher('/api/bff/marketplace/get?id='+id); if(!res.ok) throw new Error('Network'); return await res.json(); }
