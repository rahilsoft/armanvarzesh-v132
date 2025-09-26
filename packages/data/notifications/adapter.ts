const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { PushDevice, Notification, Prefs } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=> setTimeout(r, ms));

let PREFS: Prefs = { push: true, email: true, sms: false, categories: { marketing:false, system:true, reminders:true } };
let FEED: Notification[] = [
  { id:'n1', title:'به آرمان ورزش خوش آمدی', body:'شروع کن!', kind:'system', at: new Date().toISOString(), read:false },
  { id:'n2', title:'یادآوری تمرین', body:'جلسه امروزت را فراموش نکن', kind:'reminder', at: new Date().toISOString(), read:false },
];

export async function registerDevice(device: PushDevice){
  if(MODE==='mock'){ await delay(60); return { ok:true, device }; }
  const res = await fetcher('/api/bff/notifications/register',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(device)});
  if(res.status===409) return { ok:true, message:'already-registered' };
  if(!res.ok) throw new Error('Network'); return await res.json();
}
export async function getPrefs(){ if(MODE==='mock'){ await delay(30); return PREFS; }
  const res = await fetcher('/api/bff/notifications/prefs'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function setPrefs(next: Partial<Prefs>){ if(MODE==='mock'){ await delay(40); PREFS = { ...PREFS, ...next, categories: { ...PREFS.categories, ...(next.categories||{}) } }; return PREFS; }
  const res = await fetcher('/api/bff/notifications/prefs',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(next)}); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function listFeed(){ if(MODE==='mock'){ await delay(40); return FEED.slice().sort((a,b)=> b.at.localeCompare(a.at)); }
  const res = await fetcher('/api/bff/notifications/feed'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function markRead(id:string){ if(MODE==='mock'){ await delay(20); const n = FEED.find(x=> x.id===id); if(n) n.read = true; return { ok:true }; }
  const res = await fetcher('/api/bff/notifications/mark-read',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
