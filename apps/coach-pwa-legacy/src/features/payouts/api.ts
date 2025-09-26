const API = process.env.NEXT_PUBLIC_COACH_URL || 'http://localhost:4093';
const auth = { authorization:'Bearer coach-1' };
export async function requestPayout(amountCents:number, notes?:string){
  const r = await fetch(`${API}/coach/payouts/request`, { method:'POST', headers:{ 'content-type':'application/json', ...auth }, body: JSON.stringify({ amountCents, notes }) });
  return await r.json();
}
export async function myPayouts(){
  const r = await fetch(`${API}/coach/payouts/mine`, { headers: auth });
  return await r.json();
}
