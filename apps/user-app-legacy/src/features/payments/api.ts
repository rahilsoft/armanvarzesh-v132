import { ENV } from '../lib/env';

export async function checkout(productId: string, metadata?: any){
  const res = await fetch(`${ENV.PAYMENTS_URL}/payments/checkout`, { method:'POST', headers:{ 'content-type':'application/json', authorization:'Bearer dev-u1' }, body: JSON.stringify({ productId, metadata }) });
  return await res.json();
}

export async function mySubscription(){
  const res = await fetch(`${ENV.PAYMENTS_URL}/payments/my-subscription`, { headers:{ authorization:'Bearer dev-u1' } });
  return await res.json();
}
