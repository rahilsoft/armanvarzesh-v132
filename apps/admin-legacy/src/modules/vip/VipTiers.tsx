import React from 'react';
import { useVip } from '../../../../packages/data/vip/hooks';
export default function VipTiers(){
  const { tiers, state, loading } = useVip();
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>VIP Tiers</h2>
      <div>Current: {state?.tier?.name}</div>
      <ul>{tiers?.map(t=> <li key={t.id}>{t.name} — {t.threshold}</li>)}</ul>
    </div>
  );
}
