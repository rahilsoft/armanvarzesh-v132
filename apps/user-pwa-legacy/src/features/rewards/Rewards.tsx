import React from 'react';
import { useRewards } from '../../../packages/data/rewards/hooks';
export default function Rewards(){
  const { data, loading } = useRewards();
  return (
    <div dir="rtl" style={{padding:12}}>
      <h3>امتیازها (PWA)</h3>
      {loading? '...' : <div>Balance: {data?.balance}</div>}
    </div>
  );
}
