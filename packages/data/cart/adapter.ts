const MODE = (process.env.DATA_MODE || 'mock') as 'api'|'mock';
import type { Cart, CartItem } from './schemas';
import { fetcher } from '../../network/fetcher';
const delay = (ms:number)=> new Promise(r=>setTimeout(r,ms));
let CART: Cart = { items: [], subtotal: 0, currency:'IRT' };
function recalc(){ CART.subtotal = CART.items.reduce((s,i)=> s + i.price*i.qty, 0); }
export async function get(){ if(MODE==='mock'){ await delay(20); return CART; }
  const res = await fetcher('/api/bff/cart/get'); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function add(item: CartItem){ if(MODE==='mock'){ await delay(20); const ex = CART.items.find(i=> i.productId===item.productId); if(ex) ex.qty += item.qty; else CART.items.push(item); recalc(); return CART; }
  const res = await fetcher('/api/bff/cart/add',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(item)}); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function setQty(productId:string, qty:number){ if(MODE==='mock'){ await delay(20); const ex = CART.items.find(i=> i.productId===productId); if(ex){ ex.qty = qty; if(ex.qty<=0) CART.items = CART.items.filter(i=> i.productId!==productId); } recalc(); return CART; }
  const res = await fetcher('/api/bff/cart/qty',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ productId, qty })}); if(!res.ok) throw new Error('Network'); return await res.json(); }
export async function clear(){ if(MODE==='mock'){ await delay(10); CART = { items: [], subtotal: 0, currency:'IRT' }; return CART; }
  const res = await fetcher('/api/bff/cart/clear',{ method:'POST' }); if(!res.ok) throw new Error('Network'); return await res.json(); }
