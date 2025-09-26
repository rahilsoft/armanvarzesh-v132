import React from 'react';
import { useProducts } from '../../../packages/data/marketplace/hooks';
import { useCartOps } from '../../../packages/data/cart/hooks';
export default function Marketplace(){
  const { data, loading } = useProducts();
  const { add } = useCartOps();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>فروشگاه (PWA)</h3>
      {loading? '...' : (data||[]).map(p=> <div key={p.id}><b>{p.title}</b> — {p.price} <button onClick={()=> add({ productId:p.id, qty:1, price:p.price, title:p.title, currency:p.currency })}>+</button></div>)}
    </div>
  );
}
