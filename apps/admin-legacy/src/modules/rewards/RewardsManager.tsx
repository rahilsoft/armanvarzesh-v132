import React from 'react';
import { useRewards } from '../../../../packages/data/rewards/hooks';
export default function RewardsManager(){
  const { data, loading, error } = useRewards();
  if(loading) return <div>Loading…</div>;
  if(error) return <div>Error</div>;
  return (
    <div dir="rtl">
      <h2>مدیریت امتیازها</h2>
      <div>Balance: {data?.balance}</div>
    </div>
  );
}
