import React from 'react';
import { useProducts } from '../../../packages/data/marketplace/hooks';
export default function Marketplace(){
  const { data, loading } = useProducts();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>مارکت (PWA)</h3>
      {loading? '...' : (data||[]).map(p=> <div key={p.id}>{p.title} — {p.price}</div>)}
    </div>
  );
}
