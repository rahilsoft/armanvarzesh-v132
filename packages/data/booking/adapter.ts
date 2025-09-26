/**
 * DATA_MODE controls adapter: 'api' | 'mock'
 * Keep contract constant so UI can switch without code changes.
 */
const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';

export type Booking = { id:string; when:string; notes?:string; status:'scheduled'|'canceled'|'completed' };

const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));

let mockDb: Booking[] = [
  { id:'b1', when:new Date().toISOString(), notes:'Initial mock', status:'scheduled' }
];

export async function listBookings(): Promise<Booking[]>{
  if(MODE==='mock'){ await delay(300); return mockDb.slice(); }
  // TODO: replace with real API call
  const res = await fetch('/api/bff/booking/list'); if(!res.ok) throw new Error('Network');
  return await res.json();
}

export async function createBooking(input:{when:string; notes?:string}): Promise<Booking>{
  if(MODE==='mock'){ await delay(400); const b={id:String(Date.now()), status:'scheduled' as const, ...input}; mockDb.unshift(b); return b; }
  const res = await fetch('/api/bff/booking/create',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(input)});
  if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function cancelBooking(id:string): Promise<{ok:true}>{
  if(MODE==='mock'){ await delay(250); mockDb = mockDb.map(b=> b.id===id? {...b, status:'canceled'}: b); return {ok:true}; }
  const res = await fetch('/api/bff/booking/cancel',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({id})});
  if(!res.ok) throw new Error('Network'); return await res.json();
}
