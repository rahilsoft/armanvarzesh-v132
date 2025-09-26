import React from 'react';
import Head from 'next/head';
import './styles/booking.module.css';
import Link from 'next/link';
import { Card } from '../../packages/ui/components/Card';
import { Button } from '../../packages/ui/components/Button';
import { useCart, useCartOps } from '../../packages/data/cart/hooks';

export default function CartPage(){
  const { data, loading, reload } = useCart();
  const { setQty, clear, loading: working } = useCartOps();
  if(loading) return <div dir="rtl">...</div>;
  return (
    <div dir="rtl">
      <Head><title>سبد خرید — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>سبد خرید</h1>
      <Card>
        {(data?.items||[]).length===0? <div>سبد خالی است</div> :
          <div style={{display:'grid', gap:8}}>
            {data.items.map((it:any)=>(
              <div key={it.productId} style={{display:'flex', gap:8, alignItems:'center'}}>
                <b style={{minWidth:160}}>{it.title}</b>
                <span>{it.price.toLocaleString()} {it.currency}</span>
                <input type="number" value={it.qty} onChange={async(e)=>{ await setQty(it.productId, Number(e.target.value)); await reload(); }} style={{width:64}} />
              </div>
            ))}
            <div><b>جمع جزء:</b> {data.subtotal.toLocaleString()} {data.currency}</div>
            <div style={{display:'flex', gap:8}}>
              <Button onClick={async()=>{ await clear(); await reload(); }} busy={working}>خالی کردن</Button>
              <Link href="/checkout"><Button>تسویه</Button></Link>
            </div>
          </div>
        }
      </Card>
    </div>
  );
}
