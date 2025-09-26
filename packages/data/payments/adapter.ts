const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { PaymentIntent, CardToken, Settlement, Money } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));

let savedCards: CardToken[] = [{ id:'card_4242', brand:'visa', last4:'4242', exp:'12/27' }];
let settlements: Settlement[] = [
  { id:'stl_1', at: new Date().toISOString(), total: 3500000, currency:'IRT', count: 18, status:'pending' }
];

export async function createPaymentIntent(amount:Money){
  if(MODE==='mock'){ await delay(120); return { id:'pi_'+Math.random().toString(36).slice(2), amount, status:'requires_payment', clientSecret:'cs_'+Math.random().toString(36).slice(2) } as PaymentIntent; }
  const res = await fetcher('/api/bff/payments/create-intent',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(amount) });
  if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function confirmPayment(piId:string, card: CardToken){
  if(MODE==='mock'){ await delay(150); const success = card.last4 !== '0000'; return { id:piId, amount:{amount:0,currency:'IRT'}, status: success?'succeeded':'failed' } as PaymentIntent; }
  const res = await fetcher('/api/bff/payments/confirm',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ piId, cardId: card.id })});
  if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function tokenizeCard(number:string, exp:string, cvc:string){
  if(MODE==='mock'){ await delay(80); const last4 = number.slice(-4); return { id:'tok_'+Math.random().toString(36).slice(2), brand:'visa', last4, exp } as CardToken; }
  const res = await fetcher('/api/bff/payments/tokenize',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ number, exp, cvc })});
  if(!res.ok) throw new Error('Network'); return await res.json();
}

export async function listCards(){ if(MODE==='mock'){ await delay(60); return savedCards.slice(); }
  const res = await fetcher('/api/bff/payments/cards'); if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function attachCard(token: CardToken){ if(MODE==='mock'){ await delay(60); savedCards.unshift(token); return token; }
  const res = await fetcher('/api/bff/payments/attach',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ tokenId: token.id })});
  if(!res.ok) throw new Error('Network'); return await res.json(); }

export async function listSettlements(){ if(MODE==='mock'){ await delay(100); return settlements.slice(); }
  const res = await fetcher('/api/bff/payments/settlements'); if(!res.ok) throw new Error('Network'); return await res.json(); }
