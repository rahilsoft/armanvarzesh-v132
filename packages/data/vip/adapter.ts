const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { VipTier, VipState } from './schemas';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let tiers: VipTier[] = [
  { id:'t1', name:'Bronze', threshold:0, benefits:['5% off'] },
  { id:'t2', name:'Silver', threshold:300, benefits:['10% off','Priority chat'] },
  { id:'t3', name:'Gold', threshold:700, benefits:['15% off','VIP support'] },
];
let vip: VipState = { tier: tiers[1], progress: 420, next: tiers[2] };
export async function getVip(){ if(MODE==='mock'){ await delay(100); return { tiers, state: vip }; }
  const res = await fetch('/api/bff/vip/get'); if(!res.ok) throw new Error('Network'); return await res.json(); }
