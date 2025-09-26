import { ENV } from '../lib/env';

export async function myBookings(){
  const res = await fetch(`${ENV.BOOKING_URL}/booking/mine`, { headers:{ authorization:'Bearer dev-u1' } });
  return await res.json();
}
export async function hold(slotId:string){
  const res = await fetch(`${ENV.BOOKING_URL}/booking/hold`, { method:'POST', headers:{ 'content-type':'application/json', authorization:'Bearer dev-u1' }, body: JSON.stringify({ slotId }) });
  return await res.json();
}
export async function createBooking(coachId:string, slotId:string, mode:'online'|'in_person'){
  const res = await fetch(`${ENV.BOOKING_URL}/booking/create`, { method:'POST', headers:{ 'content-type':'application/json', authorization:'Bearer dev-u1' }, body: JSON.stringify({ coachId, slotId, mode }) });
  return await res.json();
}
export async function cancelBooking(id:string){
  const res = await fetch(`${ENV.BOOKING_URL}/booking/cancel`, { method:'POST', headers:{ 'content-type':'application/json', authorization:'Bearer dev-u1' }, body: JSON.stringify({ id }) });
  return await res.json();
}
export async function reschedule(id:string, slotId:string){
  const res = await fetch(`${ENV.BOOKING_URL}/booking/reschedule`, { method:'POST', headers:{ 'content-type':'application/json', authorization:'Bearer dev-u1' }, body: JSON.stringify({ id, slotId }) });
  return await res.json();
}
