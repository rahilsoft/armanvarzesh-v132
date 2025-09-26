const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Status } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let snapshot: Status[] = [
  { service:'api-gateway', status:'up', latency: 120, checkedAt: new Date().toISOString() },
  { service:'payments', status:'up', latency: 180, checkedAt: new Date().toISOString() },
  { service:'notifications', status:'degraded', latency: 450, checkedAt: new Date().toISOString() },
];
export async function getStatus(){ if(MODE==='mock'){ await delay(70); return snapshot.slice(); }
  const res = await fetcher('/api/bff/status'); if(!res.ok) throw new Error('Network'); return await res.json(); }
