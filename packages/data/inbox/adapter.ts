const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { InboxThread, InboxItem } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=> setTimeout(r, ms));

let THREADS: InboxThread[] = [
  { id:'t_system', subject:'سیستمی', unread:1, lastAt: new Date().toISOString() },
  { id:'t_marketing', subject:'پیشنهادها', unread:0, lastAt: new Date().toISOString() },
];
let ITEMS: InboxItem[] = [
  { id:'i1', threadId:'t_system', title:'خوش آمد!', body:'حساب شما ایجاد شد.', at: new Date().toISOString(), read:false },
  { id:'i2', threadId:'t_marketing', title:'کد تخفیف', body:'۲۰٪ تخفیف برای شما', at: new Date().toISOString(), read:true },
];

export async function listThreads(){ if(MODE==='mock'){ await delay(30); return THREADS.slice().sort((a,b)=> b.lastAt.localeCompare(a.lastAt)); }
  const res = await fetcher('/api/bff/inbox/threads'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function listItems(threadId:string){ if(MODE==='mock'){ await delay(40); return ITEMS.filter(i=> i.threadId===threadId).sort((a,b)=> b.at.localeCompare(a.at)); }
  const res = await fetcher('/api/bff/inbox/items?threadId='+threadId); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function markRead(id:string){ if(MODE==='mock'){ await delay(20); const it = ITEMS.find(x=> x.id===id); if(it){ it.read = true; const th = THREADS.find(t=> t.id===it.threadId); if(th) th.unread = Math.max(0, th.unread-1);} return { ok:true }; }
  const res = await fetcher('/api/bff/inbox/mark-read',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ id })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
