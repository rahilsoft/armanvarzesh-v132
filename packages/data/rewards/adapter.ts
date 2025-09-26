const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Rewards } from './schemas';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let rewards: Rewards = { balance: 320, history:[
  { id:'rw1', type:'earn', points:50, at:new Date().toISOString(), note:'Workout completed' },
  { id:'rw2', type:'redeem', points:-30, at:new Date(Date.now()-86400000).toISOString(), note:'Discount' },
]};
export async function getRewards(){ if(MODE==='mock'){ await delay(120); return rewards; }
  const res = await fetch('/api/bff/rewards/get'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function earn(points:number){ if(MODE==='mock'){ await delay(80); rewards.balance+=points; rewards.history.unshift({id:String(Date.now()), type:'earn', points, at:new Date().toISOString()}); return rewards; }
  const res = await fetch('/api/bff/rewards/earn',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({points})}); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function redeem(points:number){ if(MODE==='mock'){ await delay(80); rewards.balance-=points; rewards.history.unshift({id:String(Date.now()), type:'redeem', points:-points, at:new Date().toISOString()}); return rewards; }
  const res = await fetch('/api/bff/rewards/redeem',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({points})}); if(!res.ok) throw new Error('Network'); return await res.json(); }
