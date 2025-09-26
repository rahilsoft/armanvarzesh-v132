import React from 'react';
import { useAffiliate } from '../../../../packages/data/affiliate/hooks';
export default function AffiliateManager(){
  const { data, loading } = useAffiliate();
  if(loading) return <div>Loading…</div>;
  return (
    <div dir="rtl">
      <h2>Affiliate</h2>
      <div>Code: {data?.code}</div>
      <div>Clicks: {data?.clicks} — Signups: {data?.signups}</div>
      <div>Commission: {data?.commission} {data?.currency}</div>
    </div>
  );
}
