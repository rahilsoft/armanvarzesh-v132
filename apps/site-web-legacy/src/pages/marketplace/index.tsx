import React from 'react';
import Head from 'next/head';
import '../styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useProducts } from '../../../packages/data/marketplace/hooks';
import { useCartOps } from '../../../packages/data/cart/hooks';

export default function Marketplace(){
  const { data, loading } = useProducts();
  const { add, loading: adding } = useCartOps();
  return (
    <div dir="rtl">
      <Head><title>فروشگاه — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>فروشگاه</h1>
      <Link href="/cart">مشاهده سبد</Link>
      <div style={{display:'grid', gap:12, marginTop:12}}>
        {loading? '...' : (data||[]).map(p=> <Card key={p.id}>
          <b>{p.title}</b> — {p.price.toLocaleString()} {p.currency}
          <div style={{display:'flex', gap:8}}>
            <Button busy={adding} onClick={()=> add({ productId:p.id, qty:1, price:p.price, title:p.title, currency:p.currency })}>افزودن به سبد</Button>
          </div>
        </Card>)}
      </div>
    </div>
  );
}
