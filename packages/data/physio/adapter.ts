const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { PhysioProtocol, PhysioPlan } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
const protocols: PhysioProtocol[] = [
  { id:'pp1', title:'ثبات شانه', focus:'shoulder', steps:['دایره‌شانه x10','Y-T-W x8','کش TheraBand x12'] },
  { id:'pp2', title:'قدرت زانو', focus:'knee', steps:['اسکوات نیمه x12','لانج استاتیک x10','پل گلوت x12'] },
];
let plans: PhysioPlan[] = [];
export async function listProtocols(){ if(MODE==='mock'){ await delay(60); return protocols.slice(); }
  const res = await fetcher('/api/bff/physio/protocols'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function assign(protocolId:string, notes?:string){ if(MODE==='mock'){ await delay(80); const p={ id:'pl_'+Math.random().toString(36).slice(2), protocolId, adherence:0, notes, assignedBy:'coach', createdAt:new Date().toISOString() }; plans.unshift(p); return p; }
  const res = await fetcher('/api/bff/physio/assign',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ protocolId, notes })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function listPlans(){ if(MODE==='mock'){ await delay(60); return plans.slice(); }
  const res = await fetcher('/api/bff/physio/plans'); if(!res.ok) throw new Error('Network'); return await res.json(); }
