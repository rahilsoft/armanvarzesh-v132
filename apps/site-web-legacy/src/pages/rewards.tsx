import React from 'react';
import Head from 'next/head';
import '../../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useRewards, useEarn, useRedeem } from '../../../packages/data/rewards/hooks';
export default function RewardsPage(){
  const { data, loading, error, reload } = useRewards();
  const { mutate: earn, loading: earning } = useEarn();
  const { mutate: redeem, loading: redeeming } = useRedeem();
  return (
    <div dir="rtl">
      <Head><title>امتیازها — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>امتیازها</h1>
      <Card>
        {loading? '...' : error? 'خطا' :
          <div>
            <div>موجودی: <b>{data?.balance}</b> pts</div>
            <div style={{display:'flex', gap:8, marginTop:8}}>
              <Button busy={earning} onClick={async()=>{ await earn(20); reload(); }}>کسب ۲۰</Button>
              <Button busy={redeeming} onClick={async()=>{ await redeem(10); reload(); }}>خرج ۱۰</Button>
            </div>
            <div style={{marginTop:12}}>
              {(data?.history||[]).map(h=> <div key={h.id}>{h.type} — {h.points} — {new Date(h.at).toLocaleString('fa-IR')}</div>)}
            </div>
          </div>
        }
      </Card>
    </div>
  );
}
