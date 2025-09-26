import React from 'react';
import Head from 'next/head';
import { AuthProvider, useAuth } from '../../../packages/auth/context';
import { Guard } from '../../../packages/security/guards/react';

import '../../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { Button } from '../../../packages/ui/components/Button';
import { useAffiliate, useAffiliatePayout } from '../../../packages/data/affiliate/hooks';

export default function AffiliatePageGuardedWrapper(){
  return (<AuthProvider><AffiliatePageInner/></AuthProvider>);
}

function AffiliatePageInner(){
  const { role } = useAuth();
function AffiliatePage(){
  const { data, loading, error, reload } = useAffiliate();
  const { mutate: payout, loading: paying } = useAffiliatePayout();
  return (
    <div dir="rtl">
      <Guard role={role} feature="affiliate" action="view" fallback={<p>دسترسی غیرمجاز</p>}>
      <Head><title>افیلیت — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>افیلیت</h1>
      <Card>
        {loading? '...' : error? 'خطا' : !data? 'خالی' :
          <div>
            <div>کد: <b>{data.code}</b></div>
            <div>کلیک‌ها: {data.clicks} — ثبت‌نام‌ها: {data.signups}</div>
            <div>کارمزد: {data.commission} {data.currency}</div>
            <Button busy={paying} onClick={async()=>{ await payout(); reload(); }}>درخواست تسویه</Button>
          </div>
        }
      </Card>
    </Guard>
    </div>
  );
}

