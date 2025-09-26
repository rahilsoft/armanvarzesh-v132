import React, { useState } from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useCreateIntent, useConfirmPayment, useTokenizeCard, useCards } from '../../../packages/data/payments/hooks';

export default function CheckoutPage(){
  const [amount,setAmount] = useState('199000');
  const { mutate: create, loading: creating } = useCreateIntent();
  const { mutate: confirm, loading: confirming } = useConfirmPayment();
  const { mutate: tokenize, loading: tokenizing } = useTokenizeCard();
  const { data: cards, reload } = useCards();
  const [msg,setMsg] = useState<string>('');

  async function pay(){
    setMsg(''); const pi = await create({ amount: Number(amount||'0'), currency:'IRT' });
    const token = await tokenize('4242424242424242','12/27','123');
    await reload();
    const res = await confirm(pi.id, token);
    setMsg(res.status==='succeeded'? 'پرداخت موفق' : 'پرداخت ناموفق');
  }

  return (
    <div dir="rtl">
      <Head><title>تسویه — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>تسویه</h1>
      <Card>
        <label>مبلغ (IRT): <input value={amount} onChange={e=> setAmount(e.target.value)} /></label>
        <div style={{marginTop:8}}>
          <Button busy={creating||tokenizing||confirming} onClick={pay}>پرداخت کن</Button>
        </div>
        {msg && <p>{msg}</p>}
      </Card>
      <Card>
        <h3>کارت‌های ذخیره‌شده</h3>
        {(cards||[]).map(c=> <div key={c.id}>{c.brand} — **** **** **** {c.last4} — {c.exp}</div>)}
      </Card>
    </div>
  );
}
