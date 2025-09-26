import React from 'react';
import { useCart, useCartOps } from '../../../packages/data/cart/hooks';
export default function Cart(){
  const { data, loading, reload } = useCart();
  const { setQty, clear } = useCartOps();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>سبد (PWA)</h3>
      {loading? '...' : (data?.items||[]).map(it=> <div key={it.productId}>{it.title} x {it.qty} <button onClick={async()=>{ await setQty(it.productId, it.qty+1); await reload(); }}>+</button></div>)}
      <div>جمع: {data?.subtotal}</div>
    </div>
  );
}
