import React, { useState } from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useWallet, useWalletHistory, useTopup, useWithdraw } from '../../../packages/data/wallet/hooks';

export default function WalletPage(){
  const { data, loading, error, reload } = useWallet();
  const { data: txns, reload: r2 } = useWalletHistory();
  const { mutate: topup, loading: topuping } = useTopup();
  const { mutate: withdraw, loading: withdrawing } = useWithdraw();
  const [amt,setAmt] = useState('50000');

  return (
    <div dir="rtl">
      <Head><title>کیف پول — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>کیف پول</h1>
      <Card>
        {loading? '...' : error? 'خطا' : <div>موجودی: <b>{data?.balance}</b> {data?.currency}</div>}
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <input value={amt} onChange={e=> setAmt(e.target.value)} />
          <Button busy={topuping} onClick={async()=>{ await topup(Number(amt||'0')); reload(); r2(); }}>شارژ</Button>
          <Button busy={withdrawing} onClick={async()=>{ await withdraw(Number(amt||'0')); reload(); r2(); }}>برداشت</Button>
        </div>
      </Card>
      <Card>
        <h3>تاریخچه</h3>
        {(txns||[]).map(t=> <div key={t.id}>{new Date(t.at).toLocaleString('fa-IR')} — {t.type} — {t.amount}</div>)}
      </Card>
    </div>
  );
}
