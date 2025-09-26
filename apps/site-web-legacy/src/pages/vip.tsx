import React from 'react';
import Head from 'next/head';
import { AuthProvider, useAuth } from '../../../packages/auth/context';
import { Guard } from '../../../packages/security/guards/react';

import '../../styles/booking.module.css';
import { Card } from '../../../packages/ui/components/Card';
import { useVip } from '../../../packages/data/vip/hooks';

export default function VipPageGuardedWrapper(){
  return (<AuthProvider><VipPageInner/></AuthProvider>);
}

function VipPageInner(){
  const { role } = useAuth();
function VipPage(){
  const { tiers, state, loading, error } = useVip();
  return (
    <div dir="rtl">
      <Guard role={role} feature="vip" action="view" fallback={<p>دسترسی غیرمجاز</p>}>
      <Head><title>VIP — آرمان ورزش</title></Head>
      <link rel="stylesheet" href="/packages/ui/tokens/tokens.css" />
      <h1>VIP</h1>
      {loading? '...' : error? 'خطا' :
        <div style={{display:'grid', gap:12}}>
          <Card>
            <div>سطح فعلی: {state?.tier?.name} — پیشرفت: {state?.progress}</div>
            {state?.next && <div>مرحله بعد: {state?.next?.name} (آستانه: {state?.next?.threshold})</div>}
          </Card>
          <Card>
            <h3>سطوح</h3>
            <ul>{(tiers||[]).map(t=> <li key={t.id}>{t.name}: {t.benefits.join(', ')}</li>)}</ul>
          </Card>
        </div>
      }
    </Guard>
    </div>
  );
}

