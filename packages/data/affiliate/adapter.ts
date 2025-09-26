const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Affiliate } from './schemas';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let aff: Affiliate = { code:'AV-HOSSEIN', clicks:143, signups:29, commission:780000, currency:'IRT' };
export async function getAffiliate(){ if(MODE==='mock'){ await delay(100); return aff; }
  const res = await fetch('/api/bff/affiliate/get'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function requestPayout(){ if(MODE==='mock'){ await delay(100); aff.commission = 0; return {ok:true}; }
  const res = await fetch('/api/bff/affiliate/payout',{ method:'POST' }); if(!res.ok) throw new Error('Network'); return await res.json(); }
