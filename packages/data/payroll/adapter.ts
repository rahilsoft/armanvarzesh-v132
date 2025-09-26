const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { PayrollSummary } from './schemas';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let summary: PayrollSummary = { total: 1840000, currency:'IRT', items:[
  { id:'py1', period:'1404-05', amount:840000, currency:'IRT', status:'paid' },
  { id:'py2', period:'1404-04', amount:1000000, currency:'IRT', status:'paid' },
]};
export async function getPayroll(){ if(MODE==='mock'){ await delay(150); return summary; }
  const res = await fetch('/api/bff/payroll/summary'); if(!res.ok) throw new Error('Network'); return await res.json(); }
