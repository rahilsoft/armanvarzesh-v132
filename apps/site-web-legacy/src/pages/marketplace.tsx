import React from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useProducts, useAddToCart, useCart, useCheckout } from '../../../packages/data/marketplace/hooks';

export default function MarketplacePage(){
  const { data, loading, error } = useProducts();
  const { mutate: add, loading: adding } = useAddToCart();
  const { data: cart, reload: reloadCart } = useCart();
  const { mutate: checkout, loading: paying } = useCheckout();

  return (
    <div dir="rtl">
      <Head><title>مارکت — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>مارکت</h1>
      {loading? <p>...</p> : error? <p>خطا</p> :
        <div style={{display:'grid', gap:12, gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))'}}>
          {data?.map(p=> <Card key={p.id}>
            <b>{p.title}</b>
            <div>{p.price} IRT</div>
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <Button busy={adding} onClick={async()=>{ await add(p.id,1); reloadCart(); }}>افزودن به سبد</Button>
              <Link href={`/product/${p.id}`}>جزئیات</Link>
            </div>
          </Card>)}
        </div>
      }
      <h2 style={{marginTop:24}}>سبد خرید</h2>
      <Card>
        {cart?.length? cart.map(c=> <div key={c.productId}>{c.productId} × {c.qty}</div>) : 'خالی'}
        <Button busy={paying} onClick={async()=>{ const o=await checkout(); alert('Order '+o.id); reloadCart(); }} style={{marginTop:8}}>تسویه</Button>
      </Card>
    </div>
  );
}
