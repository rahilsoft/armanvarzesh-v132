import React, { useState } from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { Button } from '../../../packages/ui/components/Button';
import { Card } from '../../../packages/ui/components/Card';
import { useWallet, useAddFunds, usePay } from '../../../packages/data/payments/hooks';

export default function PaymentsPage(){
  const { data, loading, error, reload } = useWallet();
  const { mutate: add, loading: adding } = useAddFunds();
  const { mutate: pay, loading: paying } = usePay();
  const [amount,setAmount] = useState(100000);
  const [method,setMethod] = useState('card');

  return (
    <div dir="rtl">
      <Head><title>پرداخت‌ها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>کیف پول</h1>
      {loading && <p>در حال بارگذاری…</p>}
      {error && <p>خطا</p>}
      {data && (
        <Card>
          <div>موجودی: <b>{data.balance}</b> {data.currency}</div>
          <div style={{marginTop:12}}>
            <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value||0))} />
            <select value={method} onChange={e=>setMethod(e.target.value)}>
              <option value="card">کارت</option>
              <option value="crypto">کریپتو</option>
            </select>
            <Button onClick={async()=>{ await add(amount, method); reload(); }} busy={adding}>افزودن اعتبار</Button>
            <Button onClick={async()=>{ await pay(50000,'sample'); reload(); }} busy={paying} style={{marginInlineStart:8}}>پرداخت نمونه</Button>
          </div>
          <div style={{marginTop:16}}>
            {data.history.map(h=> <div key={h.id}>{h.type} — {h.amount} — {new Date(h.at).toLocaleString('fa-IR')}</div>)}
          </div>
        </Card>
      )}
    </div>
  );
}
