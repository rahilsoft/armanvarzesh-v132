const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Wallet, WalletTxn } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let wallet: Wallet = { balance: 125000, currency:'IRT' };
let txns: WalletTxn[] = [
  { id:'w1', type:'in', amount:50000, currency:'IRT', ref:'topup', at: new Date().toISOString() },
  { id:'w2', type:'out', amount:25000, currency:'IRT', ref:'purchase', at: new Date().toISOString() },
];
export async function getWallet(){ if(MODE==='mock'){ await delay(80); return wallet; }
  const res = await fetcher('/api/bff/wallet/get'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function getHistory(){ if(MODE==='mock'){ await delay(80); return txns.slice(); }
  const res = await fetcher('/api/bff/wallet/history'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function topup(amount:number){ if(MODE==='mock'){ await delay(120); wallet.balance += amount; txns.unshift({ id:String(Date.now()), type:'in', amount, currency:'IRT', ref:'topup', at:new Date().toISOString() }); return wallet; }
  const res = await fetcher('/api/bff/wallet/topup',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ amount })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function withdraw(amount:number){ if(MODE==='mock'){ await delay(120); wallet.balance -= amount; txns.unshift({ id:String(Date.now()), type:'out', amount, currency:'IRT', ref:'withdraw', at:new Date().toISOString() }); return wallet; }
  const res = await fetcher('/api/bff/wallet/withdraw',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ amount })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
